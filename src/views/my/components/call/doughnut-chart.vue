<template>
  <div :id="idName"></div>
</template>

<script>
import G2 from '@antv/g2'

export default {
  name: 'DoughnutChart',
  props: {
    dataSource: {
      type: Array,
      default: () => [
        {
          name: '电话',
          percent: 30,
          a: '1',
          iconfont: 'e64b'
        },
        {
          name: '微信',
          percent: 25,
          a: '1',
          iconfont: 'e650'
        },
        {
          name: 'webchat',
          percent: 15,
          a: '1',
          iconfont: 'e64f'
        }
      ]
    },
    idName: {
      type: String,
      default: 'doughnut'
    }
  },
  data() {
    return {
      chat: null,
      data: null
    }
  },
  methods: {
    initChat() {
      this.data = this.dataSource
      this.chart = new G2.Chart({
        container: this.idName,
        forceFit: true,
        height: 150,
        padding: [0, 'auto']
      })
      this.chart.source(this.data)
      this.chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}%</li>'
      })
      this.chart.legend({
        position: 'right-bottom'
      })
      this.chart.coord('theta', {
        radius: 0.75,
        innerRadius: 0.5
      })
      this.chart
        .intervalStack()
        .position('percent')
        .color('name', ['#5FBEDA', '#59C97D', '#B3D159', '#ECAE68'])
        .opacity(1)
        .label('percent', {
          offset: -8,
          textStyle: {
            fill: 'white',
            fontSize: 11,
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)'
          },
          rotate: 0,
          autoRotate: false,
          formatter: function formatter(text, item) {
            return String(parseInt(item.point.percent)) + '%'
          }
        })
      this.chart.render()
    }
  },
  mounted() {
    this.initChat()
  },
  computed: {}
}
</script>
<style lang="scss" sceopd>
#pie {
  width: 100%;
  height: 300px;
}
</style>
