<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
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
            <a-form-item v-bind="formItemResponsiveCfg" label="说明" hasFeedback>
              <a-textarea
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入说明"
                v-decorator="['description', validatorRules.description]"
              />
              <template v-else>{{ model.description }}</template>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="选择下级组" hasFeedback>
              <a-transfer
                :dataSource="usergroups"
                :targetKeys="targetUsergroupKeys"
                @change="handleChange_usergroup"
                showSearch
                :titles="['可选组', '已选组']"
                :render="item => item.title"
              ></a-transfer>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="选择组中用户" hasFeedback>
              <a-transfer
                :dataSource="users"
                :targetKeys="targetUserKeys"
                @change="handleChange_user"
                showSearch
                :titles="['可选用户', '已选用户']"
                :render="item => item.title"
              ></a-transfer>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">
        <template v-if="['add', 'edit'].includes(operateType)">取消</template>
        <template v-else>关闭</template>
      </a-button>
      <a-button @click="handleOk" v-if="['add', 'edit'].includes(operateType)" type="primary">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { Promise } from 'bluebird'
import { Modal, Spin, Form, Row, Col, Input, InputNumber, Button, Select, Transfer } from 'ant-design-vue'

import ModalMixin from '@/mixins/ModalMixin'
import { request } from '@/api'
import constantConfig from '@/config/constant.config'

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
    ATextarea: Input.TextArea,
    ATransfer: Transfer
  },
  data() {
    return {
      title: '操作',
      visible: false,
      operateType: 'add',
      formColResponsiveCfg: {
        xs: 36,
        sm: 36
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
        name: { rules: [{ required: true, message: '请输入名称!' }] }
      },
      api: {
        getUsergroups: {
          url: '/user/usergroups',
          method: 'get'
        },
        add: {
          url: '/user/usergroups/relation',
          method: 'post'
        },
        edit: {
          url: '/user/usergroups/relation',
          method: 'patch'
        },
        getById: {
          url: '/user/usergroups/{id}',
          method: 'get'
        },
        getChildUsergroups: {
          url: '/user/usergroup-relations/usergroups',
          method: 'get'
        },
        getUsergroupUsers: {
          url: '/user/usergroupusers/users',
          method: 'get'
        },
        getUsers: {
          url: '/user/users',
          method: 'get'
        }
      },
      usergroups: [],
      targetUsergroupKeys: [],
      users: [],
      targetUserKeys: [],
      formFields: ['name', 'description']
    }
  },
  methods: {
    beforeEdit() {
      // this.users = []
      // this.targetUserKeys = []
      // this.selectedUsersStr = ''

      // 得到所有用户（编辑）
      this.getUsers()
      // 得到修改的usergroup
      this.getUsergroupsForEditReqeust()
    },
    beforeAdd() {
      // this.users = []
      // this.targetUserKeys = []
      // this.selectedUsersStr = ''

      // 得到所有用户（添加）
      this.getUsers()
      // 得到添加的usergroup
      this.getUsergroupsForAddRequest()
    },

    getFormData(formData) {
      let selectedUsergroups = []
      for (let i = 0; i < this.targetUsergroupKeys.length; i++) {
        selectedUsergroups.push(this.usergroups[this.targetUsergroupKeys[i]].usergroupId)
      }
      formData.childUsergroups = selectedUsergroups
      let selectedUsers = []
      for (let i = 0; i < this.targetUserKeys.length; i++) {
        selectedUsers.push(this.users[this.targetUserKeys[i]].userId)
      }
      formData.users = selectedUsers
      formData.usergroup = {
        id: this.operateType === 'edit' ? formData.id : null,
        name: formData.name,
        description: formData.description
      }
      return formData
    },

    //  获取选中用户组及所有用户组
    getUsergroupsForEditReqeust() {
      // this.usergroups = []
      // this.targetUsergroupKeys = []

      let selectedUsergroupsStr = ','
      const _this = this
      const p1 = new Promise(resolve => {
        request({
          ..._this.api.getChildUsergroups,
          params: { usergroupId: _this.model.id }
        }).then(res => {
          if (res.success) {
            if (_this.operateType == 'edit') {
              for (let j = 0; j < res.data.length; j++) {
                selectedUsergroupsStr += `${res.data[j].id},`
              }
            }
          }
          resolve()
        })
      })

      const p2 = new Promise(() => {
        // 获取非本身的用户组
        request({
          ..._this.api.getUsergroups,
          params: {
            conditions: JSON.stringify([{ field: 'id', rule: 'ne', val: _this.model.id }])
          }
        }).then(res => {
          if (res.success) {
            for (let i = 0; i < res.data.length; i++) {
              const data_2 = {
                key: i.toString(),
                title: res.data[i].name,
                usergroupId: res.data[i].id
              }
              if (_this.operateType == 'edit') {
                if (selectedUsergroupsStr.indexOf(`,${res.data[i].id},`) != -1) {
                  _this.targetUsergroupKeys.push(data_2.key)
                }
              }
              _this.usergroups.push(data_2)
            }
          }
        })
      })

      p1.then(() => {
        p2
      })
    },

    //  获取所有用户组
    getUsergroupsForAddRequest() {
      request({
        ...this.api.getUsergroups,
        params: { pageSize: constantConfig.MAX_PAGE_SIZE }
      }).then(res => {
        if (res.data && res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            const data = {
              key: i.toString(),
              title: res.data[i].name,
              usergroupId: res.data[i].id
            }
            this.usergroups.push(data)
          }
        }
      })
    },

    // 获取用户
    getUsers() {
      var selectedUsersStr = ','
      if (this.operateType == 'edit') {
        // 获取关联组的所有用户
        request({
          ...this.api.getUsergroupUsers,
          params: { usergroupId: this.model.id }
        }).then(res => {
          for (let j = 0; j < res.data.length; j++) {
            selectedUsersStr += res.data[j].id + ','
            if (this.operateType == 'add') {
              const data = {
                key: j.toString(),
                title: res.data[j].username,
                userId: res.data[j].id
              }
              this.users.push(data)
            }
          }
        })
      }
      // // 获取用户组已选角色所有用户
      // request({
      //   ...this.api.getUsers,
      //   params: { roleIds: this.selectedRole.join(',') }
      // }).then(res => {
      //   res.data.forEach((v, i) => {
      //     selectedUsersStr += `${v.id},`
      //     if (this.operateType == 'add') {
      //       const data = {
      //         key: i.toString(),
      //         title: v.username,
      //         userId: v.id
      //       }
      //       this.users.push(data)
      //     }
      //   })
      // })
      // 获取所有用户
      request({
        ...this.api.getUsers,
        params: { pageSize: constantConfig.MAX_PAGE_SIZE }
      }).then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.length; i++) {
            const data = {
              key: i.toString(),
              title: res.data[i].username,
              userId: res.data[i].id
            }
            if (selectedUsersStr.indexOf(`,${res.data[i].id},`) != -1) {
              this.targetUserKeys.push(data.key)
            }
            this.users.push(data)
          }
        }
      })
    },
    handleChange_usergroup(targetUsergroupKeys) {
      this.targetUsergroupKeys = targetUsergroupKeys
    },
    handleChange_user(targetUserKeys) {
      this.targetUserKeys = targetUserKeys
    }
  }
}
</script>

<style scoped>
</style>
