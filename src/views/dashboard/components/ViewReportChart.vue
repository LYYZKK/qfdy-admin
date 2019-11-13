<template>
  <div>
    <a-row>
      <a-col id="view" :style="{width: '100%', height: '300px'}"></a-col>
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
// import roma from 'echarts/theme/roma'
// import vintage from 'echarts/theme/vintage'
// import dark from 'echarts/theme/dark'
// import infographic from 'echarts/theme/infographic'
// import macarons from 'echarts/theme/macarons'
export default {
  components: {
    ARow: Row,
    ACol: Col
  },
  name: 'MyCharts',
  data() {
    return {
      formmatViewData: {
        indexViewNum: [],
        preViewNum: [],
        spotViewNum: [],
        time: []
      },
      newValue: [],
      shine
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
      this.formmatViewData = {
        indexViewNum: [],
        preViewNum: [],
        spotViewNum: [],
        time: []
      }
      if (this.value.length > 1) {
        this.value.forEach(item => {
          this.formmatViewData.indexViewNum.push(item.indexViewNum === null ? 0 : item.indexViewNum)
          this.formmatViewData.preViewNum.push(item.preViewNum === null ? 0 : item.preViewNum)
          this.formmatViewData.spotViewNum.push(item.spotViewNum)
          this.formmatViewData.time.push(item.time)
        })
        let myChart = echarts.init(document.getElementById('view'), 'shine')
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['首页访问量', '现货访问量', '预购访问量']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.formmatViewData.time
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '首页访问量',
              type: 'bar',
              barWidth: 30,
              data: this.formmatViewData.indexViewNum
            },
            {
              name: '现货访问量',
              type: 'line',
              data: this.formmatViewData.spotViewNum
            },
            {
              name: '预购访问量',
              type: 'line',
              data: this.formmatViewData.preViewNum
            }
          ]
        }
        myChart.setOption(option)
        window.onresize = () => {
          myChart.resize()
        }
      }
    }
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
.viewData {
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
    .topitem {
      font-size: 12px;
      width: 50%;
      margin-bottom: 8px;
    }
  }
}
</style>

