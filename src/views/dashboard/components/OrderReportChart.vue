<template>
  <div>
    <a-row>
      <a-col id="order" :style="{width: '100%', height: '300px'}"></a-col>
    </a-row>
  </div>
</template>
<script>
import { Row, Col } from 'ant-design-vue'
import echarts from 'echarts/lib/echarts'
// 引入折线图/柱状图等组件
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/radar'
// 引入提示框和title组件，图例
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll' // 图例滚
import shine from 'echarts/theme/shine'
export default {
  components: {
    ARow: Row,
    ACol: Col
  },
  name: 'MyCharts',
  data() {
    return {
      shine,
      formatOrderData: {
        amount: [],
        orderNum: [],
        time: []
      },
      newValue: []
    }
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    // 柱状图
    initChart2() {
      this.formatOrderData = {
        amount: [],
        orderNum: [],
        time: []
      }
      if (this.value.length > 1) {
        this.value.forEach(item => {
          this.formatOrderData.amount.push(item.amount === null ? 0 : item.amount)
          this.formatOrderData.orderNum.push(item.orderNum)
          this.formatOrderData.time.push(item.time)
        })
        let myChartOrder = echarts.init(document.getElementById('order'), 'shine')
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['订单数量', '订单金额', '订单平均金额']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.formatOrderData.time
          },
          yAxis: [
            {
              type: 'value',
              name: '订单金额'
            },
            {
              type: 'value',
              name: '订单数量'
            }
          ],
          series: [
            {
              name: '订单数量',
              type: 'bar',
              data: this.formatOrderData.orderNum
            },
            {
              name: '订单金额',
              type: 'line',
              data: this.formatOrderData.amount
            },
            {
              name: '订单平均金额',
              type: 'line',
              data: this.formatOrderData.avgAmount
            }
          ]
        }
        myChartOrder.setOption(option)
        window.onresize = () => {
          myChartOrder.resize()
        }
      }
    },
    // 父子组件传值
    initPage() {}
  },
  mounted() {
    this.initChart2()
  },
  watch: {
    value() {
      this.initChart2()
    }
  }
}
</script>

<style lang="less" scoped>
.orderData {
  width: 100%;
  overflow: hidden;
}
.chart {
  margin-top: 10px;
  box-sizing: bview-box;
  ::v-deep .ant-card {
    margin-bottom: 10px;
  }
  ::v-deep .ant-card-body {
    padding: 15px !important;
  }

  .circle {
    font-size: 12px;
    margin-right: 10px;
    width: 18px;
    height: 18px;
    display: inline-block;
    border-radius: 50%;
    background: #eee;
    line-height: 18px;
    text-align: center;
    color: #fff;
  }
  .colorful1 {
    background: #3798f8;
  }
  .colorful2 {
    background: #59cb74;
  }
  .colorful3 {
    background: #fad54a;
  }
  .colorful4 {
    background: #4dcccb;
  }
  .top {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 135px;
    // margin-top: 30px;
    .topitem {
      font-size: 12px;
      width: 50%;
      margin-bottom: 8px;
    }
  }
}
</style>

