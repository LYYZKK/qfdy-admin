<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :class="[['show'].includes(operateType) ? 'view-form' : null]">
        <a-row :gutter="16">
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="活动名称" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入活动名称"
                v-decorator="['name', validatorRules.name]"
              />
              <template v-else>{{ model.name }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="说明" hasFeedback>
              <a-textarea
                rows="2"
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入活动说明"
                v-decorator="['description', {}]"
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
import ModalMixin from '@/mixins/ModalMixin'

import { Modal, Spin, Form, Row, Col, Input, Button, Popconfirm } from 'ant-design-vue'


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
    APopconfirm: Popconfirm
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
        name: { rules: [{ required: true, message: '请输入活动名称!' }] }
      },
      api: {
        add: {
          url: '/contact/campaigns',
          method: 'post'
        },
        edit: {
          url: '/contact/campaigns',
          method: 'patch'
        },
        getById: {
          url: '/contact/campaigns/{id}',
          method: 'get'
        }
      },
      formFields: ['name', 'description']
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
    }
  }
}
</script>

<style scoped>
</style>
