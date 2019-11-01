<template>
  <div>
    <a-card>
      <h3>呼叫中心呼叫统计</h3>
      <columnChart></columnChart>
    </a-card>
    <div class="chart">
      <a-row type="flex" justify="space-between" align="middle" :gutter="10">
        <a-col v-bind="formColResponsiveLeft">
          <div>
            <a-card>
              <h3>坐席状态人数分布图</h3>
              <pieChart :pieId="pie1"></pieChart>
            </a-card>
          </div>
        </a-col>
        <a-col v-bind="formColResponsiveCenter">
          <div>
            <a-card>
              <h3>坐席状态人数分布图</h3>
              <pieChart :pieId="pie2"></pieChart>
            </a-card>
          </div>
        </a-col>
        <a-col v-bind="formColResponsiveRight">
          <a-card>
            <h3>坐席创增时长 Top 10 排名</h3>
            <rank></rank>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-card>
      <h3>坐席状态监控</h3>
      <status></status>
    </a-card>
  </div>
</template>
<script>
import columnChart from './components/monitor/monitor-column-chart'
import pieChart from './components/monitor/monitor-pie-chart'
import status from './modules/monitor-status'
import rank from './modules/monitor-rank'
import { mixinDevice } from '@/utils/mixin.js'
import { Card, Row, Col } from 'ant-design-vue'
export default {
  mixins: [mixinDevice],
  data() {
    return {
      formColResponsiveLeft: {
        xs: 24,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
        xxl: 6
      },
      formColResponsiveCenter: {
        xs: 24,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
        xxl: 6
      },
      formColResponsiveRight: {
        xs: 24,
        sm: 12,
        md: 12,
        lg: 12,
        xl: 12,
        xxl: 12
      },
      pie1: 'pie1',
      pie2: 'pie2'
    }
  },
  methods: {},
  components: {
    columnChart,
    pieChart,
    status,
    rank,
    ACard: Card,
    ACol: Col,
    ARow: Row
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-card-body {
  padding: 10px 10px 0 10px !important;
}
::v-deep .ant-badge-status-text {
  margin-left: 0;
}
.chart {
  margin-top: 10px;
  box-sizing: border-box;
  ::v-deep .ant-card {
    margin-bottom: 10px;
  }
  ::v-deep .ant-card-body {
    padding: 15px !important;
  }
}
</style>


