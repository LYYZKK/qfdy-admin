<template>
  <a-card :bordered="false">
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
        :columns="columns"
        size="middle"
        rowKey="id"
        :pagination="false"
        :dataSource="dataSource"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
        <span slot="action" slot-scope="text, record">
          <a-button type="link" icon="eye" @click="handleShow(record)">查看</a-button>
          <a-divider type="vertical" />
          <a-button type="link" icon="edit" @click="handleEdit(record)">编辑</a-button>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.menuType !== 2">
                <a-button type="link" @click="handleAddSub(record)">添加子菜单</a-button>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a-button type="link">删除</a-button>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <!-- 字符串超长截取省略号显示 -->
        <span slot="url" slot-scope="text">
          <j-ellipsis :value="text" :length="25" />
        </span>
        <!-- 字符串超长截取省略号显示-->
        <span slot="component" slot-scope="text">
          <j-ellipsis :value="text" />
        </span>

        <!-- 渲染菜单图标 -->
        <span slot="icon" slot-scope="text, record">
          <a-popover :content="iconPopover(record.icon)" trigger="hover">{{ record.icon }}</a-popover>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal>
  </a-card>
</template>

<script>
import PermissionModal from './modules/PermissionModal'
import ListMixin from '@/mixins/ListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import {
  Alert,
  Card,
  Button,
  Table,
  Divider,
  Dropdown,
  Icon,
  Menu,
  Popover,
  Tag,
  Checkbox,
  Row,
  Col,
  Popconfirm
} from 'ant-design-vue'

export default {
  name: 'PermissionList',
  mixins: [ListMixin],
  components: {
    ATag: Tag,
    APopover: Popover,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    AIcon: Icon,
    ADropdown: Dropdown,
    ADivider: Divider,
    ATable: Table,
    AButton: Button,
    ACard: Card,
    AAlert: Alert,
    ARow: Row,
    ACol: Col,
    APopconfirm: Popconfirm,
    PermissionModal,
    JEllipsis
  },
  data() {
    return {
      description: '菜单管理页面',
      // 表头
      defColumns: [
        {
          title: '菜单名称',
          dataIndex: 'name'
        },
        {
          title: '菜单类型',
          dataIndex: 'menuType',
          customRender: function(text) {
            if (text == 0) {
              return <a-tag color="blue">一级菜单</a-tag>
            } else if (text == 1) {
              return <a-tag color="magenta">子菜单</a-tag>
            } else if (text == 2) {
              return <a-tag color="cyan">按钮/权限</a-tag>
            } else {
              return text
            }
          }
        },
        {
          title: '权限编码',
          dataIndex: 'perms'
        },
        {
          title: 'icon',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '组件',
          dataIndex: 'component',
          scopedSlots: { customRender: 'component' }
        },
        {
          title: '路径',
          dataIndex: 'url',
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '排序',
          dataIndex: 'sortNo'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 215
        }
      ],
      url: {
        list: '/auth/permissions',
        deleteBatch: '/auth/permissions/{ids}'
      },
      defaultQueryFields: ['parentId'],
      ipagination: {
        pageSize: 100
      },
      defaultParam: {
        scope: 'all'
      }
    }
  },
  methods: {
    iconPopover(icon) {
      return <a-icon type={icon} />
    },
    handleAddSub(record) {
      this.$refs.modalForm.title = '添加子菜单'
      this.$refs.modalForm.operateType = 'add'
      this.$refs.modalForm.localMenuType = 1
      this.$refs.modalForm.parentPermission = record
      this.$refs.modalForm.add({ status: '1', permsType: '1', route: true, parentId: record.id })
    }
  }
}
</script>
<style scoped>
</style>
