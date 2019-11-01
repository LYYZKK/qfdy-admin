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
        <a-row :gutter="8">
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="用户名" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入用户名"
                v-decorator="['username', validatorRules.username]"
              />
              <template v-else>{{ model.username }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="真实姓名" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入真实姓名"
                v-decorator="['realname', validatorRules.realname]"
              />
              <template v-else>{{ model.realname }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg" v-if="operateType=='add'">
            <a-form-item v-bind="formItemResponsiveCfg" label="密码" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入密码"
                v-decorator="[ 'password', validatorRules.password]"
              />
              <template v-else>{{ model.password }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg" v-if="operateType=='add'">
            <a-form-item v-bind="formItemResponsiveCfg" label="确认密码" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                @blur="handleConfirmBlur"
                placeholder="请确认密码"
                v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"
              />
              <template v-else>{{ model.password2 }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="邮箱" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入邮箱"
                v-decorator="['email', validatorRules.email]"
              />
              <template v-else>{{ model.email }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="角色" hasFeedback>
              <a-select
                mode="multiple"
                placeholder="请选择用户角色"
                v-model="selectedRole"
                @change="changeRoleGetFields"
              >
                <a-select-option
                  v-for="(role,roleindex) in roleList"
                  :key="roleindex.toString()"
                  :value="role.id"
                >{{ role.roleName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col
            class="gutter-row"
            v-bind="formColResponsiveCfg"
            v-for="(item, index) in fields"
            :key="index"
          >
            <a-form-item v-bind="formItemResponsiveCfg" :label="item.fieldName" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                :placeholder="item.fieldName"
                v-decorator="['fields['+ index +'].fieldValue', {initialValue: item.fieldValue, ...validatorRules.fieldValue}]"
              />
              <template v-else>{{ item.fieldValue }}</template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>

    <template slot="footer">
      <template v-if="['add', 'edit'].includes(operateType)">
        <a-popconfirm title="确定取消吗?" @confirm="() => handleCancel()">
          <a-button>取消</a-button>
        </a-popconfirm>
        <a-button class="m-l-8" @click="handleOk" type="primary">确定</a-button>
      </template>
      <a-button @click="handleCancel" v-else>关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin'

import { request } from '@/api'

import { isChinese } from '@/utils/validate'

import { Modal, Spin, Form, Row, Col, Input, InputNumber, Button, Select, Popconfirm } from 'ant-design-vue'

export default {
  name: 'UserModal',
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
    ASelect: Select,
    ASelectOption: Select.Option,
    APopconfirm: Popconfirm
  },
  data() {
    return {
      title: '操作',
      visible: false,
      operateType: 'add',
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
      validatorRules: {
        realname: { rules: [{ required: true, message: '请输入真实姓名!' }] },
        email: { rules: [{ required: true, type: 'email', message: '请输入正确的邮箱!' }] },
        fieldValue: { rules: [{ required: true, message: '扩展字段不能为空!' }] },
        password: {
          rules: [
            {
              required: true,
              message: '请输入登陆密码!'
            },
            {
              validator: this.validateToNextPassword
            }
          ]
        },
        confirmpassword: {
          rules: [
            {
              required: true,
              message: '请输入登陆密码!'
            },
            {
              validator: this.compareToFirstPassword
            }
          ]
        },
        username: {
          rules: [{ required: true, message: '请输入用户名!' }, { validator: this.checkUserName }]
        }
      },
      api: {
        add: {
          url: '/user/users/extension',
          method: 'post'
        },
        edit: {
          url: '/user/users/extension',
          method: 'patch'
        },
        getById: {
          url: '/user/users/{id}',
          method: 'get'
        },
        getUserExtensionsFields: {
          url: '/user/user-extension-fields',
          method: 'get'
        },
        getRoles: {
          url: '/auth/roles',
          method: 'get'
        },
        getRolesByUserId: {
          url: '/auth/users/{userId}/roles',
          method: 'get'
        },
        getExtensionsByUser: {
          url: '/user/user-extensions',
          method: 'get'
        }
      },
      formFields: ['id', 'username', 'realname', 'email'],
      selectedRole: [],
      roleList: [],
      fields: []
    }
  },
  methods: {
    beforeEdit() {
      this.fields = []
      this.getAllRoles()
      this.getRolsByUser()
      this.getExtensionByUser()
    },
    beforeAdd() {
      this.fields = []
      this.getAllRoles()
    },

    // 更改角色查询可用扩展字段
    changeRoleGetFields() {
      this.fields = []
      request({
        ...this.api.getUserExtensionsFields,
        params: { roleIds: this.selectedRole.join(',') }
      }).then(res => {
        if (res.success) {
          for (var i = 0; i < res.data.length; i++) {
            const data = {
              fieldName: res.data[i].fieldName,
              userExtensionFieldId: res.data[i].id,
              fieldValue: ''
            }
            this.fields.push(data)
          }
        }
      })
    },

    // 查询指定用户所有扩展字段
    getExtensionByUser() {
      request({
        ...this.api.getExtensionsByUser,
        params: { userId: this.model.id }
      }).then(res => {
        if (res.success) {
          for (var i = 0; i < res.data.length; i++) {
            const data = {
              fieldName: res.data[i].fieldName,
              userExtensionFieldId: res.data[i].userExtensionFieldId,
              fieldValue: res.data[i].fieldValue
            }
            this.fields.push(data)
          }
        }
      })
    },

    // 查询指定用户所有角色
    getRolsByUser() {
      const _this = this
      this.selectedRole = []
      request({
        ...this.api.getRolesByUserId,
        urlReplacements: [{ substr: '{userId}', replacement: this.model.id }]
      }).then(res => {
        if (res.success) {
          res.data.forEach(role => {
            _this.selectedRole.push(role.id)
          })
        }
      })
    },

    // 查询所有角色
    getAllRoles() {
      request({
        ...this.api.getRoles,
        params: { pageSize: 100 }
      }).then(res => {
        if (res.success) {
          this.roleList = res.data
        }
      })
    },
    // 更改角色查询可用字段
    getFields() {
      request({
        ...this.api.getExFieldsByRoleOrUser,
        params: { roleIds: this.selectedRole }
      }).then(res => {
        if (res.success) {
          this.fields = res.data
        }
      })
    },

    getFormData(formData) {
      if (this.fields.length > 0) {
        for (var i = 0; i < this.model.fields.length; i++) {
          this.fields[i].fieldValue = this.model.fields[i].fieldValue
        }
      }
      formData = {
        user: {
          id: formData.id,
          realname: formData.realname,
          username: formData.username,
          password: formData.password,
          email: formData.email
        },
        userExtensionsCUModel: this.fields,
        roleIds: this.selectedRole
      }
      return formData
    },

    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    checkUserName(rule, value, callback) {
      console.log('---：', isChinese(value))
      if (isChinese(value)) {
        callback('请不要使用汉字作为用户名')
      } else {
        callback()
      }
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    }
  }
}
</script>

<style scoped>
</style>
