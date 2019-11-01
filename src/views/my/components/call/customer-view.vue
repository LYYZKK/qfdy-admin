<template>
  <div id="customer-view" :class="tablet?'pad':device">
    <a-row class="step-view-container">
      <my-steps
        ref="mySteps"
        :getByCustomerId="api.getRecords.url"
        :getTimesById="api.getTimesById.url"
        :stepSize="3"
        :customerId="customerId"
      />
    </a-row>
    <a-row class="doughnuts-container" :gutter="10">
      <a-col v-bind="pieChartLayout">
        <a-card>
          <h4>接触渠道统计图</h4>
          <doughnut-chart
            :idName="'doughnut1'"
            :dataSource="doughnutData1"
            v-if="showChannelStatistics"
          ></doughnut-chart>
        </a-card>
      </a-col>
      <a-col v-bind="pieChartLayout">
        <a-card>
          <h4>业务(话后小结)分布统计</h4>
          <doughnut-chart
            :idName="'doughnut2'"
            :dataSource="doughnutData2"
            v-if="showSummaryStatistics"
          ></doughnut-chart>
        </a-card>
      </a-col>
    </a-row>
    <!-- <a-row class="hotmenuitem-container">
      <div>
        <div v-for="(item,index) in hotmenuitem" :key="index">
          <a-row class="hotmenuitem-type">{{ item.title }}</a-row>
          <a-row class="hotmenuitem-content">
            <a-col v-bind="hotmenuitemLayout" v-for="(item2,index2) in item.content" :key="index2">
              <b>{{ index2+1 }}&nbsp;</b>
              <span>{{ item2 }}</span>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-row>-->
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import DoughnutChart from './doughnut-chart'
import mySteps from './my-steps'
import { Row, Col, Card } from 'ant-design-vue'
import { mapState } from 'vuex'
import { request } from '@/api'

