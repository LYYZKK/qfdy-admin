<template>
  <div>
    <a-card class="m-b-10">
      <h3>访问量统计</h3>
      <div align="right">
        <router-link to="/report/view-report">查看详情</router-link>
      </div>
      <view-report-chart v-model="viewData" v-if="viewData.length>1"></view-report-chart>
    </a-card>
    <a-card>
      <h3>订单统计</h3>
      <div align="right">
        <router-link to="/report/order-report">查看详情</router-link>
      </div>
      <order-report-chart v-model="orderData" v-if="orderData.length>1"></order-report-chart>
    </a-card>
  </div>
</template>

<script>
import OrderReportChart from './components/OrderReportChart'
import ViewReportChart from './components/ViewReportChart'
import { Card } from 'ant-design-vue'
import { request } from '@/api'
import moment from 'moment'
export default {
  name: 'Analysis',
  data() {
    return {
      orderData: [],
      viewData: [],
      params: {
        type: 1,
        start: moment(new Date(new Date(new Date().toLocaleDateString()))).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      },
      api: {
        getOrderData: {
          url: '/order/reports',
          method: 'get'
        },
        getViewData: {
          url: '/view/reports',
          method: 'get'
        }
      }
    }
  },
  methods: {
    getOrderData() {
      request({ ...this.api.getOrderData, params: this.params }).then(res => {
        if (res.success) {
          this.orderData = res.data
          console.log(this.orderData)
        }
      })
    },
    getViewData() {
      console.log(111)
      request({ ...this.api.getViewData, params: this.params }).then(res => {
        if (res.success) {
          this.viewData = res.data
          console.log(this.viewData)
        }
      })
    }
  },
  mounted() {
    this.getOrderData()
    this.getViewData()
  },
  components: {
    ViewReportChart,
    OrderReportChart,
    ACard: Card
  }
}
</script>

<style lang="scss" scoped>
</style>
