<template>
  <a-card id="ringOffSummary" :bordered="false" :class="tablet ? 'pad' : device">
    <a-form :form="form">
      <a-form-item label="小结" v-bind="formLayout" hasFeedback>
        <a-tree-select
          showSearch
          treeNodeFilterProp="title"
          :treeData="treeData"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择"
          allowClear
          treeDefaultExpandAll
          v-decorator="['summaryItemId', validatorRules.summaryItemId]"
          @change="handleChange"
        />
      </a-form-item>
      <a-form-item
        label="预约时间"
        v-bind="formLayout"
        v-if="submitParams.summaryStatus === '3'"
        hasFeedback
      >
        <j-date
          :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择预约时间"
          v-decorator="['appointmentTime', validatorRules.appointmentTime]"
          :disabledDate="disabledDate"
        />
      </a-form-item>
      <a-form-item label="小结备注" v-bind="formLayout">
        <a-textarea :autosize="{ minRows: 4, maxRows: 6 }" v-decorator="['summaryRemark', {}]" />
      </a-form-item>

      <a-button type="primary" @click="handleSubmit" :disabled="stopSubmit" class="m-l-35">提交小结</a-button>
    </a-form>
  </a-card>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import { Row, Col, Card, Button, Input, Form, TreeSelect, DatePicker } from 'ant-design-vue'
import { request } from '@/api'
import { buildTreeDataForAntd } from '@/utils/util'
import moment from 'moment'
import { mapState } from 'vuex'
import JDate from '@/components/jeecg/JDate.vue'

export default {
  name: 'RingOffSummary',
  mixins: [mixinDevice, KeepAliveMixin],
  components: {
    ARow: Row,
    ACol: Col,
    ACard: Card,
    AButton: Button,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ATreeSelect: TreeSelect,
    ATreeSelectNode: TreeSelect.TreeNode,
    ATextarea: Input.TextArea,
    ADatePicker: DatePicker,
    JDate
  },
  computed: {
    ...mapState({
      // taskData: state => state.my.taskData.data,
      activeTaskTabIndex: state => state.my.activeTaskTabIndex
    })
  },
  data() {
    return {
      formLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
      },
      comeFrom: '',
      treeData: [],
      treeidMap: [],
      form: this.$form.createForm(this),
      validatorRules: {
        summaryItemId: { rules: [{ required: true, message: '请选择小结' }] },
        appointmentTime: {
          rules: [{ required: true, message: '请选择预约时间' }, { validator: this.validateAppointmentTime }]
        }
      },
      submitParams: {
        id: null,
        summaryItemId: null,
        summaryRemark: null,
        summaryStatus: null
      },
      api: {
        getSummeryTree: {
          url: '/contact/summary-items/list/tree'
        },
        submitSummary: {
          url: '/contact/records',
          method: 'patch'
        }
      },
      stopSubmit: true
    }
  },
  methods: {
    moment,
    getSummeryTree() {
      request({ ...this.api.getSummeryTree }).then(res => {
        if (res.success) {
          this.treeData = buildTreeDataForAntd({ data: res.data }).data
          this.treeidMap = buildTreeDataForAntd({ data: res.data }).idMap
        }
      })
    },
    disabledDate(current) {
      // 不能当天之前的日期
      return (
        current &&
        current <
          moment()
            .endOf('day')
            .subtract(1, 'days')
      )
    },
    handleChange(val) {
      this.getSummeryStatus(parseInt(val))
      if (val) {
        this.stopSubmit = false
      } else {
        this.stopSubmit = true
      }
    },
    getSummeryStatus(summaryItemId) {
      if (this.treeidMap[summaryItemId].parentId) {
        const id = parseInt(this.treeidMap[summaryItemId].parentId)
        this.getSummeryStatus(id)
      } else {
        this.submitParams.summaryStatus = this.treeidMap[summaryItemId].id
      }
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$store.state.cti.reasoncode !== '14') {
            this.$message.error('请先挂断电话再提交小结')
            return false
          } else {
            this.submitParams = { ...this.submitParams, ...values }

            this.$store.state.cti.contactRecordIds.forEach((recordId, idx) => {
              this.submitParams.id = recordId

              request({
                ...this.api.submitSummary,
                params: this.submitParams
              }).then(res => {
                if (res.success && idx === 0) {
                  this.$message.success(res.message)
                  // 第一条主接触历史小结保存成功后完成通话.
                  this.$store.dispatch('CompleteCall')
                  this.$store.dispatch('backToContactTask', this.activeTaskTabIndex)
                } else {
                  this.$message.error(res.message)
                }
              })
            })
          }
        }
      })
    },
    validateAppointmentTime(rule, value, callback) {
      if (value) {
        if (moment(value, 'YYYY-MM-DD HH:mm:ss').isBefore(moment())) {
          callback('请预约在当前时间之后')
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
  },
  beforeMount() {
    this.getSummeryTree()
  }
}
</script>
<style lang="scss" scoped>
textarea.ant-input {
  resize: none;
}
.hideColon {
  ::v-deep label:after {
    content: '';
  }
}
</style>