export default {
  name: 'CustomerView',
  mixins: [mixinDevice, KeepAliveMixin],
  components: {
    DoughnutChart,
    mySteps,
    ARow: Row,
    ACol: Col,
    ACard: Card
  },
  data() {
    return {
      stepInfo: [
        // {
        //   title: '投诉',
        //   time: '09:20:22',
        //   icon: 'phone',
        //   stepStatus: 'Finished',
        //   content: { ringingTime: 5, talkingTime: '3分44秒' }
        // },
        // {
        //   title: '维修工单',
        //   time: '09:20:22',
        //   icon: 'phone',
        //   stepStatus: 'Finished',
        //   content: { ringingTime: 5, talkingTime: '3分44秒' }
        // },
        // {
        //   title: '咨询',
        //   time: '09:20:22',
        //   icon: 'phone',
        //   stepStatus: 'Finished',
        //   content: { ringingTime: 5, talkingTime: '3分44秒' }
        // },
        // {
        //   title: '咨询',
        //   time: '09:20:22',
        //   icon: 'phone',
        //   stepStatus: 'Finished',
        //   content: { ringingTime: 5, talkingTime: '3分44秒' }
        // }
      ],
      pieChartLayout: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24,
        xl: 12,
        xxl: 12
      },
      hotmenuitemLayout: {
        xs: 6,
        sm: 6,
        md: 6,
        lg: 6,
        xl: 6,
        xxl: 3
      },
      doughnutData1: [
        // {
        //   name: '电话',
        //   percent: 12
        // },
        // {
        //   name: '微信',
        //   percent: 5
        // },
        // {
        //   name: 'webchat',
        //   percent: 20
        // }
      ],
      doughnutData2: [
        {
          name: '业务员信息',
          percent: 14
        },
        {
          name: '客户信息查询',
          percent: 14
        },
        {
          name: '保单信息查询',
          percent: 11
        },
        {
          name: '投连查询',
          percent: 17
        }
      ],
      showChannelStatistics: false,
      showSummaryStatistics: false,
      customerId: null,
      // hotmenuitem: [
      //   { title: '微信菜单访问top5', content: ['个人中心', '待办事项', '如何使用'] },
      //   { title: '电话AVAYA菜单点击top5', content: ['一般咨询', '保险购买', '新年活动', '投诉'] }
      // ]
      api: {
        getRecords: {
          url: '/contact/records/customer-statistics/customer'
        },
        channelStatistics: {
          url: '/contact/records/channel-statistics/customer/{customerId}'
        },
        summaryStatistics: {
          url: '/contact/summary/statistics/customer/{customerId}'
        },
        getTimesById: {
          url: '/contact/phone-records'
        }
      }
    }
  },
  computed: {
    ...mapState({
      taskData: state => state.my.taskData.data
    })
  },
  methods: {
    getRecordsByCustomerId(customerId) {
      this.$nextTick(() => {
        this.$refs.mySteps.getRecordsByCustomerId({ customerId: customerId })
      })
    },
    getChannelStatistics() {
      request({
        ...this.api.channelStatistics,
        urlReplacements: [{ substr: '{customerId}', replacement: this.customerId }]
      }).then(res => {
        if (res.success) {
          this.showChannelStatistics = true
          this.doughnutData1 = []
          for (let key in res.data) {
            if (key === 'msgCount') {
              this.doughnutData1.push({ name: '短信', percent: res.data[key] })
            } else if (key === 'telCount') {
              this.doughnutData1.push({ name: '电话', percent: res.data[key] })
            } else if (key === 'wechatCount') {
              this.doughnutData1.push({ name: '微信', percent: res.data[key] })
            }
          }
        }
      })
    },
    getSummaryStatistics() {
      request({
        ...this.api.summaryStatistics,
        urlReplacements: [{ substr: '{customerId}', replacement: this.customerId }]
      }).then(res => {
        if (res.success) {
          this.showSummaryStatistics = true
          this.doughnutData2 = []
          for (let key in res.data) {
            if (key === 'successCount') {
              this.doughnutData2.push({ name: '成功', percent: res.data[key] })
            } else if (key === 'failCount') {
              this.doughnutData2.push({ name: '失败', percent: res.data[key] })
            } else if (key === 'appointmentCount') {
              this.doughnutData2.push({ name: '预约', percent: res.data[key] })
            }
          }
        }
      })
    }
  },
  beforeMount() {
    // 浅克隆
    for (let key in this.taskData) {
      if (key === 'customerId') {
        this.customerId = this.taskData[key]
      }
    }
    this.getRecordsByCustomerId(this.customerId)
    this.getChannelStatistics()
    this.getSummaryStatistics()
  }
}
</script>
<style lang="scss" scoped>
#customer-view {
  .step-view-container {
    padding: 10px;
    background: #fff;
    overflow-x: auto;
    position: relative;
    // height: 100px;
  }
  .doughnuts-container {
    margin-top: 10px;
    .ant-card {
      border: none;
    }
    #doughnuts1,
    #doughnuts2 {
      background: #fff;
      width: 100%;
    }
  }
  .hotmenuitem-container {
    margin-top: 10px;
    & > div {
      padding: 10px;
      background: #fff;
      .hotmenuitem-type {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        background: #eef2f4;
      }
      .hotmenuitem-content {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
  &.mobile {
    background: #fff;
    .step-view-container {
      .btn {
        left: 0;
        right: 0;
        transform: none;
        text-align: center;
        padding: 5px 5px;
        &.left-btn {
          top: 0;
          & > i {
            font-size: 1.5em;
            transform: scale(3.5, 1);
          }
        }
        &.right-btn {
          top: auto;
          bottom: 0;
          & > i {
            font-size: 1.5em;
            transform: scale(3.5, 1);
          }
        }
      }
      &::-webkit-scrollbar {
        display: block;
      }
    }
  }
}
</style>
