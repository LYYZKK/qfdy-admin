<template>
  <a-row id="contact-task">
    <a-col :span="24">
      <a-tabs
        defaultActiveKey="1"
        class="bg-white"
        :style="isDesktop()?`height:${viewHeight}px;`:''"
        @change="handleTabChange"
      >
        <a-tab-pane key="1">
          <div slot="tab" class="tab-container">
            <span>首拨</span>
            <a-badge :count="firstCallCount" v-if="firstCallCount" />
          </div>
          <first-call
            ref="firstCall"
            v-if="showFirstCall"
            @jumpTo="firstCallJump"
            @firstCallCount="getFirstCallCount"
            @appointmentCount="getAppointmentCount"
          />
          <call v-else :comeFrom="firstCallToCall" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <div slot="tab" class="tab-container">
            <span>预约</span>
            <!-- <span class="c-orange">5分钟</span> -->
            <a-badge v-if="appointmentCount" :count="appointmentCount" />
          </div>
          <appointment
            ref="appointment"
            v-if="showAppointment"
            @jumpTo="appointmentJump"
            @appointmentCount="getAppointmentCount"
          />
          <call v-else :comeFrom="appointmentToCall" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="今日订单">
          <today-order-manage />
        </a-tab-pane>
      </a-tabs>
    </a-col>
    <a-col v-if="!showFirstCall||!showAppointment" :span="3" class="backToList">
      <a-button
        v-if="!showFirstCall&&activeTab === '1'"
        type="link"
        @click="backToList"
        icon="rollback"
      >{{ activeTab === '1'?'返回首拨列表':'返回预约列表' }}</a-button>
      <a-button
        v-if="!showAppointment&&activeTab === '2'"
        type="link"
        @click="backToList"
        icon="rollback"
      >{{ activeTab === '1'?'返回首拨列表':'返回预约列表' }}</a-button>
    </a-col>
  </a-row>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import CommonMixin from '@/mixins/CommonMixin'
import { Tabs, Card, Row, Col, Button, Badge } from 'ant-design-vue'
import firstCall from './modules/contact-task/first-call'
import appointment from './modules/contact-task/appointment'
import todayOrderManage from './modules/contact-task/today-order-manage'
import call from '@/views/my/call'
import { mapState } from 'vuex'

export default {
  name: 'ContactTask',
  mixins: [mixinDevice, CommonMixin],
  components: {
    firstCall,
    appointment,
    call,
    todayOrderManage,
    ARow: Row,
    ACol: Col,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ACard: Card,
    AButton: Button,
    ABadge: Badge
  },
  computed: {
    ...mapState({
      firstCallComplete: state => state.my.firstCallComplete,
      appointmentComplete: state => state.my.appointmentComplete
    })
  },
  data() {
    return {
      comeFrom: {
        name: null,
        type: null,
        data: null
      },
      showFirstCall: true,
      showAppointment: true,
      activeTab: '1',
      firstCallCount: 0,
      appointmentCount: 0
    }
  },
  methods: {
    // 接收first-call组件传参，并传参至call组件中
    firstCallJump(val) {
      this.firstCallToCall = val
      this.showFirstCall = false
    },
    getFirstCallCount(count) {
      this.firstCallCount = count
    },
    getAppointmentCount(count) {
      this.appointmentCount = count
    },
    appointmentJump(val) {
      this.appointmentToCall = val
      this.showAppointment = false
    },
    handleTabChange(val) {
      this.activeTab = val
      this.$store.dispatch('setActiveTaskTabIndex', val)
    },
    backToList() {
      if (this.activeTab && this.activeTab === '1') {
        this.showFirstCall = true
      } else {
        this.showAppointment = true
      }
      // 刷新未读数
      this.$nextTick(() => {
        this.$refs.firstCall.getOrderList()
        this.$refs.firstCall.getOrderList(3)
      })
    }
  },
  watch: {
    firstCallComplete() {
      this.showFirstCall = true
    },
    appointmentComplete() {
      this.showAppointment = true
    }
  }
}
</script>

<style lang='scss' scoped>
#contact-task {
  position: relative;
  .ant-badge {
    z-index: 1;
  }
  .backToList {
    text-align: right;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .tab-container {
    display: flex;
    align-items: center;
    span {
      padding: 0 3px;
    }
  }
  ::v-deep .ant-tabs-top-content {
    height: calc(100% - 48px);
    .ant-tabs-tabpane {
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
