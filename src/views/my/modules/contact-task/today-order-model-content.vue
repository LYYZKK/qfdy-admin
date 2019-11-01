<template>
  <a-spin :spinning="confirmLoading">
    <a-form :form="form" :class="[['show'].includes(operateType) ? 'view-form' : null]">
      <a-row :gutter="16">
        <a-col class="gutter-row" v-bind="formColResponsiveCfg">
          <a-form-item v-bind="formItemResponsiveCfg" label="订单号" hasFeedback>
            <template>{{ model.orderNo }}</template>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" v-bind="formColResponsiveCfg">
          <a-form-item v-bind="formItemResponsiveCfg" label="下单时间" hasFeedback>
            <template>{{ model.createAt }}</template>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" v-bind="formColResponsiveCfg">
          <a-form-item v-bind="formItemResponsiveCfg" label="支付状态" hasFeedback>
            <template>
              <a-tag
                :color="model.payStatus==='1'?'green':'orange'"
              >{{ model.payStatus==='1'?'已支付':'未支付' }}</a-tag>
            </template>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" v-bind="formColResponsiveCfg">
          <a-form-item v-bind="formItemResponsiveCfg" label="总金额">
            <span class="c-red bold">￥ {{ model.amount }}</span>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" v-bind="formColResponsiveCfg">
          <a-form-item v-bind="formItemResponsiveCfg" label="备注" hasFeedback>
            <template>{{ model.remark }}</template>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <a-card :bordered="false">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="model.orderProducts"
        :pagination="false"
      >
        <div slot="price" slot-scope="text">
          <span class="bold c-red">{{ '￥ '+text }}</span>
        </div>
      </a-table>
    </a-card>
  </a-spin>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin'

import { Modal, Spin, Row, Col, Button, Popconfirm, Table, Form, Card, Tag } from 'ant-design-vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'

export default {
  name: 'TodayOrderModelContent',
  mixins: [ModalMixin],
  components: {
    AModal: Modal,
    ASpin: Spin,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    APopconfirm: Popconfirm,
    ATable: Table,
    AForm: Form,
    AFormItem: Form.Item,
    ACard: Card,
    ATag: Tag,
    JDictViewTag
  },
  data() {
    return {
      operateType: 'show',
      api: {
        getById: {
          url: '/order/orders/{id}/detail',
          method: 'get'
        }
      },
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
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => {
            return parseInt(index) + 1
          }
        },
        {
          title: '产品名称',
          align: 'center',
          dataIndex: 'product.name'
        },
        {
          title: '单价',
          align: 'center',
          dataIndex: 'product.price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '说明',
          align: 'center',
          dataIndex: 'product.description'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style scoped>
</style>
