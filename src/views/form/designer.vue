<template>
  <a-card v-if="formDialog">
    <!-- 表单生成器 -->
    <div class="form-designer">
      <a-layout class="form-designer-main">
        <a-layout-header class="form-dialog-title">表单设计器</a-layout-header>
        <a-layout class="form-dialog-main">
          <a-layout-sider class="form-dialog-sider">
            <!-- 字段 -->
            <filedSort :groupName="groupName" @cloneDom="cloneDom"></filedSort>
          </a-layout-sider>
          <a-layout-content class="form-dialog-content">
            <!-- 操作按钮 -->
            <buttons
              @closeBtn="close"
              @saveBtn="addSingleForm"
              @previewBtn="preview"
              @updateBtn="updateSingleForm"
              :hasData="hasFormData"
              :isModify="isModify"
            ></buttons>
            <!-- 模板 -->
            <formTemplate
              :formDataTemplate="formDataTemplate"
              :formResive="formObject"
              :groupName2="groupName"
              :isDesigner="true"
              :formIsEdit="true"
              :iconShow="true"
              :addressisEdit="false"
              :disabled="true"
              @draggleEnded="draggleEnd(param)"
              @changeData="changeData(arguments)"
              :clickIndex="clickIndex"
              @deletOneFormProperties="deletOneFormProperties"
            ></formTemplate>
          </a-layout-content>
          <a-layout-sider class="form-dialog-sider">
            <!-- 相关属性 -->
            <a-tabs defaultActiveKey="2" size="small">
              <a-tab-pane tab="字段属性" key="1" class="filed-property edite-form">
                <filedProperty
                  :hasData="hasFormData"
                  :filedProperty="filedProperties"
                  :formProperty="formDataTemplate"
                ></filedProperty>
              </a-tab-pane>
              <a-tab-pane tab="表单属性" key="2" class="filed-property edite-form">
                <formProperty
                  :formProperty="formDataTemplate"
                  @checkValueDuplicate="checkValueDuplicate(arguments)"
                  @changeLayoutType="changeLayoutType"
                ></formProperty>
              </a-tab-pane>
            </a-tabs>
          </a-layout-sider>
        </a-layout>
      </a-layout>
    </div>
    <a-modal
      :visible="previewModalVisible"
      @ok="handleOk"
      okText="返回"
      cancelText="false"
      width="55%"
      class="designer-modal"
      :closable="closable"
      :destroyOnClose="destroyOnClose"
    >
      <template slot="footer">
        <a-button type="primary" @click="handleOk">返回</a-button>
      </template>
      <!-- 查看详情 -->
      <formTemplate :formIsEdit="false" :addressisEdit="false" :formDataTemplate="formDataTemplate"></formTemplate>
      <!-- 编辑 -->
      <!-- <formTemplate :formIsEdit="true" :addressisEdit="true" :formDataTemplate="formDataTemplate"></formTemplate> -->
      <!-- 预览 -->
      <!-- <formTemplate
        :formIsEdit="true"
        :addressisEdit="false"
        :disabled="true"
        :formDataTemplate="formDataTemplate"
        :formDataTemplateName="formDataTemplate.name"
      ></formTemplate>-->
    </a-modal>
  </a-card>
