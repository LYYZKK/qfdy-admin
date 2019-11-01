<template>
  <a-card id="appointment" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <!-- <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="客户姓名">
              <a-input placeholder="请输入客户姓名" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>-->
          <!-- <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="商品">
              <a-select
                showSearch
                placeholder="请选择商品"
                v-model="queryParam.productId"
                mode="multiple"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in productList"
                  :key="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>-->
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="支付状态">
              <a-select showSearch placeholder="请选择支付状态" v-model="queryParam.payStatus">
                <a-select-option value="1">已支付</a-select-option>
                <a-select-option value="2">未支付</a-select-option>
              </a-select>
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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        @expand="handleExpanded"
      >
        <span slot="payStatus" slot-scope="payStatus">
          <a-tag :color="payStatus==='1'?'green':'orange'">{{ payStatus==='1'?'已支付':'未支付' }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record" v-if="record.payStatus!=='1'">
          <!-- <a-button type="link" @click="handlePhone(record)" icon="wechat">发送付款码</a-button> -->
          <a-button type="link" @click="handleShow(record)" icon="eye">查看</a-button>
          <a-divider type="vertical" />
          <a-button type="link" @click="handleWechat(record)" icon="message">发送支付短信</a-button>
        </span>
        <div slot="expandedRowRender" slot-scope="expandedRowRender">
          <a-row class="expandedRow">
            <my-steps
              ref="mySteps"
              :getTimesById="api.getTimesById.url"
              :getByCustomerId="api.getRecords.url"
              multipleRows="multipleRows"
              :stepSize="6"
              :customerId="expandedRowRender.customerId"
            />
          </a-row>
        </div>
      </a-table>
    </div>
    <!-- table区域-end -->

    <today-order-model ref="modalForm" />
  </a-card>
</template>

<script>
import ListMixin from '@/mixins/ListMixin'
// import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import mySteps from '../../components/call/my-steps'
import {
  Alert,
  Form,
  Icon,
  Card,
  Table,
  Button,
  Row,
  Col,
  Input,
  Divider,
  Select,
  Tag,
  Popover,
  Checkbox
} from 'ant-design-vue'
import todayOrderModel from './today-order-model'
import moment from 'moment'
// import { request } from '@/api'
// import constantConfig from '@/config/constant.config'

export default {
  name: 'TodayorderManege',
  mixins: [ListMixin],
  components: {
    mySteps,
    todayOrderModel,
    AForm: Form,
    AFormItem: Form.Item,
    AIcon: Icon,
    ACard: Card,
    ATable: Table,
    AButton: Button,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ADivider: Divider,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATag: Tag,
    AAlert: Alert,
    APopover: Popover,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group
  },
  data() {
    const today = moment().format('YYYY-MM-DD')
    return {
      queryType: {
        // customerName: 'like',
        payStatus: 'eq'
        // productId: 'eq'
      },
      formColResponsiveCfg: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 8,
        xl: 6,
        xxl: 6
      },
      defColumns: [
        {
          title: '订单编号',
          dataIndex: 'orderNo',
          align: 'center',
          key: 'orderNo'
        },
        {
          title: '下单时间',
          dataIndex: 'createAt',
          align: 'center',
          key: 'createAt'
        },
        // {
        //   title: '活动名称',
        //   dataIndex: 'activeName',
        //   align: 'center',
        //   key: 'activeName'
        // },
        {
          title: '客户姓名',
          dataIndex: 'customerName',
          align: 'center',
          key: 'customerName'
        },
        {
          title: '支付状态',
          dataIndex: 'payStatus',
          align: 'center',
          key: 'payStatus',
          scopedSlots: { customRender: 'payStatus' }
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      defaultQueryFields: ['customerId'],
      dataSource: [],
      stepInfo: [],
      productList: [],
      sendToContactTask: null,
      url: {
        list: '/order/orders'
      },
      api: {
        getProductList: {
          url: '/order/products'
        },
        getRecords: {
          url: '/contact/records/customer/{customerId}'
        },
        getTimesById: {
          url: '/contact/phone-records'
        }
      },
      needAliveDataKeys: ['queryParam'],
      filters: [
        { field: 'createAt', rule: 'ge', val: `${today} 00:00:00` },
        { field: 'createAt', rule: 'le', val: `${today} 23:59:59` }
      ]
    }
  },
  methods: {
    moment,
    handleExpanded(expanded, row) {
      this.$nextTick(() => {
        if (expanded) {
          this.$refs.mySteps.getRecordsByCustomerId({ customerId: row.customerId })
        }
      })
    },
    handlePhone(row) {
      this.sendToContactTask = {
        name: '预约',
        type: 'call',
        data: row
      }
      this.$emit('jumpTo', this.sendToContactTask)
    },
    handleWechat(row) {
      this.sendToContactTask = {
        name: '预约',
        type: 'wechat',
        data: row
      }
      this.$emit('jumpTo', this.sendToContactTask)
    },
    // 获取产品下拉框选项
    handleShow(record) {
      this.$refs.modalForm.title = '查看'
      this.$refs.modalForm.operateType = 'show'
      this.$refs.modalForm.visible = true
      this.$refs.modalForm.showDetail(record)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
