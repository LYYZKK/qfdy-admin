<template>
  <a-drawer
    width="768"
    :title="title"
    placement="right"
    :visible="visible"
    @close="() => this.visible = false"
  >
    <a-spin :spinning="confirmLoading">
      <a-row id="promotion-channel">
        <a-row class="m-b-15">
          <div>
            <a-row>
              <header class="bold">基本信息</header>
              <a-divider />
            </a-row>
            <a-row>
              <a-form :form="form">
                <a-form-item label="名称" :label-col="{span:2}" :wrapper-col="{ span: 8 }">
                  <a-input placeholder="请输入名称" v-decorator="['name',validatorRules.name]" />
                </a-form-item>
                <a-form-item label="说明" :label-col="{span:2}" :wrapper-col="{ span: 22 }">
                  <a-textarea rows="2" v-decorator="['description',{}]" />
                </a-form-item>
              </a-form>
            </a-row>
          </div>
          <div>
            <a-row>
              <header class="bold">推广信息</header>
              <a-divider />
            </a-row>
            <a-form :form="form" layout="inline" class="extend-form">
              <a-row :gutter="5">
                <a-col :span="12">
                  <a-form-item>
                    <span clot="label">
                      <span class="required-mask">*</span>
                      表单模板&nbsp;
                      <a-tooltip title="渲染推广页面的模板">
                        <a-icon type="info-circle" />
                      </a-tooltip>&nbsp;
                    </span>
                    <a-select v-decorator="['fmId',validatorRules.fmId]" showSearch>
                      <a-select-option
                        v-for="(item,index) in formTempOpt"
                        :key="index"
                        :value="item.id"
                      >{{ item.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item>
                    <span clot="label">
                      <span class="required-mask">*</span>
                      链接数量&nbsp;
                      <a-tooltip title="渠道推广活动需要使用的链接数量">
                        <a-icon type="info-circle" />
                      </a-tooltip>&nbsp;
                    </span>
                    <a-input-number
                      :disabled="disabledChangeNum"
                      v-decorator="['urlCount',validatorRules.urlCount]"
                      :min="1"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-row>
        <a-row class="footer-btn-container">
          <a-button @click="handleCloseSelf">取消</a-button>
          <a-button type="primary" @click="handleOk">确定</a-button>
        </a-row>
      </a-row>
    </a-spin>
  </a-drawer>
</template>

<script>
import constantConfig from '@/config/constant.config'
import ModalMixin from '@/mixins/ModalMixin'
import { request } from '@/api'
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Divider,
  Icon,
  Tooltip,
  Select,
  InputNumber,
  Drawer,
  Spin
} from 'ant-design-vue'
export default {
  name: 'PromotionChannel',
  mixins: [ModalMixin],
  components: {
    ARow: Row,
    ACol: Col,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ATextarea: Input.TextArea,
    AButton: Button,
    ADivider: Divider,
    AIcon: Icon,
    ATooltip: Tooltip,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInputNumber: InputNumber,
    ADrawer: Drawer,
    ASpin: Spin
  },
  data() {
    return {
      title: null,
      operateType: null,
      disabledChangeNum: false,
      // form: this.$form.createForm(this),
      formTempOpt: [],
      confirmLoading: false,
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入名称' }] },
        fmId: { rules: [{ required: true, message: '选择表单模板' }] },
        urlCount: { rules: [{ required: true, message: '请输入链接数量' }] }
      },
      api: {
        add: {
          url: '/contact/promotion-channel',
          method: 'post'
        },
        edit: {
          url: '/contact/promotion-channel',
          method: 'patch'
        },
        getById: {
          url: '/contact/promotion-channel/{id}',
          method: 'get'
        },
        getFormTemp: {
          url: '/system/forms'
        }
      },
      channelIndex: null,
      model: {},
      formFields: ['name', 'description', 'fmId', 'urlCount']
    }
  },
  methods: {
    openSelf(type, record, index) {
      this.operateType = type
      if (type === 'add') {
        this.title = '新建网络引流渠道'
        this.disabledChangeNum = false
        this.add()
      } else {
        this.title = '编辑网络引流渠道'
        this.disabledChangeNum = true
        this.channelIndex = index
        this.edit(record)
      }
    },
    handleCloseSelf() {
      this.visible = false
    },
    beforeHandleOkRequest() {
      this.confirmLoading = true
    },
    afterHandleOkRequest(res) {
      if (res.success) {
        this.confirmLoading = false
        this.$emit('refresh', { data: res.data, operateType: this.operateType, channelIndex: this.channelIndex })
      }
    },
    // 查询表单模板
    getFormTemp() {
      request({ ...this.api.getFormTemp, params: { pageSize: constantConfig.MAX_PAGE_SIZE } }).then(res => {
        if (res.success) {
          this.formTempOpt = res.data
        }
      })
    }
  },
  beforeMount() {
    this.getFormTemp()
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#promotion-channel {
  background: #fff;
  padding: 10px;
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
        // margin-left: 3px;
        width: 70%;
      }
    }
  }
}
</style>
