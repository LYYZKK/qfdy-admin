<template>
  <a-row id="contact-task">
    <a-col :span="24">
      <a-tabs
        defaultActiveKey="1"
        class="bg-white"
        :style="isDesktop()?`height:${viewHeight}px;`:''"
        @change="handleTabChange"
      >
        <a-tab-pane key="1" tab="按时间查询">
          <record-manage-time />
        </a-tab-pane>
        <a-tab-pane key="2" tab="按客户查询">
          <record-manage-customer />
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import CommonMixin from '@/mixins/CommonMixin'
import recordManageTime from './modules/record-manage/record-manage-time'
import recordManageCustomer from './modules/record-manage/record-manage-customer'
import { Tabs, Row, Col } from 'ant-design-vue'
import { mapState } from 'vuex'

export default {
  name: 'ContactTask',
  mixins: [mixinDevice, CommonMixin],
  components: {
    recordManageTime,
    recordManageCustomer,
    ARow: Row,
    ACol: Col,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane
  },
  computed: {
    ...mapState({})
  },
  data() {
    return {}
  },
  methods: {
    handleTabChange(val) {
      this.activeTab = val
    }
  },
  watch: {}
}
</script>

<style lang='scss' scoped>
#contact-task {
  .tab-container {
    display: flex;
    align-items: center;
    span {
      padding: 0 3px;
    }
  }
  ::v-deep .ant-tabs-top-content {
    height: calc(100% - 64px);
    .ant-tabs-tabpane {
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
