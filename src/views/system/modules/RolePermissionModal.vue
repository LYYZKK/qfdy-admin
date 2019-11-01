<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="650"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    class="p-b-53"
    style="height: calc(100% - 55px); overflow: auto;"
  >
    <a-form>
      <a-form-item label="所拥有的权限">
        <a-tree
          checkable
          @check="onCheck"
          :checkedKeys="checkedKeys"
          :treeData="treeData"
          @expand="onExpand"
          @select="onTreeNodeSelect"
          :expandedKeys="expandedKeys"
          :checkStrictly="checkStrictly"
        >
          <span slot="hasDatarule" slot-scope="{slotTitle, ruleFlag}">
            {{ slotTitle }}
            <a-icon v-if="ruleFlag" type="align-left" class="m-l-5 c-red"></a-icon>
          </span>
        </a-tree>
      </a-form-item>
    </a-form>

    <div class="drawer-bootom-button">
      <a-dropdown class="f-l" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" v-if="checkStrictly" @click="switchCheckStrictly(1)">父子级联</a-menu-item>
          <a-menu-item key="2" v-if="!checkStrictly" @click="switchCheckStrictly(2)">取消父子级联</a-menu-item>
          <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button>
          树操作
          <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
        <a-button class="m-r-8">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import toString from 'lodash.tostring'
import { request } from '@/api'

import constantConfig from '@/config/constant.config'
import { buildTreeDataForAntd } from '@/utils/util'

import { Drawer, Form, Tree, Dropdown, Menu, Button, Popconfirm, Icon } from 'ant-design-vue'
export default {
  name: 'RolePermissionModal',
  components: {
    ADrawer: Drawer,
    AForm: Form,
    AFormItem: Form.Item,
    ATree: Tree,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AButton: Button,
    APopconfirm: Popconfirm,
    AIcon: Icon
  },
  data() {
    return {
      roleId: '',
      treeData: [],
      defaultCheckedKeys: [],
      checkedKeys: [],
      expandedKeys: [],
      allTreeKeys: [],
      autoExpandParent: true,
      checkStrictly: true,
      title: '角色权限配置',
      visible: false,
      loading: false,
      api: {
        getPermissions: {
          url: '/auth/permissions',
          method: 'get'
        },
        getPermissionsByRoleId: {
          url: '/auth/roles/{roleId}/permissions',
          method: 'get'
        },
        updatePermissionsByRoleId: {
          url: '/auth/roles/{roleId}/permissions',
          method: 'put'
        }
      }
    }
  },
  methods: {
    onTreeNodeSelect(id) {
      this.$refs.datarule.show(id[0], this.roleId)
    },
    onCheck(o) {
      if (this.checkStrictly) {
        this.checkedKeys = o.checked
      } else {
        this.checkedKeys = o
      }
    },
    show(roleId) {
      this.roleId = roleId
      this.visible = true

      request({ ...this.api.getPermissions, params: { pageSize: constantConfig.MAX_PAGE_SIZE, scope: 'all' } }).then(permissionsRes => {
        if (permissionsRes.success) {
          this.treeData = buildTreeDataForAntd({ data: permissionsRes.data }).data
          this.allTreeKeys = buildTreeDataForAntd({ data: permissionsRes.data }).ids
          this.expandedKeys = this.allTreeKeys

          request({
            ...this.api.getPermissionsByRoleId,
            urlReplacements: [{ substr: '{roleId}', replacement: this.roleId }]
          }).then(rolePermissionsRes => {
            const permissionIds = []
            rolePermissionsRes.data.forEach(item => {
              permissionIds.push(toString(item.permissionId))
            })

            this.checkedKeys = permissionIds
            this.defaultCheckedKeys = permissionIds
          })
        }
      })
    },
    close() {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    reset() {
      this.expandedKeys = []
      this.checkedKeys = []
      this.defaultCheckedKeys = []
      this.loading = false
    },
    expandAll() {
      this.expandedKeys = this.allTreeKeys
    },
    closeAll() {
      this.expandedKeys = []
    },
    checkALL() {
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      this.checkedKeys = []
    },
    switchCheckStrictly(v) {
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    },
    handleCancel() {
      this.close()
    },
    handleSubmit() {
      this.loading = true
      const _this = this

      request({
        ...this.api.updatePermissionsByRoleId,
        params: {
          permIds: this.checkedKeys
        },
        urlReplacements: [{ substr: '{roleId}', replacement: this.roleId }]
      }).then(res => {
        if (res.success) {
          _this.$message.success(res.message)
          _this.close()
        } else {
          _this.$message.error(res.message)
        }
        _this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