</template>
<script>
import toString from 'lodash.tostring'
import { Layout, Button, Tabs, Modal, Table, Card } from 'ant-design-vue'
import draggable from 'vuedraggable'
import filedSort from './modules/designer-field-sort'
import formTemplate from './modules/designer-template'
import filedProperty from './modules/designer-filed-property'
import formProperty from './modules/designer-form-property'
import buttons from './modules/designer-buttons'
import { request } from '@/api'
import { Promise } from 'bluebird'
export default {
  name: 'FormDesigner',
  data() {
    return {
      showTemplate: false,
      // 选择类型
      formDataTemplate: {
        name: '',
        status: 0,
        type: '',
        description: '',
        formClass: '',
        formStyle: '',
        layoutType: 0,
        formProperties: []
      },
      // 是否是修改

      formList: [],

      // 预览框关闭时销毁数据
      destroyOnClose: true,
      filedProperties: {},
      clickIndex: 0,
      groupName: 'workForm',
      // 预览
      previewModalVisible: false,
      closable: false,
      // 是否点击显示属性
      hasFormData: false,
      // 校验是否通过
      checkFlag: false,
      // 为修改数据时删除操作创建的新数组
      deletePropertiesIds: [],
      // api 配置
      api: {
        // 列表操作
        formsList: {
          url: '/system/forms',
          method: 'get'
        },
        getFormById: {
          url: '/system/forms/{id}',
          method: 'get'
        },
        addForm: {
          url: '/system/forms/detail',
          method: 'post'
        },
        updateForm: {
          url: '/system/forms/detail',
          method: 'put'
        },
        deleteForm: {
          url: '/system/forms/{id}',
          method: 'delete'
        },
        // 校验
        duplicateCheck: {
          url: '/system/forms/duplicate/check',
          method: 'post'
        },
        deleteProperty: {
          url: '/system/formProperties/{ids}',
          method: 'delete'
        }
      }
    }
  },
  methods: {
    // changeStyle
    changeLayoutType() {
      if (this.formDataTemplate.layoutType === 1) {
        this.filedProperties.labelCol = {
          xs: { span: '' },
          sm: { span: '' },
          md: { span: '' },
          lg: { span: '' },
          xl: { span: '' },
          xxl: { span: '' }
        }
        this.filedProperties.wrapperCol = {
          xs: { span: '' },
          sm: { span: '' },
          md: { span: '' },
          lg: { span: '' },
          xl: { span: '' },
          xxl: { span: '' }
        }
      } else {
        this.filedProperties.labelCol = { span: '' }
        this.filedProperties.wrapperCol = { span: '' }
      }
    },
    // // 获取模板列表数据
    getFormsList() {
      request({ ...this.api.formsList }).then(res => {
        this.formList = res.data
        this.ipagination = res.page
      })
    },
    // 提交新增模板
    addSingleForm() {
      this.checkFormName().then(() => {
        this.beforeSubmitFormat()
        let params = this.formDataTemplate
        if (this.checkFlag) {
          request({ ...this.api.addForm, params }).then(res => {
            if (res.success) {
              this.formDialog = false
              this.$message.success('提交成功')
              this.getFormsList()
            } else {
              this.$message.error(res.$message)
            }
          })
        } else {
          this.$message.error('请修改表单名')
          this.filterData(params)
        }
      })
    },
    // 删除单个表单
    deleteById(val) {
      request({ ...this.api.deleteForm, urlReplacements: [{ substr: '{id}', replacement: val }] }).then(res => {
        if (res.success) {
          this.getFormsList()
        }
      })
    },
    // 修改单个表单
    updateSingleForm() {
      this.checkFormName().then(() => {
        this.beforeSubmitFormat()
        let params = this.formDataTemplate
        if (this.checkFlag) {
          if (this.deletePropertiesIds && this.deletePropertiesIds.length > 0) {
            request({
              ...this.api.deleteProperty,
              urlReplacements: [{ substr: '{ids}', replacement: this.deletePropertiesIds.join(',') }]
            }).then(res => {
              if (!res.success) {
                this.$message.error(res.$message)
              } else {
                this.formDialog = false
                this.$message.success('提交成功')
                this.getFormsList()
              }
            })
          } else {
            request({ ...this.api.updateForm, params }).then(res => {
              if (res.success) {
                this.formDialog = false
                this.$message.success('提交成功')
                this.getFormsList()
              } else {
                this.$message.error(res.$message)
              }
            })
          }
        } else {
          this.$message.error('请修改表单名')
          this.filterData(params)
        }
      })
    },
    // 修改单个表单时把删除的数据存放在另一个新数组中
    deletOneFormProperties(index) {
      this.deletePropertiesIds.push(this.formDataTemplate.formProperties[index].id)
      this.formDataTemplate.formProperties.splice(index, 1)
      this.filedProperties = {}
    },
    // 数据提交前格式化
    beforeSubmitFormat() {
      this.formDataTemplate.formProperties.forEach((item, index) => {
        item.sortNo = index
        if (item.rw instanceof Array) {
          if (item.rw.length === 2) {
            item.rw = 3
          } else if (item.rw.length === 1) {
            if (item.rw[0] === '1') {
              item.rw = 1
            } else {
              item.rw = 2
            }
          } else {
            item.rw = 0
          }
        }
        if (
          item.elementType === 'radio' ||
          item.elementType === 'checkbox' ||
          item.elementType === 'select' ||
          item.elementType === 'multipleSelect' ||
          item.elementType === 'address'
        ) {
          item.defaultValue = JSON.stringify(item.defaultValue)
          item.optionalData = JSON.stringify(item.optionalData)
        }
        if (item.elementType === 'img') {
          item.elementStyle = JSON.stringify(item.elementStyle)
        }
        item.labelCol = JSON.stringify(item.labelCol)
        item.wrapperCol = JSON.stringify(item.wrapperCol)
        delete item.readWhite
      })
    },
    // 渲染数据时过滤
    filterData(res) {
      this.filedProperties = {}
      res.formProperties.forEach(item => {
        item.readWhite = []
        item.rw =
          item.rw === 0
            ? (item.readWhite = [])
            : item.rw === 1
            ? (item.readWhite = ['1'])
            : item.rw === 2
            ? (item.readWhite = ['2'])
            : (item.readWhite = ['1', '2'])

        if (
          item.elementType === 'multipleSelect' ||
          item.elementType === 'checkbox' ||
          item.elementType === 'radio' ||
          item.elementType === 'select' ||
          item.elementType === 'address'
        ) {
          item.defaultValue = JSON.parse(item.defaultValue)
          item.optionalData = JSON.parse(item.optionalData)
        }
        if (item.elementType === 'img') {
          item.elementStyle = JSON.parse(item.elementStyle)
        }
        item.labelCol = JSON.parse(item.labelCol)
        item.wrapperCol = JSON.parse(item.wrapperCol)
      })
      this.formDataTemplate = res
    },
    // 实时校验表单名是否可用
    checkValueDuplicate(args) {
      const { fieldName, fieldVal, id } = args[0]
      let params = {
        fieldName,
        fieldVal,
        conditions: id ? [{ field: 'id', rule: 'ne', val: toString(id) }] : []
      }
      if (this.formDataTemplate.name !== '') {
        request({ ...this.api.duplicateCheck, params }).then(res => {
          if (!res.success) {
            this.$message.error(res.message)
            this.checkFlag = false
          } else {
            this.checkFlag = true
          }
        })
      } else {
        this.$message.error('表单名不能为空')
      }
    },
    // 提交时校验表单名
    checkFormName() {
      let params = {
        fieldName: 'name',
        fieldVal: this.formDataTemplate.name,
        conditions: this.formDataTemplate.id
          ? [{ field: 'id', rule: 'ne', val: toString(this.formDataTemplate.id) }]
          : []
      }
      if (this.formDataTemplate.name !== '') {
        return new Promise(resolve => {
          request({ ...this.api.duplicateCheck, params }).then(res => {
            if (!res.success) {
              this.$message.error(res.message)
              this.checkFlag = false
            } else {
              this.checkFlag = true
              resolve()
            }
          })
        })
      } else {
        this.$message.error('表单名不能为空')
      }
    },
    init() {
      this.filedProperties = {}
      this.formDataTemplate = {
        name: '',
        status: 0,
        type: '',
        description: '',
        formClass: '',
        formStyle: '',
        layoutType: 0,
        formProperties: []
      }
    },
    close() {
      this.formDialog = false
      this.init()
      this.getFormsList()
    },
    trim(val) {
      return val.replace(/(^\s*)|(\s*$)/g, '')
    },
    changeData(params) {
      this.filedProperties = this.formDataTemplate.formProperties[params[1]]
      this.clickIndex = params[1]
      this.hasFormData = true
    },
    draggleEnd(evt) {
      this.clickIndex = evt.newIndex
    },
    preview() {
      this.previewModalVisible = true
    },
    save() {
      this.$message.success('保存成功')
    },
    handleOk() {
      this.previewModalVisible = false
    },
    // 克隆操作
    cloneDom(val) {
      if (val.type === 'text') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '单行文本',
          elementType: 'text',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'textarea') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '多行文本',
          elementType: 'textarea',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'number') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '数字',
          elementType: 'number',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'radio') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '单选',
          elementType: 'radio',
          defaultValue: '',
          optionalData: [{ name: '选项' }, { name: '选项' }, { name: '选项' }],
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'checkbox') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '多选',
          elementType: 'checkbox',
          defaultValue: [],
          optionalData: [{ name: '选项' }, { name: '选项' }, { name: '选项' }],
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'select') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '下拉框',
          elementType: 'select',
          defaultValue: '',
          optionalData: [{ name: '选项' }, { name: '选项' }, { name: '选项' }],
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'multipleSelect') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '多选下拉框',
          elementType: 'multipleSelect',
          defaultValue: [],
          optionalData: [{ name: '选项' }, { name: '选项' }, { name: '选项' }],
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'dateTime') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '日期时间',
          elementType: 'dateTime',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'date') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '日期',
          elementType: 'date',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'time') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '时间',
          elementType: 'time',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'editor') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '富文本',
          elementType: 'editor',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'address') {
        this.formDataTemplate.formProperties.push({
          name: '',
          defaultValueType: 1,
          formatValue: '',
          isRequired: 0,
          maxValue: '',
          minValue: '',
          placeholder: '',
          sortNo: 0,
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '地址',
          elementType: 'address',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: '',
          span: ''
        })
      }
      if (val.type === 'img') {
        this.formDataTemplate.formProperties.push({
          name: '',
          maxValue: '',
          minValue: '',
          defaultValueType: 1,
          sortNo: 0,
          formatValue: '',
          placeholder: '请选择一张图片',
          regexMsg: '',
          regex: '',
          tip: '',
          rw: 3,
          readWhite: ['1', '2'],
          rwType: 0,
          styleValue: '',
          validateScript: '',
          label: '图片',
          elementType: 'img',
          defaultValue: '',
          optionalData: '',
          labelCol: { span: '' },
          wrapperCol: { span: '' },
          elementClass: '',
          elementStyle: {
            height: 100,
            width: 'auto'
          },
          span: ''
        })
      }
    }
  },
  components: {
    draggable,
    filedSort,
    filedProperty,
    formProperty,
    formTemplate,
    buttons,
    AButton: Button,
    ALayout: Layout,
    ALayoutHeader: Layout.Header,
    ALayoutContent: Layout.Content,
    ALayoutSider: Layout.Sider,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AModal: Modal,
    ATable: Table,
    ACard: Card
  },
  computed: {
    isModify() {
      if (this.formObject.id) {
        return true
      } else {
        return false
      }
    }
  },
  props: {
    formDialog: {
      type: Boolean,
      default: false
    },
    formObject: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="less">
// 表单设计器中modal样式调整
.designer-modal {
  height: 100%;
  ::v-deep .ant-modal-body {
    padding: 0 0 !important;
    ::v-deep .form-dialog-content-main {
      padding: 0 !important;
    }
  }
}
.ant-tabs {
  height: 100%;
  .ant-tabs-content {
    height: 100%;
    .ant-tabs-tabpane {
      height: 100%;
      padding-bottom: 20px;
      overflow-y: auto;
    }
  }
}
</style>
<style lang="less">
.form-designer {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: #fff;
  .form-designer-main {
    width: 100%;
    height: 100%;
  }
  .form-dialog-title {
    padding-left: 10px;
    background: #fff;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    font-weight: 800;
  }
  .form-dialog-main {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    width: 100%;
    height: 100%;
    background: #fff;
    .form-dialog-content {
      height: 100%;
      position: relative;
    }
    .form-dialog-sider {
      max-width: 300px !important;
      min-width: 300px !important;
      width: 300px !important;
      height: 100%;
      background: #fff;
      border-right: 1px solid #ccc;
    }
    .form-dialog-sider:nth-child(3) {
      border-left: 1px solid #ccc;
      .edite-form {
        // height: 100%;
        // overflow: hidden;
        // overflow-y: auto;
        padding: 0 10px 40px 10px;
      }
    }
  }
}
</style>

