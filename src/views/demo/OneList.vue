<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称查询" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="年龄">
              <a-input placeholder="请输入名称查询" v-model="queryParam.age"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col v-bind="formColResponsiveCfg">
              <a-form-item label="字典下拉">
                <j-dict-select-tag v-model="queryParam.sex" placeholder="请选择用户名称" dictCode="sex" />
              </a-form-item>
            </a-col>
          </template>
          <span class="table-page-search-submitButtons">
            <a-col v-bind="formColResponsiveCfg">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              <a @click="handleToggleSearch" class="search-toggler">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="plus" @click="onetomany">一对多</a-button>
      <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="danger"
        icon="delete"
      >批量删除</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="delete" />修改有效
          </a-menu-item>
        </a-menu>
        <a-button>
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
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
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a-button>删除</a-button>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <one-modal ref="modalForm" @ok="modalFormOk" @saveAliveData="saveAliveData"></one-modal>

    <!-- 一对多表单区域 -->
    <one-to-n-tabs-modal ref="oneToNTabsModal" @ok="modalFormOk" @saveAliveData="saveAliveData"></one-to-n-tabs-modal>
  </a-card>
</template>

<script>
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'

import OneToNTabsModal from './modules/OneToNTabsModal'
import OneModal from './modules/OneModal'
import {
  Alert,
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Upload,
  Dropdown,
  Menu,
  Divider,
  Popover,
  Checkbox,
  Table,
  Popconfirm,
  Tag
} from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'

export default {
  name: 'OneList',
  mixins: [KeepAliveMixin, ListMixin, DictMixin],
  components: {
    AAlert: Alert,
    OneModal,
    OneToNTabsModal,
    ACard: Card,
    AForm: Form,
    ARow: Row,
    ACol: Col,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    AIcon: Icon,
    AUpload: Upload,
    ADivider: Divider,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    APopover: Popover,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    ATable: Table,
    APopconfirm: Popconfirm,
    ATag: Tag,
    JDictSelectTag
  },
  data() {
    return {
      description: '用户管理页面',
      queryType: {
        name: 'like',
        sex: 'eq'
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '关键词',
          align: 'center',
          dataIndex: 'keyWord'
        },
        {
          title: '打卡时间',
          align: 'center',
          dataIndex: 'punchTime'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
          customRender: text => {
            return this.DICT_SHOW_RENDER('sex', text)
          }
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age'
        },
        {
          title: '生日',
          align: 'center',
          dataIndex: 'birthday'
        },
        {
          title: '邮箱',
          align: 'center',
          dataIndex: 'email'
        },
        {
          title: '个人简介',
          align: 'center',
          dataIndex: 'content'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      url: {
        list: '/test/jeecgDemo/list',
        deleteBatch: '/test/jeecgDemo/deleteBatch'
      },
      dictCodes: ['sex'],
      testingMode: false
    }
  },
  methods: {
    onetomany() {
      this.$refs.oneToNTabsModal.add()
      this.$refs.oneToNTabsModal.operateType = 'add'
      this.$refs.oneToNTabsModal.title = '新增'
    }
  }
}
</script>
<style scoped>
</style>
