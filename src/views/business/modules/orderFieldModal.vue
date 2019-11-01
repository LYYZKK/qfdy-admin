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
            <a-form-item v-bind="formItemResponsiveCfg" label="字段名称" hasFeedback>
              <a-input placeholder="请输入字段名称" v-decorator="['name', validatorRules.name]" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="输入/展示">
              <a-radio-group
                :options="typeOption"
                v-decorator="['showOrInput', validatorRules.showOrInput]"
                @change="handleTypeChange"
              />
            </a-form-item>
          </a-col>
          <div v-if="activeType===1">
            <a-col class="gutter-row" :span="24">
              <a-form-item v-bind="fullFormItemResponsiveCfg" label="展示内容" hasFeedback>
                <a-textarea v-decorator="['val', validatorRules.val]" />
              </a-form-item>
            </a-col>
          </div>
          <div v-if="activeType===0">
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="是否必填">
                <a-radio-group
                  :options="isRequiredOption"
                  v-decorator="['isRequired', validatorRules.isRequired]"
                />
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="字段类型" hasFeedback>
                <a-select
                  v-decorator="['type', validatorRules.type]"
                  @change="handleFieldTypeChange"
                >
                  <a-select-option
                    v-for="(item,index) in fieldTypeOpteon"
                    :key="index.toString()"
                    :value="item.value"
                  >{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-if="fieldType==='text'" class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="长度" hasFeedback>
                <a-input-Number placeholder="请输入" v-decorator="['length', validatorRules.length]" />
              </a-form-item>
            </a-col>
          </div>
          <a-col class="gutter-row" :span="24" v-if="activeType||activeType===0">
            <a-form-item v-bind="fullFormItemResponsiveCfg" label="备注" hasFeedback>
              <a-textarea v-decorator="['remark', {}]" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-card v-if="fieldType==='select'" title="选择项" :bordered="false">
              <a-row
                type="flex"
                justify="center"
                align="top"
                v-for="(item,index) in choiceItems"
                :key="index"
              >
                <a-col class="gutter-row" :span="20">
                  <a-form-item v-bind="fullFormItemResponsiveCfg" label="选项值" hasFeedback>
                    <a-input v-model="choiceItems[index]" />
                  </a-form-item>
                </a-col>
                <a-col :span="4" class="m-t-8">
                  <a-button type="link" icon="delete">删除</a-button>
                </a-col>
              </a-row>
              <a-button type="dashed" block @click="addChoiceItem">+ 添加选项</a-button>
            </a-card>
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
import pick from 'lodash.pick'
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
  Divider,
  Table,
  Radio,
  Select,
  Card
} from 'ant-design-vue'
import { request } from '@/api'

export default {
  name: 'OrderFieldModal',
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
    ATextarea: Input.TextArea,
    ADivider: Divider,
    ATable: Table,
    ARadioGroup: Radio.Group,
    ASelect: Select,
    ASelectOption: Select.Option,
    ACard: Card
  },
  data() {
    return {
      title: '操作',
      operateType: 'add',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      fieldId: null,
      model: null,
      itemIndex: null,
      formColResponsiveCfg: {
        xs: 24,
        sm: 12
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
          md: { span: 7 },
          lg: { span: 6 },
          xl: { span: 6 },
          xxl: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 },
          md: { span: 15 },
          lg: { span: 16 },
          xl: { span: 16 },
          xxl: { span: 16 }
        }
      },
      fullFormItemResponsiveCfg: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 }
      },
      choiceItems: [null],
      typeOption: [{ label: '展示', value: 1 }, { label: '输入', value: 0 }],
      isRequiredOption: [{ label: '必填', value: 1 }, { label: '非必填', value: 0 }],
      fieldTypeOpteon: [{ label: '文本', value: 'text' }, { label: '选择', value: 'select' }],
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入字段名称!' }] },
        showOrInput: { rules: [{ required: true, message: '请选择!' }] },
        val: { rules: [{ required: true, message: '请输入内容!' }] },
        isRequired: { rules: [{ required: true, message: '请选择是否必填!' }] },
        type: { rules: [{ required: true, message: '请选择字段类型!' }] },
        length: { rules: [{ required: true, message: '请输入长度!' }] }
      },
      api: {
        getById: {
          url: '/order/products/properties/{id}',
          method: 'get'
        }
      },
      activeType: null,
      fieldType: null, //
      formFields: ['name', 'showOrInput', 'val', 'isRequired', 'type', 'length']
    }
  },
  beforeMount() {},
  methods: {
    handleTypeChange(val) {
      this.activeType = val.target.value
      this.fieldType = null
    },
    handleFieldTypeChange(val) {
      this.fieldType = val
    },
    handleCancel() {
      this.visible = false
    },
    afterHandleOkRequest() {},
    beforeAdd() {
      this.activeType = null
      this.fieldType = null
    },
    add() {
      this.resetScreenSize()
      this.model = {}
      const flag = this.beforeAdd()
      if (flag === false) {
        return false
      }
      this.setFormFieldsValue()
    },
    setFormFieldsValue() {
      this.visible = true
      const _this = this
      this.$nextTick(() => {
        _this.form.setFieldsValue(pick(_this.model, ..._this.formFields))
      })
    },
    edit(record, index, fromType) {
      const _this = this
      _this.itemIndex = index // 第几个商品属性
      _this.fieldId = record.id
      _this.resetScreenSize()
      _this.form.resetFields()
      if (fromType === 'edit') {
        request({ ..._this.api.getById, urlReplacements: [{ substr: '{id}', replacement: record.id }] }).then(res => {
          const _this = this
          if (res.success) {
            _this.model = res.data
            _this.activeType = _this.model.showOrInput
            _this.fieldType = _this.model.type
            if (this.fieldType === 'select') {
              const obj = JSON.parse(this.model.val)
              _this.choiceItems = obj.map(item => {
                return item.label
              })
            }
            _this.setFormFieldsValue()
          }
        })
      } else if (fromType === 'add') {
        _this.model = record
        _this.setFormFieldsValue()
      }
    },
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < this.drawerWidth) {
        this.modalWidth = screenWidth
      } else {
        this.modalWidth = this.drawerWidth
      }
    },
    addChoiceItem() {
      this.$set(this.choiceItems, this.choiceItems.length, null)
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        // 展示 activeType === 1 输入 === 0
        if (!err && this.activeType === 1) {
          this.$emit('OK', { itemIndex: this.itemIndex, values: values })
          this.itemIndex = null
          this.$message.success('操作成功')
          this.visible = false
        } else if (!err && this.activeType === 0) {
          if (this.fieldType === 'text') {
            this.$emit('OK', { itemIndex: this.itemIndex, values: values })
            this.itemIndex = null
            this.$message.success('操作成功')
            this.visible = false
          } else if (!err && this.fieldType === 'select') {
            const params = values
            params.val = JSON.stringify(
              this.choiceItems.map((item, index) => {
                return { label: item, value: index }
              })
            )
            params['id'] = this.fieldId
            this.$emit('OK', { itemIndex: this.itemIndex, values: params })
            this.itemIndex = null
            this.$message.success('操作成功')
            this.visible = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
