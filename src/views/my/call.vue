<template>
  <!-- 高度 = 可视区域高度 - 首拨/预约/今日订单所在 tab 栏高度 - 上边距 - 下边距 - 其它边框等高度  -->
  <a-row
    id="call"
    type="flex"
    :class="tablet ? 'pad' : device"
    :style="isDesktop() ? `height: ${viewHeight - 44 - 4 - 16 - 5}px;`:''"
  >
    <a-col :class="['call-chat', $store.state.my.callChatOpened ? 'open' : 'close']">
      <call-chat :contactTaskMenuTrigger="showMenuTrigger" />
    </a-col>
    <a-col :class="['call-tabs', $store.state.my.callChatOpened ? 'open' : 'close']">
      <call-tabs />
    </a-col>
  </a-row>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import CommonMixin from '@/mixins/CommonMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import callChat from './modules/call-chat'
import callTabs from './modules/call-tabs'
import { Row, Col } from 'ant-design-vue'
import { mapState } from 'vuex'
export default {
  name: 'IncomingCall',
  props: {
    comeFrom: {
      type: Object,
      default: () => {
        return {
          name: null, // 从拨打页面跳转 首拨：'firstCall'  预约：'appointment'
          type: null, // 联系类型 电话 'call' 微信 'wechat'
          data: null // 任务的信息
        }
      }
    }
  },
  mixins: [mixinDevice, CommonMixin, KeepAliveMixin],
  components: {
    callChat,
    callTabs,
    ARow: Row,
    ACol: Col
  },
  computed: {
    ...mapState({
      firstCallComplete: state => state.my.firstCallComplete
    })
  },
  data() {
    return {
      showMenuTrigger: false,
      // 呼入客户信息
      callCostomerMessage: {
        id: 1,
        birthday: '',
        customerAddresses: [],
        customerContacts: [],
        height: '',
        weight: '',
        idNo: '',
        isMarried: 0,
        name: '',
        sex: '',
        nation: '',
        nativePlace: ''
      }
    }
  },
  beforeMount() {
    this.$store.dispatch('setTaskData', this.comeFrom)
  }
}
</script>
<style lang="scss" scoped>
#call {
  flex-flow: row nowrap;
  .call-chat,
  .call-tabs {
    height: 100%;
  }
  .call-chat.open {
    flex: 1;
  }
  .call-tabs.open {
    width: 50%;
  }
  .call-chat.close {
    flex: none;
    width: 200px;
  }
  .call-tabs.close {
    flex: none;
    width: calc(100% - 200px);
  }
  &.mobile,
  &.pad {
    flex-flow: column;
    flex: none;
    .call-tabs.open {
      width: 100%;
    }
  }
}
</style>
