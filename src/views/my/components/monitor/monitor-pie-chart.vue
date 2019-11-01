<template>
  <div>
    <div :id="pieId"></div>
  </div>
</template>
<script>
import G2 from '@antv/g2'
import { mixinDevice } from '@/utils/mixin.js'
export default {
  name: 'PieCharts1',
  mixins: [mixinDevice],
  data() {
    return {
    }
  },
  props:{
    pieId:{
      type:String,
      default(){
        return ''
      }
    },
    pieData:{
      type:Array,
      default(){
        return [
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
    }
  },
  methods: {
    // 饼图
    initChart2(cell, param) {
      var chart = new G2.Chart({
        container: cell,
        forceFit: true,
        height: 130,
        padding: [0, 'auto']
      })
      chart.source(param, {
        percent: {
          formatter: function formatter(val) {
            val = val + '%'
            return val
          }
        }
      })
      chart.coord('theta', {
        radius: 0.75
      })
      chart.legend({
        position: 'right-bottom'
      })
      chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      })
      chart
        .intervalStack()
        .position('population')
        .color('name')
        .label('population', {
          formatter: function formatter(val, name) {
            return name.point.name + ': ' + val
          }
        })
        .tooltip('name*population', function(name, population) {
          population = population + '%'
          return {
            name: name,
            value: population
          }
        })
        .style({
          lineWidth: 1,
          stroke: '#fff'
        })
      chart.render()
    }
  },
  mounted() {
    this.initChart2(this.pieId, this.pieData)
  }
}
</script>


