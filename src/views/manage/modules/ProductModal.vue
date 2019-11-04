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
            <a-form-item v-bind="formItemResponsiveCfg" label="商品名" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入姓名"
                v-decorator="['name', validatorRules.name]"
              />
              <template v-else>{{ model.name }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="单价" hasFeedback>
              <a-input-number
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入商品单价"
                v-decorator="['price', validatorRules.price]"
              />
              <template v-else>{{ model.price }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="库存" hasFeedback>
              <a-input-number
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入商品库存"
                v-decorator="['totalCount', validatorRules.price]"
              />
              <template v-else>{{ model.totalCount }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="图片" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入图片路径"
                v-decorator="['img', validatorRules.img]"
              />
              <template v-else>{{ model.img }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="URL" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入商品详情页RUL"
                v-decorator="['url', validatorRules.name]"
              />
              <template v-else>{{ model.url }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="商品描述" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入个人简介"
                v-decorator="['content', {}]"
              />
              <template v-else>{{ model.content }}</template>
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

import { Modal, Spin, Form, Row, Col, Input, InputNumber, Button, Popconfirm } from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import JDate from '@/components/jeecg/JDate.vue'

export default {
  name: 'ProductModal',
  mixins: [ModalMixin],
  components: {
    AModal: Modal,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    AInputNumber: InputNumber,
    AButton: Button,
    APopconfirm: Popconfirm,
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
        name: { rules: [{ required: true, message: '请输入姓名' }] },
        sex: { rules: [{ required: true, message: '请选择性别' }] },
        email: { rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }] },
        birthday: { rules: [{ required: true, message: '请选择出生日期' }] }
      },
      api: {
        add: {
          url: '/products',
          method: 'add'
        },
        edit: {
          url: '/products',
          method: 'patch'
        },
        getById: {
          url: '/products/{id}',
          method: 'get'
        }
      },
      formFields: ['name', 'keyWord', 'sex', 'age', 'email', 'content', 'punchTime', 'birthday']
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
