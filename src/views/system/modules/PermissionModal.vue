<template>
  <a-drawer
    :title="title"
    :width="modalWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{ height: 'calc(100% - 108px)', overflow: 'auto', paddingBottom: '108px' }"
  >
    <div :style="{width: '100%', border: '1px solid #e9e9e9', padding: '10px 16px'}">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="菜单类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group
              @change="onChangeMenuType"
              v-decorator="['menuType',{'initialValue': localMenuType}]"
              :disabled="['show'].includes(operateType)"
            >
              <a-radio :value="0">一级菜单</a-radio>
              <a-radio :value="1">子菜单</a-radio>
              <a-radio :value="2">按钮/权限</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="menuLabel" hasFeedback>
            <a-input
              v-if="['add', 'edit'].includes(operateType)"
              placeholder="请输入菜单名称"
              v-decorator="[ 'name', validatorRules.name]"
            />
            <template v-else>{{ model.name }}</template>
          </a-form-item>

          <a-form-item
            v-if="localMenuType !== 0"
            label="上级菜单"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :validate-status="validateStatus"
            :hasFeedback="true"
            :required="localMenuType === 1"
          >
            <span slot="help">{{ validateStatus=='error' ? '请选择上级菜单' : '&nbsp;&nbsp;' }}</span>
            <a-tree-select
              :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
              :treeData="treeData"
              v-model="model.parentId"
              placeholder="请选择上级菜单"
              :disabled="['show'].includes(operateType)"
              @change="handleParentIdChange"
            ></a-tree-select>
          </a-form-item>

          <a-form-item
            v-if="showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单路径"
          >
            <a-input
              placeholder="请输入菜单路径"
              v-decorator="[ 'url',validatorRules.url]"
              v-if="['add', 'edit'].includes(operateType)"
            />
            <template v-else>{{ model.url }}</template>
          </a-form-item>

          <a-form-item
            v-if="showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="前端组件"
          >
            <a-input
              v-if="['add', 'edit'].includes(operateType)"
              placeholder="请输入前端组件"
              v-decorator="[ 'component',validatorRules.component]"
            />
            <template v-else>{{ model.url }}</template>
          </a-form-item>

          <a-form-item
            v-if="localMenuType==0"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="默认跳转地址"
          >
            <a-input
              placeholder="请输入路由参数 redirect"
              v-decorator="[ 'redirect',{}]"
              v-if="['add', 'edit'].includes(operateType)"
            />
            <template v-else>{{ model.redirect }}</template>
          </a-form-item>

          <a-form-item
            v-if="!showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="授权标识"
          >
            <a-input
              placeholder="多个用逗号分隔, 如: user:list,user:create"
              v-decorator="[ 'perms', validatorRules.perms]"
              v-if="['add', 'edit'].includes(operateType)"
            />
            <template v-else>{{ model.perms }}</template>
          </a-form-item>

          <a-form-item
            v-if="!showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="授权策略"
          >
            <j-dict-select-tag
              v-decorator="['permsType', {}]"
              :value="model.permsType"
              placeholder="请选择授权策略"
              type="radio"
              :triggerChange="true"
              dictCode="global_perms_type"
              v-if="['add', 'edit'].includes(operateType)"
            />
            <j-dict-view-tag v-else v-model="model.permsType" dictCode="global_perms_type" />
          </a-form-item>
          <a-form-item
            v-if="!showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态"
          >
            <j-dict-select-tag
              v-decorator="['status', {}]"
              :value="model.status"
              placeholder="请选择状态"
              type="radio"
              :triggerChange="true"
              dictCode="valid_status"
              v-if="['add', 'edit'].includes(operateType)"
            />
            <j-dict-view-tag v-else v-model="model.status" dictCode="valid_status" />
          </a-form-item>

          <a-form-item
            v-if="showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单图标"
          >
            <a-input
              placeholder="点击右侧按钮选择图标"
              v-model="model.icon"
              v-if="['add', 'edit'].includes(operateType)"
            >
              <a-tooltip slot="addonBefore">
                <template slot="title">已选择的菜单图标</template>
                <a-icon :type="model.icon" />
              </a-tooltip>
              <a-tooltip slot="addonAfter">
                <template slot="title">点击选择菜单图标</template>
                <a-icon type="search" @click="selectIcons" />
              </a-tooltip>
            </a-input>
            <a-icon v-else :type="model.icon" />
          </a-form-item>

          <a-form-item
            v-if="showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="排序"
          >
            <a-input-number
              placeholder="请输入菜单排序"
              class="w-200"
              v-decorator="[ 'sortNo',validatorRules.sortNo]"
              v-if="['add', 'edit'].includes(operateType)"
            />
            <template v-else>{{ model.sortNo }}</template>
          </a-form-item>

          <a-form-item
            v-if="showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否路由菜单"
          >
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-model="routeSwitch"
              :disabled="['show'].includes(operateType)"
            />
          </a-form-item>

          <a-form-item
            v-if="showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="隐藏路由"
          >
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-model="menuHidden"
              :disabled="['show'].includes(operateType)"
            />
          </a-form-item>

          <a-form-item
            v-if="showRouteFields"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="聚合路由"
          >
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-model="alwaysShow"
              :disabled="['show'].includes(operateType)"
            />
          </a-form-item>
        </a-form>

        <!-- 选择图标 -->
        <icons
          @choose="handleIconChoose"
          @close="handleIconCancel"
          :iconChooseVisible="iconChooseVisible"
        ></icons>
      </a-spin>
      <a-row :style="{textAlign:'right'}">
        <template v-if="['add', 'edit'].includes(operateType)">
          <a-popconfirm title="确定取消吗?" @confirm="() => handleCancel()">
            <a-button>取消</a-button>
          </a-popconfirm>
          <a-button class="m-l-8" @click="handleOk" type="primary">确定</a-button>
        </template>
        <a-button @click="handleCancel" v-else>关闭</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import toString from 'lodash.tostring'
