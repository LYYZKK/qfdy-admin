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
          <a-card title="基本信息" :bordered="false">
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="订单编号" hasFeedback>
                <!-- <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入订单编号"
                  v-decorator="['orderNo', validatorRules.orderNo]"
                />-->
                <template v-if="['show'].includes(operateType)">{{ model.orderNo }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="总金额" hasFeedback>
                <!-- <a-input-number
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入总金额"
                  v-decorator="['totalAmount', validatorRules.totalAmount]"
                />-->
                <template v-if="['show'].includes(operateType)">{{ model.totalAmount }}</template>
              </a-form-item>
            </a-col>

            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="订单状态" hasFeedback>
                <!-- <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="订单状态"
                  v-decorator="['orderStatus',{}]"
                />-->
                <template
                  v-if="['show'].includes(operateType)"
                >{{ model.orderStatus === 0 ? '待支付' : model.orderStatus === 1 ? '已支付' : model.orderStatus === 1 ? '取消中' : model.orderStatus === 2 ? '已取消' : '' }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="下单时间" hasFeedback>
                <!-- <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入下单时间"
                  v-decorator="['orderTime', {}]"
                />-->
                <template v-if="['show'].includes(operateType)">{{ model.orderTime }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="支付时间" hasFeedback>
                <!-- <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入支付时间"
                  v-decorator="['payTime', {}]"
                />-->
                <template v-if="['show'].includes(operateType)">{{ model.payTime }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="取消时间" hasFeedback>
                <!-- <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入订单取消时间"
                  v-decorator="['orderCancelTime', {}]"
                />-->
                <template v-if="['show'].includes(operateType)">{{ model.orderCancelTime }}</template>
              </a-form-item>
            </a-col>

            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="备注" hasFeedback>
                <!-- <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入订单备注"
                  v-decorator="['mark', {}]"
                />-->
                <template v-if="['show'].includes(operateType)">{{ model.mark }}</template>
              </a-form-item>
            </a-col>
          </a-card>

          <a-card
            title="发票信息"
            :bordered="false"
            v-if="model.orderInvoice!==null&&model.simpleStatus!==0&&model.orderStatus === 2"
          >
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="发票抬头" hasFeedback>
                <!-- <a-input
                  v-if="['add','edit'].includes(operateType)"
                  v-decorator="['orderInvoiceType', {}]"
                />-->
                <template
                  v-if="['show'].includes(operateType)"
                >{{ model.orderInvoice.type===1?'个人':'单位' }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="单位名称" hasFeedback>
                <!-- <a-input
                  v-if="['add','edit'].includes(operateType)"
                  v-decorator="['businessName', {}]"
                />-->
                <template
                  v-if="['show'].includes(operateType)"
                >{{ model.orderInvoice.businessName }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="识别号" hasFeedback>
                <!-- <a-input v-if="['add','edit'].includes(operateType)" v-decorator="['taxId', {}]" /> -->
                <template v-if="['show'].includes(operateType)">{{ model.orderInvoice.taxId }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="手机号" hasFeedback>
                <!-- <a-input v-if="['add','edit'].includes(operateType)" v-decorator="['phone', {}]" /> -->
                <template v-if="['show'].includes(operateType)">{{ model.orderInvoice.phone }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="邮箱" hasFeedback>
                <!-- <a-input v-if="['add','edit'].includes(operateType)" v-decorator="['email', {}]" /> -->
                <template v-if="['show'].includes(operateType)">{{ model.orderInvoice.email }}</template>
              </a-form-item>
            </a-col>
          </a-card>

          <a-card title="物流信息" :bordered="false" v-if="model.orderStatus === 2">
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="物流公司" hasFeedback>
                <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入物流公司名称"
                  v-decorator="['courierCompany', validatorRules.courierCompany]"
                />
                <template v-else>{{ model.orderLogistics[0].courierCompany }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="物流单号" hasFeedback>
                <a-input
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="请输入物流单号"
                  v-decorator="['trackingNo', validatorRules.trackingNo]"
                />
                <template v-else>{{ model.orderLogistics[0].trackingNo }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="发货时间" hasFeedback>
                <a-date-picker
                  v-if="['add','edit'].includes(operateType)"
                  placeholder="发货时间"
                  v-decorator="['shippingTime', validatorRules.shippingTime]"
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

import { Modal, Spin, Form, Row, Col, Input, InputNumber, Button, Popconfirm, Card, DatePicker } from 'ant-design-vue'
import moment from 'moment'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import { request } from '@/api'
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
    ADatePicker: DatePicker,
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
        totalCount: { rules: [{ required: true, message: '请输入商品价格' }] },
        courierCompany: { rules: [{ required: true, message: '请输入物流公司名' }] },
        trackingNo: { rules: [{ required: true, message: '请输入物流单号' }] },
        shippingTime: { rules: [{ required: true, message: '请输入发货时间' }] }
      },
      api: {
        // add: {
        //   url: '/orders/{id}/simple-delivered',
        //   method: 'post'
        // },
        edit: {
          url: '/orders/{id}/simple-delivered',
          method: 'post'
        },
        getById: {
          url: '/orders/{id}',
          method: 'get'
        }
      },
      formFields: [
        'orderNo',
        'totalAmount',
        'orderStatus',
        'orderTime',
        'payTime',
        'orderCancelTime',
        'mark'

        // 'courierCompany',
        // 'trackingNo',
        // 'shippingTime'
      ]
    }
  },
  methods: {
    /**
     * 点击确认按钮向后台传输的表单数据处理.
     *
     * 注：此方法返回的数据会直接传向后台.
     */
    moment,
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          let params = {
            courierCompany: values.courierCompany,
            shippingTime: moment(values.shippingTime).format('YYYY-MM-DD HH:mm:ss'),
            trackingNo: values.trackingNo
          }
          request({
            ...this.api.edit,
            urlReplacements: [{ substr: '{id}', replacement: this.model.id }],
            params
          })
            .then(res => {
              if (res.success) {
                _this.$message.success(res.message)
                _this.close()
                _this.$emit('ok')
              } else {
                _this.$message.warning(res.message)
              }
            })
            .finally(() => {
              _this.confirmLoading = false
            })
        }
      })
    },
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
