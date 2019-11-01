<template>
  <a-card :bordered="false" class="card-area">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称查询" v-model="queryParam.roleName"></a-input>
            </a-form-item>
          </a-col>
          <span class="table-page-search-submitButtons">
            <a-col v-bind="formColResponsiveCfg">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="danger"
        icon="delete"
      >批量删除</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-alert type="info" class="table-alert">
        <span slot="message">
          <span>
            已选择
            <a class="numbers">{{ selectedRowKeys.length }}</a>&nbsp;项
            <a class="clear" @click="onClearSelected">清空</a>
          </span>

          <span class="f-r">
            <a-button type="link" icon="sync" @click="refresh()">刷新</a-button>
            <a-divider type="vertical" />
            <a-popover title="自定义列" trigger="click" placement="leftBottom">
              <template slot="content">
                <a-checkbox-group
                  @change="onColSettingsChange"
                  v-model="settingColumns"
                  :defaultValue="settingColumns"
                >
                  <a-row>
                    <template v-for="(item, idx) in defColumns">
                      <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                        <a-col :span="12" :key="idx">
                          <a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox>
                        </a-col>
                      </template>
                    </template>
                  </a-row>
                </a-checkbox-group>
              </template>
              <a-button type="link" icon="setting">自定义列</a-button>
            </a-popover>
          </span>
        </span>
      </a-alert>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a-button icon="edit" type="link" @click="handleEdit(record)">编辑</a-button>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="grantPerssion(record.id)">授权</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <role-modal ref="modalForm" @ok="modalFormOk"></role-modal>
    <role-permission-modal ref="rolePermissionModal"></role-permission-modal>
  </a-card>
</template>

<script>
import RoleModal from './modules/RoleModal'
import RolePermissionModal from './modules/RolePermissionModal'
import ListMixin from '@/mixins/ListMixin'
import CommonMixin from '@/mixins/CommonMixin'
import {
  Form,
  Input,
  Icon,
  Card,
  Row,
  Col,
  Button,
  Dropdown,
  Checkbox,
  Popover,
  Table,
  Menu,
  Divider,
  Popconfirm,
  Alert
} from 'ant-design-vue'

export default {
  name: 'RoleList',
  mixins: [ListMixin, CommonMixin],
  components: {
    APopconfirm: Popconfirm,
    ADivider: Divider,
    ATable: Table,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ADropdown: Dropdown,
    ACard: Card,
    AButton: Button,
    ARow: Row,
    ACol: Col,
    AIcon: Icon,
    AInput: Input,
    AForm: Form,
    AFormItem: Form.Item,
    AAlert: Alert,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    APopover: Popover,
    RoleModal,
    RolePermissionModal
  },
  data() {
    return {
      description: '角色管理页面',
      queryType: {
        roleName: 'like'
      },
      formColResponsiveCfg: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 8,
        xl: 6,
        xxl: 6
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
          md: { span: 4 },
          lg: { span: 8 },
          xl: { span: 8 },
          xxl: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
          md: { span: 20 },
          lg: { span: 16 },
          xl: { span: 16 },
          xxl: { span: 18 }
        }
      },
      // 表头
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
          title: '角色名称',
          align: 'center',
          dataIndex: 'roleName'
        },
        {
          title: '角色编码',
          align: 'center',
          dataIndex: 'roleCode'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'createAt',
          align: 'center',
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'updateAt',
          align: 'center',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/auth/roles',
        deleteBatch: '/auth/roles/{ids}'
      },
      permissions: {
        add: 'role:add'
      }
    }
  },
  methods: {
    grantPerssion: function(roleId) {
      this.$refs.rolePermissionModal.show(roleId)
    }
  }
}
</script>
<style scoped>
</style>