import ModalMixin from '@/mixins/ModalMixin'
import CommonMixin from '@/mixins/CommonMixin'
import { buildTreeDataForAntd } from '@/utils/util'
import { request } from '@/api'
import { isChinese } from '@/utils/validate'
import Icons from './icon/Icons'
import {
  Drawer,
  Spin,
  Form,
  Radio,
  Icon,
  Input,
  TreeSelect,
  Tooltip,
  InputNumber,
  Switch,
  Row,
  Button,
  Popconfirm
} from 'ant-design-vue'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'

export default {
  name: 'PermissionModal',
  mixins: [CommonMixin, ModalMixin],
  components: {
    Icons,
    ADrawer: Drawer,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    AInput: Input,
    AInputNumber: InputNumber,
    ATreeSelect: TreeSelect,
    AIcon: Icon,
    ATooltip: Tooltip,
    ASwitch: Switch,
    ARow: Row,
    AButton: Button,
    APopconfirm: Popconfirm,
    JDictSelectTag,
    JDictViewTag
  },
  data() {
    return {
      treeData: [],
      treeValue: '0-0-4',
      title: '操作',
      localMenuType: 0,
      alwaysShow: false, // 表单元素-聚合路由
      menuHidden: false, // 表单元素-隐藏路由
      routeSwitch: true, // 是否路由菜单
      showRouteFields: true, // 根据菜单类型，动态显示隐藏表单元素
      parentPermission: {},
      menuLabel: '菜单名称',
      isRequrie: true, // 是否需要验证
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      iconChooseVisible: false,
      validateStatus: '',
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入菜单标题!' }] },
        perms: { rules: [{ required: true, message: '请输入授权标识!' }, { validator: this.validatePerms }] },
        component: { rules: [{ required: this.showRouteFields, message: '请输入前端组件!' }] },
        url: { rules: [{ required: this.showRouteFields, message: '请输入菜单路径!' }] }
      },
      api: {
        getTreeList: {
          url: '/auth/permissions',
          method: 'get'
        },
        add: {
          url: '/auth/permissions',
          method: 'post'
        },
        edit: {
          url: '/auth/permissions',
          method: 'patch'
        },
        getById: {
          url: '/auth/permissions/{id}',
          method: 'get'
        },
        duplicateCheck: {
          url: '/auth/permissions/duplicate/check',
          method: 'post'
        }
      },
      formFields: ['name', 'perms', 'redirect', 'permsType', 'component', 'url', 'sortNo', 'menuType', 'status'],
      defaultAddFormData: {
        status: '1',
        permsType: '1',
        route: true
      },

      modalWidth: 700
    }
  },
  methods: {
    loadTree() {
      var _this = this

      request({
        ...this.api.getTreeList,
        params: {
          pageSize: 100,
          scope: 'all'
        }
      }).then(res => {
        if (res.success) {
          let leafedNodes = res.data
          _this.treeData = buildTreeDataForAntd({ data: leafedNodes }).data
        }
      })
    },
    dealModelAfterGetById() {
      this.model.parentId = this.toString(this.model.parentId)
    },
    beforeAdd() {
      this.model.parentId = this.toString(this.parentPermission.id)
      this.loadTree()
    },
    beforeEdit() {
      this.alwaysShow = !this.model.alwaysShow ? false : true
      this.menuHidden = !this.model.hidden ? false : true

      if (this.model.isRoute != null) {
        this.routeSwitch = this.model.isRoute ? true : false
      }

      this.localMenuType = this.model.menuType
      this.showRouteFields = this.model.menuType == 2 ? false : true
      this.routeSwitch = this.model.menuType == 2 ? false : true
      this.menuLabel = this.model.menuType == 2 ? '按钮/权限' : '菜单名称'
      this.model.parentId = this.model.parentId == 0 ? null : this.toString(this.model.parentId)

      this.loadTree()
    },
    beforeShow() {
      this.alwaysShow = !this.model.alwaysShow ? false : true
      this.menuHidden = !this.model.hidden ? false : true

      if (this.model.isRoute != null) {
        this.routeSwitch = this.model.isRoute ? true : false
      }

      this.localMenuType = this.model.menuType
      this.showRouteFields = this.model.menuType == 2 ? false : true
      this.routeSwitch = this.model.menuType == 2 ? false : true
      this.menuLabel = this.model.menuType == 2 ? '按钮/权限' : '菜单名称'
      this.model.parentId = this.model.parentId == 0 ? null : this.model.parentId

      this.loadTree()
    },
    getFormData(formData) {
      formData.alwaysShow = this.alwaysShow ? 1 : 0
      formData.hidden = this.menuHidden ? 1 : 0
      formData.isRoute = this.routeSwitch ? 1 : 0
      formData.parentId = this.toNumber(this.model.parentId)
      return formData
    },
    beforeHandleOkRequest(formData) {
      if (formData.menuType == 1 && !formData.parentId) {
        this.validateStatus = 'error'
        this.$message.error('请选择上级菜单')
        return false
      } else {
        this.validateStatus = 'success'
        return true
      }
    },
    onChangeMenuType(e) {
      this.localMenuType = e.target.value
      if (e.target.value == 2) {
        this.showRouteFields = false
        this.routeSwitch = false
        this.menuLabel = '按钮/权限'
      } else {
        this.showRouteFields = true
        this.menuLabel = '菜单名称'
      }
      this.$nextTick(() => {
        this.form.validateFields(['url', 'component'], { force: true })
      })
    },
    selectIcons() {
      this.iconChooseVisible = true
    },
    handleIconCancel() {
      this.iconChooseVisible = false
    },
    handleIconChoose(value) {
      this.model.icon = value
      this.form.icon = value
      this.iconChooseVisible = false
    },
    handleParentIdChange(value) {
      if (!value) {
        this.validateStatus = 'error'
      } else {
        this.validateStatus = 'success'
      }
    },
    validatePerms(rule, value, callback) {
      if (isChinese(value)) {
        callback('权限编码不可输入汉字!')
      } else {
        request({
          ...this.api.duplicateCheck,
          params: {
            fieldName: 'perms',
            fieldVal: value,
            conditions: !this.model.id ? [] : [{ field: 'id', rule: 'ne', val: toString(this.model.id) }]
          }
        }).then(res => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
