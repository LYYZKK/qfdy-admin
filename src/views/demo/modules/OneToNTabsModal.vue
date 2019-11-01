<template>
  <a-modal
    :title="title"
    width="65%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :class="[['show'].includes(operateType) ? 'view-form' : null]">
        <!-- 主表单区域 -->
        <a-row class="form-row" :gutter="16">
          <a-col v-bind="mainColResponsiveCfg">
            <a-form-item v-bind="mainFormItemResponsiveCfg" label="订单号" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入订单号"
                v-decorator="['orderCode', {rules: [{ required: true, message: '请输入订单号!' }]}]"
              />
              <template v-else>{{ orderCode }}</template>
            </a-form-item>
          </a-col>
          <a-col v-bind="mainColResponsiveCfg">
            <a-form-item
              v-bind="mainFormItemResponsiveCfg"
              :defaultValue="ctype"
              label="订单类型"
              hasFeedback
            >
              <a-select placeholder="请输入订单类型" v-decorator="['ctype',{}]">
                <a-select-option
                  v-for="(item, idx) in ctypes"
                  :key="idx"
                  :value="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col v-bind="mainColResponsiveCfg">
            <a-form-item v-bind="mainFormItemResponsiveCfg" label="订单日期" hasFeedback>
              <j-date
                v-if="['add', 'edit'].includes(operateType)"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="['orderDate',{}]"
              />
              <template v-else>{{ orderDate }}</template>
            </a-form-item>
          </a-col>
          <a-col v-bind="mainColResponsiveCfg">
            <a-form-item v-bind="mainFormItemResponsiveCfg" label="订单金额" hasFeedback>
              <a-input-number
                v-if="['add', 'edit'].includes(operateType)"
                class="order-money-input"
                v-decorator="[ 'orderMoney', {}]"
              />
              <template v-else>{{ orderMoney }}</template>
            </a-form-item>
          </a-col>
          <a-col v-bind="mainColResponsiveCfg">
            <a-form-item v-bind="mainFormItemResponsiveCfg" label="订单备注" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入订单备注"
                v-decorator="['content', {}]"
              />
              <template v-else>{{ content }}</template>
            </a-form-item>
          </a-col>
        </a-row>

        <!-- 子表单区域 -->
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="客户信息" key="1">
            <template>
              <OneToNCustomerTab
                ref="oneToNCustomerTab"
                :operateType="operateType"
                :customers="model.customers"
              ></OneToNCustomerTab>
            </template>
          </a-tab-pane>

          <a-tab-pane tab="机票信息" key="2" forceRender>
            <OneToNTicketTab
              ref="oneToNTicketTab"
              :operateType="operateType"
              :tickets="model.tickets"
            ></OneToNTicketTab>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

import CommonMixin from '@/mixins/CommonMixin'

import { request } from '@/api'

import OneToNCustomerTab from './OneToNCustomerTab'
import OneToNTicketTab from './OneToNTicketTab'
import { Modal, Spin, Form, Row, Col, Input, Select, Tabs, InputNumber } from 'ant-design-vue'

import JDate from '@/components/jeecg/JDate.vue'

export default {
  name: 'OneToNTabsModal',
  mixins: [CommonMixin],
  components: {
    OneToNCustomerTab,
    OneToNTicketTab,
    AModal: Modal,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInputNumber: InputNumber,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    JDate
  },
  data() {
    return {
      title: '操作',
      operateType: 'add',
      visible: false,
      model: { customers: [{}], tickets: [{}] },
      mainColResponsiveCfg: {
        xs: 24,
        sm: 12
      },
      mainFormItemResponsiveCfg: {
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

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},

      api: {
        add: {
          url: '/test/jeecgOrderMain/add',
          method: 'post'
        },
        edit: {
          url: '/test/jeecgOrderMain/edit',
          method: 'put'
        },
        customers: {
          url: '/test/jeecgOrderMain/queryOrderCustomerListByMainId',
          method: 'get'
        },
        orderTicketList: {
          url: '/test/jeecgOrderMain/queryOrderTicketListByMainId',
          method: 'get'
        }
      },
      ctypes: [{ label: '国内订单', value: '1' }, { label: '国际订单', value: '2' }],
      ctype: ''
    }
  },
  methods: {
    add() {
      this.edit(this.getAliveData()['oneToNTabsData'] || {})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      //--------------------------------------------------------
      // 初始化明细表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        // 初始化订单机票列表
        request({ ...this.api.customers, params }).then(res => {
          if (res.success) {
            this.model.customers = res.result
            this.$forceUpdate()
          }
        })
        // 初始化订单客户列表
        request({ ...this.api.orderTicketList, params }).then(res => {
          if (res.success) {
            this.model.tickets = res.result
            this.$forceUpdate()
          }
        })
      }
      //--------------------------------------------------------
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'orderCode', 'ctype', 'orderMoney', 'content', 'orderDate'))
      })
    },
    show(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.model.customers = [{}]
      this.model.tickets = [{}]
      //--------------------------------------------------------
      // 初始化明细表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        // 初始化订单机票列表
        request({ ...this.api.customers, params }).then(res => {
          if (res.success) {
            this.model.customers = res.result
            this.$forceUpdate()
          }
        })
        // 初始化订单客户列表
        request({ ...this.api.orderTicketList, params }).then(res => {
          if (res.success) {
            this.model.tickets = res.result
            this.$forceUpdate()
          }
        })
      }
      //--------------------------------------------------------

      this.$nextTick(() => {
        this.visible = true
      })
    },
    close() {
      this.$emit('close')
      this.visible = false

      if (this.operateType === 'add') {
        this.$emit('saveAliveData', {
          key: 'oneToNTabsData',
          val: this.form.getFieldsValue()
        })
      }
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true

          let requestParam = this.model.id ? this.api.edit : this.api.add
          let formData = Object.assign(this.model, values)

          request({ ...requestParam, params: formData })
            .then(res => {
              if (res.success) {
                _this.close()
                _this.$message.success(res.message)
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
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style scoped>
.tab-buttons .ant-btn {
  margin-bottom: 8px;
  margin-left: 8px;
}

.tab-table-title {
  font-weight: 500;
}

.order-money-input {
  width: 200px;
}
</style>
