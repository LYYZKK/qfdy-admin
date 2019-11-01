<template>
  <a-card id="appointment" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="小结">
              <a-tree-select
                showSearch
                treeNodeFilterProp="title"
                :treeData="treeData"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择小结"
                allowClear
                treeDefaultExpandAll
                v-model="searchParam.summaryId"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="预约时间">
              <j-Range-Date
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                v-model="appointmentTime"
                class="j-range"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="上次联系时间">
              <j-Range-Date
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                v-model="lastContactTime"
                class="j-range"
              />
            </a-form-item>
          </a-col>
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="拨打次数">
              <a-input-number
                placeholder="请输入"
                v-model="searchParam.beginCallNum"
              />
              ~
              <a-input-number
                placeholder="请输入"
                v-model="searchParam.endCallNum"
              />
            </a-form-item>
          </a-col>
          <span class="table-page-search-submitButtons">
            <a-col v-bind="formColResponsiveCfg">
              <a-button type="primary" @click="getOrderList" icon="search">查询</a-button>
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
            <a-button type="link" icon="sync" @click="getOrderList(3)">刷新</a-button>
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
      >
        <span slot="action" slot-scope="text, record">
          <a-tooltip title="电话联系客户">
            <a-button type="link" @click="handlePhone(record)" icon="phone"></a-button>
          </a-tooltip>
          <!-- <a-divider type="vertical" />
          <a-button type="link" @click="handleWechat(record)" icon="wechat">微信</a-button>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import CommonMixin from '@/mixins/CommonMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import {
  Form,
  Icon,
  Card,
  Table,
  Button,
  Row,
  Col,
  Input,
  InputNumber,
  TreeSelect,
  Divider,
  Alert,
  Tooltip
} from 'ant-design-vue'
import JRangeDate from '@/components/jeecg/JRangeDate.vue'
import JDate from '@/components/jeecg/JDate.vue'
import { request } from '@/api'
import { buildTreeDataForAntd } from '@/utils/util'
import { mapGetters } from 'vuex'

export default {
  name: 'Appointment',
  mixins: [mixinDevice, CommonMixin, KeepAliveMixin],
  components: {
    JRangeDate,
    JDate,
    AForm: Form,
    AFormItem: Form.Item,
    AIcon: Icon,
    ACard: Card,
    ATable: Table,
    AButton: Button,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    AInputNumber: InputNumber,
    ATreeSelect: TreeSelect,
    ATreeSelectNode: TreeSelect.TreeNode,
    ADivider: Divider,
    AAlert: Alert,
    ATooltip: Tooltip
  },
  data() {
    return {
      treeData: [],
      formColResponsiveCfg: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 8,
        xl: 6,
        xxl: 6
      },
      columns: [
        {
          title: '客户姓名',
          dataIndex: 'customer.name',
          align: 'center',
          key: 'customer.name'
        },
        {
          title: '拨打次数',
          dataIndex: 'contactedTimes',
          align: 'center',
          key: 'contactedTimes'
        },
        {
          title: '上次联系时间',
          dataIndex: 'updateAt',
          align: 'center',
          key: 'updateAt'
        },
        {
          title: '预约时间',
          dataIndex: 'time',
          align: 'center',
          key: 'time'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      appointmentTime: null,
      lastContactTime: null,
      searchParam: {
        status: 3, // 3为预约
        summaryId: null,
        beginAppointmentDate: null,
        endAppointmentDate: null,
        beginLastContactDate: null,
        endLastContactDate: null,
        beginCallNum: null,
        endCallNum: null,
        pageNo: 1,
        pageSize: 10
      },
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100', '200', '500'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      loading: false,
      sendToContactTask: null,
      api: {
        list: {
          url: `/contact/ct-users/${this.userInfo().id}/tasks`
        },
        getSummeryTree: {
          url: '/contact/summary-items/list/tree'
        }
      }
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    getOrderList() {
      this.loading = true
      this.searchParam.beginAppointmentDate = this.appointmentTime ? this.appointmentTime[0] : null
      this.searchParam.endAppointmentDate = this.appointmentTime ? this.appointmentTime[1] : null
      this.searchParam.beginLastContactDate = this.lastContactTime ? this.lastContactTime[0] : null
      this.searchParam.endLastContactDate = this.lastContactTime ? this.lastContactTime[1] : null
      request({ ...this.api.list, params: this.searchParam }).then(res => {
        if (res.success) {
          this.loading = false
          this.dataSource = res.data
          if (res.page) {
            this.ipagination.total = res.page.totalCount
            this.$emit('appointmentCount', res.page.totalCount)
          } else {
            this.ipagination = false
          }
        }
      })
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.getOrderList()
    },
    getSummeryTree() {
      request({ ...this.api.getSummeryTree }).then(res => {
        if (res.success) {
          this.treeData = buildTreeDataForAntd({ data: res.data }).data
        }
      })
    },
    searchReset() {
      this.searchParam = {
        status: 3,
        summary: null,
        appointmentTime: null,
        lastContactTime: null,
        beginCallNum: null,
        endCallNum: null,
        pageNo: 1,
        pageSize: 10
      }
    },
    handlePhone(row) {
      this.$store.dispatch('setCallChatStatus', false)
      this.$store.dispatch('setCustomerId', row.customerId)
      this.sendToContactTask = {
        name: 'appointment',
        type: 'call',
        data: row
      }
      this.$emit('jumpTo', this.sendToContactTask)
    },
    handleWechat(row) {
      this.sendToContactTask = {
        name: 'appointment',
        type: 'wechat',
        data: row
      }
      this.$emit('jumpTo', this.sendToContactTask)
    }
  },
  beforeMount() {
    this.getSummeryTree()
    this.getOrderList()
  }
}
</script>

<style lang='scss' scoped>
#appointment {
  .j-range {
    width: 100% !important;
  }
}
</style>
