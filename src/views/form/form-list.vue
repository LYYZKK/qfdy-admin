<template>
  <a-card>
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
            <a-form-item label="类型">
              <j-dict-select-tag
                v-model="queryParam.type"
                placeholder="请选择性别"
                dictCode="form_type"
              />
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
      <a-button @click="openDesigner" type="primary" icon="plus">新增</a-button>
      <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="primary"
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
          <a-button type="link" icon="edit" @click="openDesignerEdite(record.id)">编辑</a-button>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a-button type="link" icon="delete">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <form-designer :formObject="formObj" :formDialog="isShow" :isModify="true"></form-designer>
  </a-card>
</template>

<script>
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import FormDesigner from './designer'
import DesignerTemplate from './modules/designer-template'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import {
  Card,
  Table,
  Divider,
  Button,
  Popconfirm,
  Checkbox,
  Row,
  Col,
  Form,
  Input,
  Alert,
  Popover,
  Modal
} from 'ant-design-vue'
export default {
  name: 'FormList',
  mixins: [KeepAliveMixin, ListMixin, DictMixin],
  data() {
    return {
      formObj: {},
      isShow: false,
      queryType: {
        name: 'like',
        type: 'eq'
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
          title: '表单名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '创建人',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          dataIndex: 'createAt'
        },
        {
          title: '修改人',
          dataIndex: 'updateBy'
        },
        {
          title: '修改时间',
          dataIndex: 'updateAt'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'action' }
        }
      ],

      url: {
        list: '/system/forms',
        deleteBatch: '/system/forms/{ids}'
      },
      // formDialog: false,
      // api: {
      //   getFormById: {
      //     url: '/system/forms/{id}',
      //     method: 'get'
      //   }
      // },
      dictCodes: ['form_type']
    }
  },
  methods: {
    openDesigner() {
      this.isShow = true
      this.formObj = {}
    },
    openDesignerEdite(id) {
      this.isShow = true
      this.formObj = {
        id: id,
        time: new Date().getTime()
      }
    }
  },
  components: {
    FormDesigner,
    DesignerTemplate,
    ACard: Card,
    ATable: Table,
    ADivider: Divider,
    AButton: Button,
    APopconfirm: Popconfirm,
    ACheckbox: Checkbox,
    ARow: Row,
    ACol: Col,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ACheckboxGroup: Checkbox.Group,
    AAlert: Alert,
    APopover: Popover,
    JDictSelectTag,
    AModal: Modal
  }
}
</script>

<style>
</style>
