<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :class="[['show'].includes(operateType) ? 'view-form' : null]">
        <a-row :gutter="16">
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="角色名称" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入角色名称"
                v-decorator="['roleName', validatorRules.roleName]"
              />
              <template v-else>{{ model.roleName }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item
              v-bind="formItemResponsiveCfg"
              label="角色编码"
              :hasFeedback="['add'].includes(operateType)"
            >
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入角色编码"
                :disabled="roleDisabled"
                v-decorator="[ 'roleCode', validatorRules.roleCode]"
              />
              <template v-else>{{ model.roleCode }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="描述">
              <a-textarea
                v-if="['add', 'edit'].includes(operateType)"
                :rows="5"
                placeholder="请输入角色描述"
                v-decorator="[ 'description', validatorRules.description ]"
              />
              <template v-else>{{ model.roleCode }}</template>
            </a-form-item>
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
import toString from 'lodash.tostring'
import { Modal, Spin, Form, Input, Row, Col, Popconfirm, Button } from 'ant-design-vue'

import ModalMixin from '@/mixins/ModalMixin'
import { isChinese } from '@/utils/validate'
import { request } from '@/api'
export default {
  name: 'RoleModal',
  mixins: [ModalMixin],
  components: {
    AModal: Modal,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ATextarea: Input.TextArea,
    APopconfirm: Popconfirm,
    AButton: Button
  },
  data() {
    return {
      title: '操作',
      visible: false,
      roleDisabled: false,
      formColResponsiveCfg: {
        xs: 24,
        sm: 24
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
        roleName: {
          rules: [
            { required: true, message: '请输入角色名称!' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
            { validator: this.validateRoleName }
          ]
        },
        roleCode: {
          rules: [
            { required: true, message: '请输入角色名称!' },
            { min: 0, max: 64, message: '长度不超过 64 个字符', trigger: 'blur' },
            { validator: this.validateRoleCode }
          ]
        },
        description: {
          rules: [{ min: 0, max: 126, message: '长度不超过 126 个字符', trigger: 'blur' }]
        }
      },
      api: {
        add: {
          url: '/auth/roles',
          method: 'post'
        },
        edit: {
          url: '/auth/roles',
          method: 'patch'
        },
        getById: {
          url: '/auth/roles/{id}',
          method: 'get'
        },
        duplicateCheck: {
          url: '/auth/roles/duplicate/check',
          method: 'post'
        }
      },
      formFields: ['roleName', 'roleCode', 'description']
    }
  },
  methods: {
    beforeEdit() {
      // 编辑页面禁止修改角色编码
      if (this.model.id) {
        this.roleDisabled = true
      } else {
        this.roleDisabled = false
      }
    },
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
    validateRoleName(rule, value, callback) {
      request({
        ...this.api.duplicateCheck,
        params: {
          fieldName: 'roleName',
          fieldVal: value,
          conditions: this.model.id ? [{ field: 'id', rule: 'ne', val: toString(this.model.id) }] : []
        }
      }).then(res => {
        if (res.success) {
          callback()
        } else {
          callback(res.message)
        }
      })
    },
    validateRoleCode(rule, value, callback) {
      if (isChinese(value)) {
        callback('角色编码不可输入汉字!')
      } else {
        request({
          ...this.api.duplicateCheck,
          params: {
            fieldName: 'roleCode',
            fieldVal: value,
            conditions: this.model.id ? [{ field: 'id', rule: 'ne', val: toString(this.model.id) }] : []
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
