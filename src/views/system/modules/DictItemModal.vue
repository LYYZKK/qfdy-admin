<template>
  <a-modal
    :title="title"
    :width="850"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :class="[['show'].includes(operateType) ? 'view-form' : null]">
        <a-row :gutter="16">
          <a-col class="gutter-row" v-bind="formColResponsiveCfg" v-show="showChooseParentDictItem">
            <a-form-item v-bind="formItemResponsiveCfg" label="上级字典项" hasFeedback>
              <a-tree-select
                :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                :treeData="treeData"
                v-model="parentId"
                allowClear
                placeholder="请选择上级菜单"
                :disabled="['show'].includes(operateType)"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="字典项文本" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入字典项文本"
                v-decorator="[ 'itemText', validatorRules.itemText]"
              />
              <template v-else>{{ model.itemText }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="字典项值" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入字典项值"
                v-decorator="[ 'itemVal', validatorRules.itemVal]"
              />
              <template v-else>{{ model.itemVal }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="排序值">
              <template v-if="['add', 'edit'].includes(operateType)">
                <a-input-number
                  placeholder="请输入数据值"
                  v-decorator="['itemSort', { initialValue: 1 }]"
                />
                <span class="m-l-8">值越小越靠前，支持小数</span>
              </template>

              <template v-else>{{ model.itemSort }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="展示方式">
              <template v-if="['add', 'edit'].includes(operateType)">
                <a-select
                  placeholder="请选择展示方式"
                  v-decorator="['showType', { initialValue: toString(model.showType) }]"
                  @change="changeShowType"
                >
                  <a-select-option value>请选择展示方式</a-select-option>
                  <a-select-option
                    v-for="(item, key) in DICT_SHOW_TYPES"
                    :key="key"
                    :value="item.value"
                  >{{ item.description }}</a-select-option>
                </a-select>
              </template>

              <template v-else>{{ model.showType }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="展示颜色">
              <template v-if="['add', 'edit'].includes(operateType)">
                <a-select
                  placeholder="请选择展示颜色"
                  v-decorator="['showColor', { initialValue: toString(model.showColor) }]"
                >
                  <a-select-option value>请选择展示颜色</a-select-option>
                  <a-select-option
                    v-for="(_color, key) in filteredDictShowColors"
                    :key="key"
                    :value="_color.value"
                  >
                    <a-tag
                      v-if="['text', 'tag'].includes(_color.type)"
                      :color="_color.value"
                    >{{ _color.description }}</a-tag>
                    <a-badge
                      v-else-if="['badge'].includes(_color.type)"
                      :status="_color.value"
                      :text="_color.description"
                    />
                  </a-select-option>
                </a-select>
              </template>

              <template v-else>
                <a-tag
                  v-if="['text', 'tag'].includes(model.showType)"
                  :color="model.showColor"
                >{{ model.showColor }}</a-tag>
                <a-badge
                  v-else-if="['badge'].includes(model.showType)"
                  :status="model.showColor"
                  :text="model.showColor"
                />
              </template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="启用状态">
              <a-switch
                v-if="['add', 'edit'].includes(operateType)"
                checkedChildren="启用"
                unCheckedChildren="禁用"
                v-model="enabled"
              />
              <template v-else>
                <a-tag v-if="!enabled || toString(enabled) === '0'" color="orange">禁用</a-tag>
                <a-tag v-else color="green">启用</a-tag>
              </template>
            </a-form-item>
          </a-col>
          <!-- <a-col class="gutter-row" :span="24">
            <a-form-item
              v-bind="{ labelCol: { xs: { span: 24 }, sm: {span: 3}}, wrapperCol: { xs: { span: 24 }, sm: { span: 20 } } }"
              label="描述"
            >
              <a-textarea
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入字典项描述"
                v-decorator="[ 'description' ]"
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
              <template v-else>{{ model.description }}</template>
            </a-form-item>
          </a-col>-->
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
import filter from 'lodash.filter'
import toString from 'lodash.tostring'

import { request } from '@/api'

import ModalMixin from '@/mixins/ModalMixin'
import DictMixin from '@/mixins/DictMixin'
import CommonMixin from '@/mixins/CommonMixin'

import { buildTreeDataForAntd } from '@/utils/util'
import {
  Modal,
  Spin,
  Form,
  Input,
  InputNumber,
  Switch,
  Row,
  Col,
  Button,
  Popconfirm,
  Select,
  Tag,
  Badge,
  TreeSelect
} from 'ant-design-vue'
export default {
  name: 'DictItemModal',
  mixins: [ModalMixin, DictMixin, CommonMixin],
  components: {
    AModal: Modal,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AInputNumber: InputNumber,
    ASwitch: Switch,
    ARow: Row,
    ACol: Col,
    ATextarea: Input.TextArea,
    AButton: Button,
    APopconfirm: Popconfirm,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATag: Tag,
    ABadge: Badge,
    ATreeSelect: TreeSelect
  },
  data() {
    return {
      title: '操作',
      formColResponsiveCfg: {
        xs: 24,
        sm: 12
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
          md: { span: 6 },
          lg: { span: 6 },
          xl: { span: 6 },
          xxl: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
          md: { span: 16 },
          lg: { span: 16 },
          xl: { span: 16 },
          xxl: { span: 16 }
        }
      },
      validatorRules: {
        itemText: {
          rules: [{ required: true, message: '请输入字典项文本!' }, { validator: this.validateItemText }]
        },
        itemVal: {
          rules: [{ required: true, message: '请输入字典项值!' }, { validator: this.validateItemVal }]
        }
      },
      api: {
        add: {
          url: '/system/dict-items',
          method: 'post'
        },
        edit: {
          url: '/system/dict-items',
          method: 'patch'
        },
        getById: {
          url: '/system/dict-items/{id}',
          method: 'get'
        },
        getTreeList: {
          url: '/system/dict-items/{id}',
          method: 'get'
        },
        duplicateCheck: {
          url: '/system/dict-items/duplicate/check',
          method: 'post'
        }
      },
      filteredDictShowColors: [],
      aliveFormDataKey: 'dictItemFormData',
      formFields: ['itemText', 'itemVal', 'itemSort', 'showType', 'showColor'],
      enabled: true,
      parentId: '',
      treeData: [],
      showChooseParentDictItem: false
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
      formData.enabled = this.enabled ? 1 : 0
      formData.dictId = this.dictId
      formData.parentId = this.parentId ? this.toString(this.parentId) : ''
      return formData
    },
    loadTree() {
      var _this = this

      request({
        ..._this.api.getTreeList,
        urlReplacements: [{ substr: '{id}', replacement: _this.dictId }]
      }).then(res => {
        if (res.success) {
          let leafedNodes = res.data
          _this.treeData = buildTreeDataForAntd({ data: leafedNodes, titleField: 'itemText' }).data
        }
      })
    },
    beforeAdd() {
      this.enabled = true
      this.parentId = ''
      this.showChooseParentDictItem = this.dict.type === 1
      this.filteredDictShowColors = filter(this.DICT_SHOW_COLORS, { type: this.model.showType || 'text' })

      this.loadTree()
    },
    beforeEdit() {
      this.enabled = this.model.enabled === 1
      this.parentId = this.toString(this.model.parentId)
      this.showChooseParentDictItem = this.dict.type === 1
      this.filteredDictShowColors = filter(this.DICT_SHOW_COLORS, { type: this.model.showType || 'text' })

      this.loadTree()
    },
    beforeShow() {
      this.enabled = this.model.enabled === 1
      this.parentId = this.toString(this.model.parentId)
      this.showChooseParentDictItem = this.dict.type === 1

      this.loadTree()
    },
    changeShowType(val) {
      this.model.showType = val
      this.filteredDictShowColors = filter(this.DICT_SHOW_COLORS, { type: this.model.showType || 'text' })
    },
    validateItemText(rule, value, callback) {
      const conditions = [{ field: 'dictId', rule: 'eq', val: toString(this.dictId) }]

      if (value) {
        request({
          ...this.api.duplicateCheck,
          params: {
            fieldName: 'itemText',
            fieldVal: value,
            conditions: !this.model.id
              ? conditions
              : conditions.concat([{ field: 'id', rule: 'ne', val: toString(this.model.id) }])
          }
        }).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      } else {
        callback()
      }
    },
    validateItemVal(rule, value, callback) {
      const conditions = [{ field: 'dictId', rule: 'eq', val: toString(this.dictId) }]

      if (value) {
        request({
          ...this.api.duplicateCheck,
          params: {
            fieldName: 'itemVal',
            fieldVal: value,
            conditions: !this.model.id
              ? conditions
              : conditions.concat([{ field: 'id', rule: 'ne', val: toString(this.model.id) }])
          }
        }).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      } else {
        callback()
      }
    }
  }
}
</script>
