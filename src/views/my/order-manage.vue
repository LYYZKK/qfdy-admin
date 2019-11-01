<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="订单号">
              <a-input placeholder="请输入订单号查询" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="支付方式">
              <j-dict-select-tag
                v-model="queryParam.payType"
                placeholder="请选择支付方式"
                dictCode="pay_type"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="订单状态">
              <a-select v-model="queryParam.status">
                <a-select-option value>请选择</a-select-option>
                <a-select-option :value="0">未完成</a-select-option>
                <a-select-option :value="1">已完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col v-bind="formColResponsiveCfg">
              <a-form-item label="订单金额">
                <a-input-number placeholder="请输入" v-model="queryParam.amount[0]" :min="0" />~
                <a-input-number placeholder="请输入" v-model="queryParam.amount[1]" :min="0" />
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
        <div slot="status" slot-scope="text">
          <a-tag :color="text===0?'orange':'green'">{{ text === 0 ? '未完成' : '已完成' }}</a-tag>
        </div>
        <div slot="amount" slot-scope="text">
          <span class="bold c-red">{{ '￥ '+text }}</span>
        </div>
        <span slot="action" slot-scope="text, record">
          <a-button type="link" icon="eye" @click="handleShow(record)">查看</a-button>
        </span>
      </a-table>
    </div>
    <!-- <a-button type="link" icon="eye" @click="handleShow()">查看</a-button> -->
    <!-- table区域-end -->
    <today-order-model ref="modalForm" />
  </a-card>
</template>

<script>
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import todayOrderModel from './modules/contact-task/today-order-model'
import JEllipsis from '@/components/jeecg/JEllipsis'
import {
  Alert,
  Card,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  Icon,
  Popover,
  Table,
  Popconfirm,
  Tag,
  Select,
  Checkbox,
  Divider
} from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'OrderManager',
  mixins: [KeepAliveMixin, ListMixin, DictMixin],
  components: {
    JEllipsis,
    AAlert: Alert,
    ACard: Card,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    AForm: Form,
    ARow: Row,
    ACol: Col,
    AFormItem: Form.Item,
    AInput: Input,
    AInputNumber: InputNumber,
    AButton: Button,
    AIcon: Icon,
    APopover: Popover,
    ATable: Table,
    APopconfirm: Popconfirm,
    ATag: Tag,
    ASelect: Select,
    ASelectOption: Select.Option,
    ADivider: Divider,
    JDictSelectTag,
    todayOrderModel
  },
  props: {
    customerId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      description: '用户管理页面',
      queryType: {
        createBy: 'eq',
        orderNo: 'like',
        payType: 'eq',
        status: 'eq'
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
      filters:[
        { field: 'customerId', rule: 'eq', val: this.customerId }
      ],
      queryParam: {
        amount: []
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
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo'
        },
        {
          title: '订单金额',
          align: 'center',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '支付方式',
          align: 'center',
          dataIndex: 'payType',
          customRender: text => {
            return this.DICT_SHOW_RENDER('pay_type', text)
          }
        },
        {
          title: '备注',
          align: 'center',
          width: 400,
          dataIndex: 'remark',
          customRender: text => {
            return <j-ellipsis value={text ? text : ''} length={20} />
          }
        },
        {
          title: '操作人',
          align: 'center',
          dataIndex: 'updateBy',
          customRender: text => {
            return this.getRealNameById()[text]
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
        list: '/order/orders'
      },
      dictCodes: ['pay_type']
    }
  },
  methods: {
    ...mapGetters(['userInfo', 'getRealNameById']),
    handleShow(record) {
      this.$refs.modalForm.title = '查看'
      this.$refs.modalForm.operateType = 'show'
      this.$refs.modalForm.visible = true
      this.$refs.modalForm.showDetail(record)
    }
  },
  beforeMount() {
    console.log(this.customerId)
    // 搜索当前登录的用户
    this.queryParam.createBy = this.userInfo().id
    // 使select默认选中第一项，与数据字典保持一致
    this.queryParam.status = ''
  }
}
</script>
<style scoped>
</style>
