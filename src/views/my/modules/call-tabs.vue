<template>
  <a-tabs defaultActiveKey="1" id="call-tabs" :class="device">
    <a-tab-pane tab="客户基本信息" key="1">
      <customer-card />
    </a-tab-pane>
    <a-tab-pane tab="客户喜好" key="2">
      <customer-favorite />
    </a-tab-pane>
    <a-tab-pane tab="接触记录" key="3">
      <customer-view />
    </a-tab-pane>
    <a-tab-pane tab="新建订单" key="4">
      <order-info />
    </a-tab-pane>
    <a-tab-pane tab="历史订单" key="5">
      <order-manage :customerId="customerId" />
    </a-tab-pane>
    <a-tab-pane tab="话后小结" key="6">
      <ring-off-summary />
    </a-tab-pane>
    <!-- <a-tab-pane tab="话术库" key="5">
      <knowledge-collection />
    </a-tab-pane>-->
  </a-tabs>
</template>

<script>
import knowledgeCollection from '../components/call/knowledge-collection/knowledge-collection'
import customerView from '../components/call/customer-view'
import customerCard from '../components/call/customer-card'
import customerFavorite from '../components/call/customer-favorite'
import orderInfo from '../components/call/order-info'
import orderManage from '../order-manage'
import ringOffSummary from '../components/call/ring-off-summary'
import mySteps from '../components/call/my-steps'
import { mixinDevice } from '@/utils/mixin.js'
import { Tabs } from 'ant-design-vue'
import { mapState } from 'vuex'
export default {
  name: 'CallTabs',
  mixins: [mixinDevice],
  components: {
    knowledgeCollection,
    orderManage,
    customerView,
    customerCard,
    customerFavorite,
    orderInfo,
    ringOffSummary,
    mySteps,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane
  },
  computed: {
    ...mapState({
      customerId: state => state.my.taskData.data.customerId
    })
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
#call-tabs {
  height: 100%;
  background: #fff;
  ::v-deep .ant-tabs-content {
    height: calc(100% - 47px);
  }
  .ant-tabs-tabpane {
    height: 100%;
  }
  .fr {
    float: right !important;
  }
  .fl {
    float: left !important;
  }
  .inline-block {
    display: inline-block;
  }
  .ant-tabs-nav-container {
    width: 100%;
    background: #fff;
  }
  ::v-deep .ant-tabs-bar {
    margin: 0;
    .ant-tabs-tab {
      font-weight: bold;
    }
  }
  .ant-tabs-tabpane {
    background: #f0f2f5;
    box-sizing: border-box;
    padding: 10px;
  }
  &.mobile {
    .ant-tabs-tabpane {
      padding: 0;
    }
  }
}
</style>
