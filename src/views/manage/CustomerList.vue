<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名查询" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号查询" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <span class="table-page-search-submitButtons">
            <a-col v-bind="formColResponsiveCfg">
              <a-button type="primary" @click="searchQuery(queryParam)" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info table-alert">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择
        <a class="numbers">{{ selectedRowKeys.length }}</a>&nbsp;项
        <a class="clear" @click="onClearSelected">清空</a>

        <span class="tab-alert-action">
          <a-button type="link" icon="sync" @click="refresh()">刷新</a-button>
          <a-divider type="vertical" />
          <a-popover title="自定义列" trigger="click" placement="leftBottom" class="w-400">
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
            <a>
              <a-icon type="setting" />&nbsp;自定义列
            </a>
          </a-popover>
        </span>
      </div>

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
        <!-- <span slot slot-scope="text, record">{{ text }}</span> -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleShow(record)">
            <a-icon type="eye" />查看
          </a>

          <a-divider type="vertical" />
          <a @click="handleEdit(record)">
            <a-icon type="edit" />编辑
          </a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <customer-modal ref="modalForm" @ok="modalFormOk"></customer-modal>
  </a-card>
</template>

<script>
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import CustomerModal from './modules/CustomerModal'
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
  Popconfirm
} from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'

export default {
  name: 'UserList',
  mixins: [KeepAliveMixin, ListMixin, DictMixin],
  components: {
    CustomerModal,
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
    JDictSelectTag
  },
  data() {
    return {
      description: '用户管理页面',
      queryType: {
        name: 'like',
        sex: 'eq'
      },
      queryParam: {},
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
          title: '客户姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'phone'
        },

        {
          title: '地址',
          align: 'center',
          dataIndex: 'address'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/customers',
        deleteBatch: '/customers/{ids}'
      }
    }
  }
}
</script>
<style scoped>
</style>
