<template>
  <div>
    <a-row>
      <a-col id="c1" class="chart1"></a-col>
    </a-row>
  </div>
</template>
<script>
import G2 from '@antv/g2'
import { mixinDevice } from '@/utils/mixin.js'
import { Row, Col } from 'ant-design-vue'
export default {
  components: {
    ARow: Row,
    ACol: Col
  },
  name: 'MyCharts',
  mixins: [mixinDevice],
  data() {
    return {
      chart1: [
        {
          name: '呼入',
          时间: '01:00',
          数量: 18.9
        },
        {
          name: '呼入',
          时间: '02:00',
          数量: 28.8
        },
        {
          name: '呼入',
          时间: '03:00',
          数量: 39.3
        },
        {
          name: '呼入',
          时间: '04:00',
          数量: 21.4
        },
        {
          name: '呼入',
          时间: '05:00',
          数量: 47
        },
        {
          name: '呼入',
          时间: '06:00',
          数量: 20.3
        },
        {
          name: '呼入',
          时间: '07:00',
          数量: 24
        },
        {
          name: '呼入',
          时间: '08:00',
          数量: 35.6
        },
        {
          name: '呼入',
          时间: '09:00',
          数量: 20.3
        },
        {
          name: '呼入',
          时间: '10:00',
          数量: 24
        },
        {
          name: '呼入',
          时间: '11:00',
          数量: 35.6
        },
        {
          name: '呼入',
          时间: '12:00',
          数量: 20.3
        },
        {
          name: '呼入',
          时间: '13:00',
          数量: 24
        },
        {
          name: '呼入',
          时间: '14:00',
          数量: 35.6
        },
        {
          name: '呼入',
          时间: '15:00',
          数量: 12.4
        },
        {
          name: '呼入',
          时间: '16:00',
          数量: 23.2
        },
        {
          name: '呼入',
          时间: '17:00',
          数量: 34.5
        },
        {
          name: '呼入',
          时间: '18:00',
          数量: 19.7
        },
        {
          name: '呼入',
          时间: '19:00',
          数量: 32.6
        },
        {
          name: '呼入',
          时间: '20:00',
          数量: 35.5
        },
        {
          name: '呼入',
          时间: '21:00',
          数量: 37.4
        },
        {
          name: '呼入',
          时间: '22:00',
          数量: 42.4
        },
        {
          name: '呼入',
          时间: '23:00',
          数量: 12.4
        },
        {
          name: '呼入',
          时间: '24:00',
          数量: 23.2
        },
        {
          name: '呼损',
          时间: '01:00',
          数量: 39.3
        },
        {
          name: '呼损',
          时间: '02:00',
          数量: 39.3
        },
        {
          name: '呼损',
          时间: '03:00',
          数量: 39.3
        },
        {
          name: '呼损',
          时间: '04:00',
          数量: 11.4
        },
        {
          name: '呼损',
          时间: '05:00',
          数量: 47
        },
        {
          name: '呼损',
          时间: '06:00',
          数量: 20.3
        },
        {
          name: '呼损',
          时间: '07:00',
          数量: 24
        },
        {
          name: '呼损',
          时间: '08:00',
          数量: 35.6
        },
        {
          name: '呼损',
          时间: '09:00',
          数量: 20.3
        },
        {
          name: '呼损',
          时间: '10:00',
          数量: 24
        },
        {
          name: '呼损',
          时间: '11:00',
          数量: 35.6
        },
        {
          name: '呼损',
          时间: '12:00',
          数量: 20.3
        },
        {
          name: '呼损',
          时间: '13:00',
          数量: 24
        },
        {
          name: '呼损',
          时间: '14:00',
          数量: 35.6
        },
        {
          name: '呼损',
          时间: '15:00',
          数量: 12.4
        },
        {
          name: '呼损',
          时间: '16:00',
          数量: 23.2
        },
        {
          name: '呼损',
          时间: '17:00',
          数量: 34.5
        },
        {
          name: '呼损',
          时间: '18:00',
          数量: 29.7
        },
        {
          name: '呼损',
          时间: '19:00',
          数量: 12.6
        },
        {
          name: '呼损',
          时间: '20:00',
          数量: 35.5
        },
        {
          name: '呼损',
          时间: '21:00',
          数量: 37.4
        },
        {
          name: '呼损',
          时间: '22:00',
          数量: 42.4
        },
        {
          name: '呼损',
          时间: '23:00',
          数量: 12.4
        },
        {
          name: '呼损',
          时间: '24:00',
          数量: 23.2
        },
        {
          name: '呼出',
          时间: '01:00',
          数量: 18.9
        },
        {
          name: '呼出',
          时间: '02:00',
          数量: 28.8
        },
        {
          name: '呼出',
          时间: '03:00',
          数量: 39.3
        },
        {
          name: '呼出',
          时间: '04:00',
          数量: 21.4
        },
        {
          name: '呼出',
          时间: '05:00',
          数量: 47
        },
        {
          name: '呼出',
          时间: '06:00',
          数量: 20.3
        },
        {
          name: '呼出',
          时间: '07:00',
          数量: 24
        },
        {
          name: '呼出',
          时间: '08:00',
          数量: 35.6
        },
        {
          name: '呼出',
          时间: '09:00',
          数量: 20.3
        },
        {
          name: '呼出',
          时间: '10:00',
          数量: 24
        },
        {
          name: '呼出',
          时间: '11:00',
          数量: 35.6
        },
        {
          name: '呼出',
          时间: '12:00',
          数量: 20.3
        },
        {
          name: '呼出',
          时间: '13:00',
          数量: 24
        },
        {
          name: '呼出',
          时间: '14:00',
          数量: 35.6
        },
        {
          name: '呼出',
          时间: '15:00',
          数量: 12.4
        },
        {
          name: '呼出',
          时间: '16:00',
          数量: 23.2
        },
        {
          name: '呼出',
          时间: '17:00',
          数量: 34.5
        },
        {
          name: '呼出',
          时间: '18:00',
          数量: 29.7
        },
        {
          name: '呼出',
          时间: '19:00',
          数量: 22.6
        },
        {
          name: '呼出',
          时间: '20:00',
          数量: 35.5
        },
        {
          name: '呼出',
          时间: '21:00',
          数量: 37.4
        },
        {
          name: '呼出',
          时间: '22:00',
          数量: 42.4
        },
        {
          name: '呼出',
          时间: '23:00',
          数量: 12.4
        },
        {
          name: '呼出',
          时间: '24:00',
          数量: 23.2
        }
      ],
      chart2: [
        {
          name: '就绪',
          population: 25
        },
        {
          name: '排队',
          population: 38
        },
        {
          name: '忙碌',
          population: 13
        },
        {
          name: '话后',
          population: 24
        }
      ]
    }
  },
  methods: {
    // 柱状图
    initChart1(cell, param) {
      const chart = new G2.Chart({
        container: cell,
        height: 200,
        padding: [30, 20, 50, 30]
      })
      if (this.device === 'mobile') {
        chart.forceFit(false)
      } else if (this.device === 'desktop') {
        chart.forceFit(true)
      }
      window.onresize = () => {
        if (this.device === 'mobile') {
          chart.forceFit(false)
        } else if (this.device === 'desktop') {
          chart.forceFit(true)
        }
      }
      chart.source(param)
      chart.legend({
        position: 'top-right'
      })
      chart
        .interval()
        .position('时间*数量')
        .color('name')
        .adjust([
          {
            type: 'dodge',
            marginRatio: 1 / 32
          }
        ])
      chart.render()
    }
  },
  mounted() {
    this.initChart1('c1', this.chart1)
  }
}
</script>

<style lang="less" scoped>
.chart1 {
  width: 100%;
  overflow: hidden;
  // overflow-x: scroll;
  // ::-webkit-scrollbar {
  //   visibility: hidden;
  // }
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

