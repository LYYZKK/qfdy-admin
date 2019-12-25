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
          {{ model.orderLogistics }}
          <a-card title="物流信息" :bordered="false" v-if="model.orderLogistics.length!==0">
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="物流公司" hasFeedback>
                <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入物流公司名称"
                  v-decorator="['courierCompany', {}]"
                />
                <template v-else>{{ model.orderLogistics[0].courierCompany }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="物流单号" hasFeedback>
                <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入物流单号"
                  v-decorator="['trackingNo', {}]"
                />
                <template v-else>{{ model.orderLogistics[0].trackingNo }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="发货时间" hasFeedback>
                <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请选择发货时间"
                  v-decorator="['shippingTime', {}]"
                />
                <template v-else>{{ model.orderLogistics[0].shippingTime }}</template>
              </a-form-item>
            </a-col>
          </a-card>
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

import { Modal, Spin, Form, Row, Col, Input, InputNumber, Button, Popconfirm, Card } from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import JDate from '@/components/jeecg/JDate.vue'

export default {
  name: 'OrderModal',
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
    ACard: Card,
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
        name: { rules: [{ required: true, message: '请输入商品名称' }] },
        price: { rules: [{ required: true, message: '请输入商品价格' }] },
        totalCount: { rules: [{ required: true, message: '请输入商品价格' }] }
      },
      api: {
        add: {
          url: '/orders/{id}/simple-delivered',
          method: 'post'
        },
        edit: {
          url: '/orders',
          method: 'patch'
        },
        getById: {
          url: '/orders/{id}',
          method: 'get'
        }
      },
      formFields: ['courierCompany', 'trackingNo', 'shippingTime']
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
