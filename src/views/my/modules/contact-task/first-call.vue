<template>
  <a-card id="first-call" :bordered="false">
    <!-- table区域-begin -->
    <div>
      <a-alert type="info" class="table-alert">
        <span slot="message">
          <span class="f-r">
            <a-button type="link" icon="sync" @click="getOrderList()">刷新</a-button>
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
            <a-button type="link" @click="handleCall(record)" icon="phone"></a-button>
          </a-tooltip>
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
import { mapGetters } from 'vuex'
import { Card, Table, Button, Alert, Tooltip } from 'ant-design-vue'
import { request } from '@/api'

export default {
  name: 'FirstCall',
  mixins: [mixinDevice, CommonMixin, KeepAliveMixin],
  components: {
    ACard: Card,
    ATable: Table,
    AButton: Button,
    AAlert: Alert,
    ATooltip: Tooltip
  },
  data() {
    return {
      columns: [
        {
          title: '客户姓名',
          dataIndex: 'customer.name',
          align: 'center',
          key: 'customer.name'
        },
        {
          title: '分配时间',
          dataIndex: 'time',
          align: 'center',
          key: 'time'
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      loading: false,
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
      sendToContactTask: null,
      api: {
        list: {
          url: `/contact/ct-users/${this.userInfo().id}/tasks`
        }
      },
      needAliveDataKeys: ['queryParam']
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    getOrderList(status = 0) {
      this.loading = true
      request({
        ...this.api.list,
        // status: 0为首拨 1 为预约
        params: { status: status, pageNo: this.ipagination.current, PageSize: this.ipagination.pageSize }
      }).then(res => {
        if (res.success) {
          this.loading = false
          if (status === 0) {
            this.dataSource = res.data
          }
          if (res.page) {
            if (status === 0) {
              this.ipagination.total = res.page.totalCount
              this.$emit('firstCallCount', res.page.totalCount)
            } else {
              this.$emit('appointmentCount', res.page.totalCount)
            }
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
    handleCall(row) {
      this.$store.dispatch('setCallChatStatus', false)
      this.$store.dispatch('setCustomerId', row.customerId)
      this.sendToContactTask = {
        name: 'firstCall',
        type: 'call',
        data: row
      }
      this.$emit('jumpTo', this.sendToContactTask)
    }
  },
  created() {},
  beforeMount() {
    this.getOrderList()
    this.getOrderList(3)
  }
}
</script>

<style lang='scss' scoped>
</style>
