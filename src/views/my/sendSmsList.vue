<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="模板编号">
              <a-input placeholder="请输入模板编号" v-model="queryParam.templateCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="模板名称">
              <a-input placeholder="请输入模板名称" v-model="queryParam.templateName"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="电话号码">
              <a-input placeholder="请输入电话号码" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col v-bind="formColResponsiveCfg">
              <a-form-item label="发送状态">
                <a-select v-model="queryParam.sendCode">
                  <a-select-option value>全部</a-select-option>
                  <a-select-option :value="2">成功</a-select-option>
                  <a-select-option :value="3">失败</a-select-option>
                  <a-select-option :value="1">发送中</a-select-option>
                </a-select>
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
      <a-button @click="sendMessage" type="primary" icon="plus">发送短信</a-button>
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
        <div slot="sendCode" slot-scope="text">
          <a-tag :color="sendCodeMap[text].color">{{ sendCodeMap[text].text }}</a-tag>
        </div>
        <span slot="action" slot-scope="text, record">
          <a-button type="link" icon="eye" size="small" @click="handleShow(record)">查看</a-button>
          <!-- <a-divider type="vertical" />
          <a-button type="link" icon="edit" size="small" @click="handleEdit(record)">编辑</a-button>-->

          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a-button type="link" icon="delete">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <send-sms-modal ref="modalForm" @ok="modalFormOk" @saveAliveData="saveAliveData"></send-sms-modal>
  </a-card>
</template>

<script>
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'

import SendSmsModal from './modules/sendSmsModal'
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
  Tag,
  Select
} from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'

export default {
  name: 'SendSmsList',
  mixins: [KeepAliveMixin, ListMixin, DictMixin],
  components: {
    AAlert: Alert,
    SendSmsModal,
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
    JDictSelectTag,
    ASelect: Select,
    ASelectOption: Select.Option,
    JEllipsis
  },
  data() {
    return {
      description: '短信发送页面',
      queryType: {
        templateCode: 'like',
        templateName: 'like',
        phone: 'like'
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
      sendCodeMap: {
        '1': {
          text: '发送中',
          color: 'orange'
        },
        '2': {
          text: '成功',
          color: 'green'
        },
        '3': {
          text: '失败',
          color: 'red'
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
          title: '短信模板编号',
          align: 'center',
          dataIndex: 'templateCode'
        },
        {
          title: '短信模板名称',
          align: 'center',
          dataIndex: 'templateName'
        },
        {
          title: '手机号码',
          align: 'center',
          dataIndex: 'phone',
          customRender: text => {
            return <j-ellipsis value={text} length={23} />
          }
        },
        {
          title: '发送状态',
          align: 'center',
          dataIndex: 'sendCode',
          customRender: text => {
            return <a-tag color={this.sendCodeMap[text].color}>{this.sendCodeMap[text].text}</a-tag>
          }
        },
        {
          title: '发送失败原因',
          align: 'center',
          dataIndex: 'errorMsg',
          customRender: text => {
            return text === 'OK' ? '无' : <j-ellipsis value={text} length={20} />
          }
        },
        {
          title: '操作时间',
          align: 'center',
          dataIndex: 'updateAt'
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
        list: '/message/sms/records/templates/list',
        deleteBatch: '/sms/records/{ids}'
      },
      api: {
        getTemplates: {
          url: '/message/sms/templates',
          method: 'get'
        }
      }
    }
  },
  methods: {
    sendMessage() {
      this.$refs.modalForm.title = '发送短信'
      this.$refs.modalForm.operateType = 'add'
      this.$refs.modalForm.add()
    }
  }
}
</script>
<style scoped>
</style>
