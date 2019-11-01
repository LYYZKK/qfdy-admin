<template>
  <a-modal
    :width="600"
    :title="choiceSeat.title"
    :visible="choiceSeat.visible"
    @cancel="() => this.choiceSeat.visible = false"
  >
    <a-row>
      <a-form :form="form">
        <a-form-item label="坐席组" :label-col="{span: 4}" :wrapper-col="{ span: 16 }" hasFeedback>
          <a-tree-select
            showSearch
            :treeData="treeData"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择"
            allowClear
            treeCheckable
            treeDefaultExpandAll
            :treeCheckStrictly="true"
            v-decorator="['seat', validatorRules.seat]"
          />
        </a-form-item>
      </a-form>
    </a-row>

    <template slot="footer">
      <a-row class="footer-btn-container">
        <a-button @click="handleCloseSelf">取消</a-button>
        <a-button type="primary" @click="handleSubmit">确定</a-button>
      </a-row>
    </template>
  </a-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import CommonMixin from '@/mixins/CommonMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import { Row, Col, Form, Input, Button, Divider, Tooltip, Modal, TreeSelect } from 'ant-design-vue'
import { request } from '@/api'
import { buildTreeDataForAntd } from '@/utils/util'

export default {
  name: 'SaleChannel',
  mixins: [mixinDevice, CommonMixin, KeepAliveMixin],
  components: {
    ARow: Row,
    ACol: Col,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ATextarea: Input.TextArea,
    AButton: Button,
    ADivider: Divider,
    ATooltip: Tooltip,
    AModal: Modal,
    ATreeSelect: TreeSelect,
    ATreeSelectNode: TreeSelect.TreeNode
  },
  data() {
    return {
      choiceSeat: {
        title: '选择坐席组',
        visible: false
      },
      operateType: null,
      disabledChangeNum: false,
      value: null,
      treeData: [],
      treeIdMap: [],
      checkedUserGroup: [],
      form: this.$form.createForm(this),
      validatorRules: {
        seat: { rules: [{ required: true, message: '请选择坐席组' }] }
      },
      api: {
        getTreeSelectData: {
          url: '/user/usergroups/list/tree'
        },
        getUsergroups: {
          url: '/user/usergroups/{ids}/ugskillpax'
        }
      }
    }
  },
  methods: {
    openSelf(type, record) {
      this.choiceSeat.visible = true
      // 1为呼入 2为呼出
      this.operateType = type === '1' ? 'in' : 'out'
      this.checkedUserGroup = record.expandedRowData
      this.getTreeSelectData()
    },
    handleCloseSelf() {
      this.choiceSeat.visible = false
    },
    getTreeSelectData() {
      request({ ...this.api.getTreeSelectData }).then(res => {
        if (res.success) {
          const tree = buildTreeDataForAntd({ data: res.data })
          // 替换treeSelect树对象的属性
          this.treeData = tree.data
          this.treeIdMap = tree.idMap
          let seat = []
          if (this.checkedUserGroup && this.checkedUserGroup.length) {
            for (let i = 0; i < this.checkedUserGroup.length; i++) {
              seat.push({ label: this.treeIdMap[this.checkedUserGroup[i].id].name, value: this.checkedUserGroup[i].id })
            }
            this.$nextTick(() => {
              this.form.setFieldsValue({ seat: seat })
            })
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 提交前需要将加上的key去除并去重
    beforeSubmit(values) {
      let value = []
      value = values.seat.map(item => {
        // return item.value.split('-')[0]
        return item.value
      })
      value = Array.from(new Set(value))
      return value
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const value = this.beforeSubmit(values)
          request({
            ...this.api.getUsergroups,
            urlReplacements: [{ substr: '{ids}', replacement: value.join(',') }]
          }).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.form.resetFields(['seat'])
              this.$emit('refresh', { data: res.data, type: this.operateType })
              this.choiceSeat.visible = false
            } else {
              this.$message.warning(res.message)
              this.choiceSeat.visible = true
            }
          })
        }
      })
    }
  },
  beforeMount() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#operation-channel {
  background: #fff;
  padding: 10px;
  .ant-divider-horizontal {
    margin: 5px 0 !important;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }
  textarea.ant-input {
    resize: none;
  }
  .footer-btn-container {
    text-align: right;
    .ant-btn {
      margin: 0 3px;
    }
  }
  .extend-form {
    .ant-form-item {
      width: 100%;
    }
    ::v-deep .ant-form-item-control-wrapper {
      width: 100%;
      .ant-select {
        width: 70%;
      }
    }
  }
}
</style>
