<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="字典名称">
              <a-input placeholder="请输入字典名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="字典编号">
              <a-input placeholder="请输入字典编号" v-model="queryParam.code"></a-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-alert type="info" class="table-alert">
        <span slot="message">
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
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a-button type="link" icon="eye" @click="handleShow(record)">查看</a-button>
          <a-divider type="vertical" />
          <a-button type="link" icon="edit" @click="handleEdit(record)">编辑</a-button>
          <a-divider type="vertical" />
          <a-button type="link" icon="setting" @click="editDictItem(record)">字典配置</a-button>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() =>handleDelete(record.id)">
            <a-button type="link" icon="delete">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <dict-modal ref="modalForm" @ok="modalFormOk" @saveAliveData="saveAliveData"></dict-modal>
    <!-- 字典类型 -->
    <dict-item-list ref="dictItemList"></dict-item-list>
  </a-card>
</template>

<script>
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'

import DictModal from './modules/DictModal'
import DictItemList from './DictItemList'
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
  mixins: [KeepAliveMixin, ListMixin],
  components: {
    DictModal,
    DictItemList,
    AAlert: Alert,
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
          title: '字典名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '字典编号',
          align: 'center',
          dataIndex: 'code'
        },
        {
          title: '字典类型',
          align: 'center',
          dataIndex: 'type',
          customRender: text => {
            return !text || this.toString(text) === '0' ? (
              <a-tag color="green">一级</a-tag>
            ) : (
              <a-tag color="blue">多级</a-tag>
            )
          }
        },
        {
          title: '描述',
          align: 'center',
          dataIndex: 'description'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/system/dicts',
        deleteBatch: '/system/dicts/{ids}'
      }
    }
  },
  methods: {
    // 编辑字典数据
    editDictItem(record) {
      this.$refs.dictItemList.showDrawer(record)
    }
  }
}
</script>
<style scoped>
</style>
