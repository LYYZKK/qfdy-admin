<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :class="[['show'].includes(operateType) ? 'view-form' : null]">
        <a-card :bordered="false">
          <a-row :gutter="16">
            <a-col
              class="gutter-row"
              v-bind="formColResponsiveCfg"
              v-if="!['add'].includes(operateType)"
            >
              <a-form-item v-bind="formItemResponsiveCfg" label="短信模板编号" hasFeedback>
                <template>{{ model.templateCode }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="短信模板名称" hasFeedback>
                <a-select
                  v-if="['add'].includes(operateType)"
                  v-decorator="['code', validatorRules.code]"
                  placeholder="请选择短信模板"
                  @change="changeSmsTemplate"
                >
                  <a-select-option
                    v-for="(item,key) in smsTemplates"
                    :key="key"
                    :remark="item"
                    :value="item.code"
                  >{{ item.name }}</a-select-option>
                </a-select>
                <template v-else>{{ model.templateName }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item
                v-bind="formItemResponsiveCfg"
                label="手机号码"
                hasFeedback
                :extra="['add'].includes(operateType) ? phoneStatement :''"
              >
                <a-textarea
                  v-if="['add'].includes(operateType)"
                  v-decorator="['phones', validatorRules.phones]"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                />
                <template v-else>{{ model.phone }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="短信内容" hasFeedback>
                <a-textarea
                  v-if="['add'].includes(operateType)"
                  v-model="model.content"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                />
                <template v-else>{{ model.content }}</template>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-card
          title="短信参数"
          :bordered="false"
          v-if="model.templateParams && model.templateParams.length > 0 && ['add'].includes(operateType)"
        >
          <a-row :gutter="16">
            <a-col
              class="gutter-row"
              v-bind="paramsFormColResponsiveCfg"
              v-for="(item, index) in model.templateParams"
              :key="index"
            >
              <a-form-item v-bind="paramsFormItemResponsiveCfg" hasFeedback :label="item">
                <a-input
                  @change="syncSmsContent"
                  v-decorator="[item, { rules: [{ required: true, message: '请输入变量值' }] } ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-popconfirm
        v-if="['add'].includes(operateType)"
        title="确定取消吗?"
        @confirm="() => handleCancel()"
      >
        <a-button>取消</a-button>
      </a-popconfirm>
      <a-button @click="handleCancel" v-else>关闭</a-button>

      <a-button
        class="m-l-8"
        @click="handleSubmit"
        v-if="['add'].includes(operateType)"
        type="primary"
      >确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import replace from 'lodash.replace'
import pick from 'lodash.pick'
import ModalMixin from '@/mixins/ModalMixin'

import {
  Modal,
  Spin,
  Divider,
  Select,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Card
} from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import { request } from '@/api'
import { isMobileWithComma } from '@/utils/validate'
import constantConfig from '@/config/constant.config'

export default {
  name: 'OneModal',
  mixins: [ModalMixin],
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    ADivider: Divider,
    AModal: Modal,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ATextarea: Input.TextArea,
    AInputNumber: InputNumber,
    AButton: Button,
    APopconfirm: Popconfirm,
    ACard: Card,
    JDictSelectTag,
    JDictViewTag,
    JDate
  },
  data() {
    return {
      title: '操作',
      operateType: 'add',
      formColResponsiveCfg: {
        xs: 24,
        sm: 24
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 }
        }
      },
      paramsFormColResponsiveCfg: {
        xs: 24,
        sm: 12
      },
      paramsFormItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 9 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        }
      },
      validatorRules: {
        code: { rules: [{ required: true, message: '请选择短信模板！' }] },
        phones: { rules: [{ required: true, message: '请输入手机号码!' }, { validator: this.validatePhones }] },
        param: { rules: [{ required: true, message: '请输入变量值！' }] }
      },
      api: {
        getById: {
          url: '/message/sms/records/templates/{id}',
          method: 'get'
        },
        getTemplates: {
          url: '/message/sms/templates',
          method: 'get'
        },
        sendMessage: {
          url: '/message/sms/records/send',
          method: 'post'
        }
      },
      smsTemplates: [], // 所有短信模板
      templateParams: [], // 模板参数
      formFields: ['code', 'name', 'phones', 'content', 'signName', 'param'],
      originalSmsContent: '',
      phoneStatement: '说明：多个号码请用英文逗号隔开',
      paramRegex: /(?<={).*?(?=})/g
    }
  },
  methods: {
    /**
     * 点击确认按钮向后台传输的表单数据处理.
     *
     * 注：此方法返回的数据会直接传向后台.
     */
    getFormData(formData) {
      Object.keys(formData).forEach(k => {
        if (typeof formData[k] === 'string') {
          formData[k] = formData[k].trim()
        }
      })
      return formData
    },
    beforeAdd() {
      const _this = this
      request({ ..._this.api.getTemplates, params: { pageSize: constantConfig.MAX_PAGE_SIZE } }).then(res => {
        if (res.success) {
          _this.smsTemplates = res.data
        }
      })
      if (!this.model.templateParams) {
        this.model.templateParams = this.model.content ? this.model.content.match(this.paramRegex) || [] : []
      }
      this.setParamFieldsValue()
    },
    changeSmsTemplate(v, vnode) {
      const template = vnode.data.attrs.remark

      this.model.signName = template.signName
      this.model.content = template.content
      this.model.name = template.name
      this.originalSmsContent = template.content

      if (template.content.indexOf('${') !== -1) {
        this.model.templateParams = template.content.match(this.paramRegex)
        this.setParamFieldsValue()
      } else {
        this.model.templateParams = []
      }
    },
    setParamFieldsValue() {
      const _this = this
      _this.$nextTick(() => {
        if (_this.model.templateParams && _this.model.templateParams.length > 0) {
          _this.form.setFieldsValue(pick(_this.model, ..._this.model.templateParams))
        }
      })
    },
    syncSmsContent(e) {
      this.model[e.target.id] = e.target.value
      let tempSmsContent = this.originalSmsContent
      this.model.templateParams.forEach(paramName => {
        if (this.model[paramName]) {
          tempSmsContent = replace(tempSmsContent, '${' + paramName + '}', this.model[paramName])
        }
      })
      this.model.content = tempSmsContent
    },
    saveModuleAliveData() {
      this.$emit('saveAliveData', {
        key: 'templateParams',
        val: this.model.templateParams
      })
    },
    handleSubmit() {
      const _this = this
      _this.form.validateFields((err, values) => {
        if (!err) {
          if (_this.model.templateParams && _this.model.templateParams.length > 0) {
            _this.model['params'] = {}
            _this.model.templateParams.forEach(item => {
              _this.model.params[item] = _this.model[item]
            })
          }
          _this.confirmLoading = true
          let formData = Object.assign(_this.model, values)
          formData = _this.getFormData(formData)
          request({ ..._this.api.sendMessage, params: formData })
            .then(res => {
              if (res.success) {
                _this.close(res.success)
                _this.$message.success(res.message)
                _this.$emit('ok')
              } else {
                _this.$message.warning(res.message)
                _this.$emit('ok')
              }
            })
            .finally(() => {
              _this.confirmLoading = false
            })
        }
      })
    },
    validatePhones(rule, value, callback) {
      if (!isMobileWithComma(value)) {
        callback('请输入英文逗号分隔的手机号码!')
      } else {
        callback()
      }
    }
  }
}
</script>

<style scoped>
.send-notice {
  margin-left: 30%;
}
</style>
