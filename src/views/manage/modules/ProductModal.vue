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
            <a-form-item v-bind="formItemResponsiveCfg" label="名称" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入商品名称"
                v-decorator="['name', validatorRules.name]"
              />
              <template v-else>{{ model.name }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="单价" hasFeedback>
              <a-input-number
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入"
                v-decorator="['price', validatorRules.price]"
              />
              <template v-else>{{ model.price }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="库存" hasFeedback>
              <a-input-number
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入"
                v-decorator="['totalCount', validatorRules.totalCount]"
              />
              <template v-else>{{ model.totalCount }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="图片" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入图片路径"
                v-decorator="['img', {}]"
              />
              <template v-else>
                <img :src="model.img" width="100" />
              </template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="URL" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入商品详情页RUL"
                v-decorator="['url',{}]"
              />
              <template v-else>{{ model.url }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="商品描述" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入商品描述"
                v-decorator="['description', {}]"
              />
              <template v-else>{{ model.description }}</template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource[0].specifications"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleShow(record)">
            <a-icon type="eye" />查看
          </a>

          <a-divider type="vertical" />
          <a @click="handleEdit(record)">
            <a-icon type="edit" />编辑
          </a>
        </span>
      </a-table>
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
    <!-- 查看或者编辑套餐 -->
    <meal ref="modalForm" @ok="modalFormOk"></meal>
  </a-modal>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin'
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import { Modal, Spin, Form, Row, Col, Input, InputNumber, Button, Popconfirm, Table } from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import Meal from './Meal.vue'

export default {
  name: 'ProductModal',
  mixins: [KeepAliveMixin, ListMixin, DictMixin, ModalMixin],
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
    ATable: Table,
    JDictSelectTag,
    JDictViewTag,
    JDate,
    Meal
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
        totalCount: { rules: [{ required: true, message: '请输入商品库存' }] }
      },
      api: {
        add: {
          url: '/products',
          method: 'post'
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
      defColumns: [
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
          title: '套餐名',
          align: 'center',
          dataIndex: 'name'
          // customRender: (text, record, index) => {
          //   console.log(record)
          //   return record.specifications[index].name
          // }
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'originalPrice'
          // customRender: (text, record, index) => {
          //   return record.specifications[index].originalPrice
          // }
        },
        {
          title: '现价',
          align: 'center',
          dataIndex: 'price'
          // customRender: (text, record, index) => {
          //   return record.specifications[index].price
          // }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/products',
        deleteBatch: '/products/{ids}'
      },
      formFields: ['name', 'price', 'totalCount', 'img', 'url', 'description']
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
