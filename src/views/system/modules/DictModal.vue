<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :class="[['show'].includes(operateType) ? 'view-form' : null]">
        <a-row :gutter="16">
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="字典名称" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入字典名称"
                v-decorator="[ 'name', validatorRules.name]"
              />
              <template v-else>{{ model.name }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="字典编码" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入字典编码"
                v-decorator="[ 'code', validatorRules.code]"
              />
              <template v-else>{{ model.code }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="字典类型">
              <a-radio-group
                v-if="['add', 'edit'].includes(operateType)"
                buttonStyle="solid"
                v-decorator="['type', {initialValue: toString(model.type) || '0'}]"
              >
                <a-radio-button value="0">一级</a-radio-button>
                <a-radio-button value="1">多级</a-radio-button>
              </a-radio-group>
              <template v-else>
                <a-tag v-if="!model.type || toString(model.type) === '0'" color="green">一级</a-tag>
                <a-tag v-else color="blue">多级</a-tag>
              </template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="描述" hasFeedback>
              <a-textarea
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入描述"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-decorator="[ 'description']"
              />
              <template v-else>{{ model.description }}</template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-popconfirm
        v-if="['add', 'edit'].includes(operateType)"
        title="确定取消吗?"
        @confirm="() => handleCancel()"
      >
        <a-button>取消</a-button>
      </a-popconfirm>
      <a-button @click="handleCancel" v-else>关闭</a-button>

      <a-button
        class="m-l-8"
        @click="handleOk"
        v-if="['add', 'edit'].includes(operateType)"
        type="primary"
      >确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { Modal, Spin, Form, Row, Col, Input, Button, Popconfirm, Radio, Tag } from 'ant-design-vue'
import toString from 'lodash.tostring'

import ModalMixin from '@/mixins/ModalMixin'
import { isChinese } from '@/utils/validate'
import { request } from '@/api'

export default {
  name: 'OneModal',
  mixins: [ModalMixin],
  components: {
    AModal: Modal,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ATextarea: Input.TextArea,
    AButton: Button,
    APopconfirm: Popconfirm,
    ARadioGroup: Radio.Group,
    ARadioButton: Radio.Button,
    ATag: Tag
  },
  data() {
    return {
      title: '操作',
      operateType: 'add',
      formColResponsiveCfg: {
        xs: 24,
        sm: 12
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
          md: { span: 6 },
          lg: { span: 5 },
          xl: { span: 5 },
          xxl: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
          md: { span: 16 },
          lg: { span: 17 },
          xl: { span: 17 },
          xxl: { span: 17 }
        }
      },
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入字典名称!' }] },
        code: { rules: [{ required: true, message: '请选择字典编码!' }, { validator: this.validateCode }] }
      },
      api: {
        add: {
          url: '/system/dicts',
          method: 'post'
        },
        edit: {
          url: '/system/dicts',
          method: 'patch'
        },
        getById: {
          url: '/system/dicts/{id}',
          method: 'get'
        },
        duplicateCheck: {
          url: '/system/dicts/duplicate/check',
          method: 'post'
        }
      },
      aliveFormDataKey: 'dictFormData',
      formFields: ['name', 'code', 'description']
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
    validateCode(rule, value, callback) {
      if (isChinese(value)) {
        callback('字典编码不可输入汉字!')
      } else if (value) {
        request({
          ...this.api.duplicateCheck,
          params: {
            fieldName: 'code',
            fieldVal: value,
            conditions: this.model.id ? [{ field: 'id', rule: 'ne', val: toString(this.model.id) }] : []
          }
        }).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      } else {
        callback()
      }
    }
  }
}
</script>

<style scoped>
</style>
