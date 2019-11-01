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
            <a-form-item v-bind="formItemResponsiveCfg" label="名称" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入名称"
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
            <a-form-item v-bind="formItemResponsiveCfg" label="商品类型" hasFeedback>
              <a-tree-select
                v-if="['add', 'edit'].includes(operateType)"
                showSearch
                :treeData="productTypes"
                style="width: 300px"
                v-decorator="['typeId', validatorRules.typeId]"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择商品类型"
                allowClear
                treeDefaultExpandAll
              />
              <template v-else>{{ model.typeName }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="描述">
              <a-textarea
                v-if="['add','edit'].includes(operateType)"
                v-decorator="['description', {}]"
              />
              <template v-else>{{ model.description }}</template>
            </a-form-item>
          </a-col>
        </a-row>
        <a-card title="订单字段" :bordered="false">
          <a-button
            type="primary"
            icon="plus"
            class="m-b-10"
            v-if="['add','edit'].includes(operateType)"
            @click="handleAdd"
          >新增</a-button>
          <a-row :class="['add','edit'].includes(operateType)?'':'m-t-10'">
            <a-table
              rowKey="id"
              size="middle"
              :columns="operateType === 'show' ? productPropertiesColumns : productPropertiesColumns.concat(actionColumns)"
              :dataSource="productProperties"
              :pagination="false"
              bordered
            >
              <span slot="showOrInput" slot-scope="showOrInput">{{ showOrInput==='0'?'输入':'展示' }}</span>
              <span
                slot="action"
                slot-scope="text, record, index"
                v-if="['add','edit'].includes(operateType)"
              >
                <a-button type="link" icon="edit" @click="handleEdit(record,index)">编辑</a-button>
                <a-divider type="vertical" />
                <a-popconfirm title="确定删除吗?" @confirm="() => removeOneProperties(record,index)">
                  <a-button type="link" icon="delete" size="small">删除</a-button>
                </a-popconfirm>
              </span>
            </a-table>
          </a-row>
        </a-card>
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
    <order-field-modal ref="modalForm" @OK="changeProductProperties" />
  </a-modal>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin'

import {
  Modal,
  Spin,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  TreeSelect,
  Divider,
  Table,
  Card
} from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import JDate from '@/components/jeecg/JDate.vue'
import orderFieldModal from './orderFieldModal'
import { request } from '@/api'
import { buildTreeDataForAntd } from '@/utils/util'

export default {
  name: 'ProductsModal',
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
    JDate,
    ATreeSelect: TreeSelect,
    ATreeSelectNode: TreeSelect.TreeNode,
    ATextarea: Input.TextArea,
    ADivider: Divider,
    ATable: Table,
    ACard: Card,
    orderFieldModal
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
        name: { rules: [{ required: true, message: '请输入姓名!' }] },
        price: { rules: [{ required: true, message: '请输入单价!' }] },
        typeId: { rules: [{ required: true, message: '请选择商品类型!' }] }
      },
      api: {
        add: {
          url: '/order/products',
          method: 'post'
        },
        edit: {
          url: '/order/products',
          method: 'patch'
        },
        del: {
          url: '/order/products/properties/{ids}',
          method: 'delete'
        },
        productsTypes: {
          url: '/order/products/types/trees',
          method: 'get'
        },
        getById: {
          url: '/order/products/{id}',
          method: 'get'
        }
      },
      productTypes: [], // 商品类型
      formFields: ['name', 'typeName', 'typeId', 'price', 'description'],
      productPropertiesColumns: [
        {
          title: '字段名',
          align: 'center',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '输入/展示',
          align: 'center',
          key: 'showOrInput',
          scopedSlots: {
            customRender: 'showOrInput'
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
          key: 'remark'
        }
      ],
      actionColumns: [
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      productProperties: [],
      deletePropertyList: []
    }
  },
  beforeMount() {
    this.getProductsTypes()
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
    removeOneProperties(record, index) {
      if (this.operateType === 'add') {
        this.productProperties.splice(index, 1)
      } else {
        request({
          ...this.api.del,
          urlReplacements: [{ substr: '{ids}', replacement: record.id }]
        }).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.productProperties.splice(index, 1)
          }
        })
      }
    },
    getProductsTypes() {
      request({ ...this.api.productsTypes }).then(res => {
        if (res.success) {
          this.productTypes = buildTreeDataForAntd({ data: res.data }).data
        }
      })
    },
    beforeEdit() {
      if (this.model.typeId) this.model.typeId = this.model.typeId.toString()
      return true
    },
    dealModelAfterGetById() {
      this.productProperties = this.model.productProperties
    },
    handleAdd() {
      const flag = this.beforeAdd()
      if (flag === false) {
        return false
      }
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.operateType = 'add'
      this.$refs.modalForm.add()
    },
    handleEdit(record, index) {
      const flag = this.beforeEdit(record)
      if (flag === false) {
        return false
      }
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.operateType = 'edit'
      this.$refs.modalForm.edit(record, index, this.operateType)
    },
    changeProductProperties(ProductProperty) {
      // 如果没有收到下标即为添加 ，如果有下标即为修改
      if (ProductProperty.itemIndex || ProductProperty.itemIndex === 0) {
        this.$set(this.productProperties, ProductProperty.itemIndex, ProductProperty.values)
      } else {
        this.$set(this.productProperties, this.productProperties.length, ProductProperty.values)
      }
    },
    beforeHandleOkRequest() {
      this.model['productProperties'] = this.productProperties
    },
    afterHandleOkRequest(res) {
      if (res.success) this.productProperties = []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
