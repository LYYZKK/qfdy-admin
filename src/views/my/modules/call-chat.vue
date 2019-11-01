<template>
  <a-layout id="call-chat" :class="device">
    <template>
      <a-drawer
        v-if="device === 'mobile'&&!tablet"
        wrapClassName="call-chat-sider"
        placement="right"
        @close="() => this.collapsed = false"
        :closable="false"
        :visible="collapsed"
        width="200px"
      >
        <call-chat-menu @contentType="getContentType" />
      </a-drawer>
    </template>
    <a-layout-sider
      theme="light"
      :trigger="null"
      :class="collapsed ? 'open' : 'close'"
      v-if="device !== 'mobile' || tablet"
    >
      <call-chat-menu @contentType="getContentType" :showMenuTrigger="showMenuTrigger" />
    </a-layout-sider>
    <a-layout
      :class="['call-chat-content-container', $store.state.my.callChatOpened ? 'open' : 'close']"
    >
      <call-chat-section v-if="contentType==='wechat'" @toggle="toggle" />
      <call-phone-section v-if="contentType==='phone'" @toggle="toggle" />
    </a-layout>
  </a-layout>
</template>

<script>
import callChatMenu from '../components/call/call-chat-menu'
import callChatSection from '../components/call/call-chat-section/call-chat-section'
import callPhoneSection from '../components/call/call-phone-section'
import { mixinDevice } from '@/utils/mixin.js'
import { triggerWindowResizeEvent } from '@/utils/util'
import { Layout, Drawer } from 'ant-design-vue'
export default {
  name: 'CallChat',
  mixins: [mixinDevice],
  props: {
    contactTaskMenuTrigger: {
      type: Boolean,
      default: () => null
    }
  },
  components: {
    callChatMenu,
    callChatSection,
    callPhoneSection,
    ALayout: Layout,
    ALayoutSider: Layout.Sider,
    ADrawer: Drawer
  },
  data() {
    return {
      menuItems: [
        { type: 'wechat', content: '一般咨询', name: '微信名称', time: '9:30' },
        { type: 'phone', content: '一般咨询', phoneNumber: '13611111234', time: '9:30' }
      ],
      showMenuTrigger: false,
      contentType: null,
      collapsed: false
    }
  },
  methods: {
    // 接收menu传参，控制聊天框显示类型
    getContentType(val) {
      this.contentType = val
    },
    // 手机端控制会话区域展开与关闭
    toggle() {
      this.collapsed = !this.collapsed
      triggerWindowResizeEvent()
    }
  },
  beforeMount() {
    // 由于在手机端菜单显示为抽屉第一次进入页面菜单并不展示无法向此组件传值，到时需删除menu的传值再此请求菜单数据向menu传值
    this.contentType = this.menuItems[0].type
    // showMenuTrigger有值则是从拨打页面跳转，显示menu的trigger按钮
    this.showMenuTrigger = this.contactTaskMenuTrigger ? true : false
  }
}
</script>

<style lang='scss' scoped>
#call-chat {
  height: 100%;
  .fr {
    float: right !important;
  }
  .fl {
    float: left !important;
  }
  .inline-block {
    display: inline-block;
  }
  .ant-layout-sider {
    overflow-x: hidden;
    border-right: 1px solid #e8e8e8;
  }
  .call-chat-content-container {
    height: 100%;
    background: #fff;
    border-right: 1px solid #e8e8e8;
    // transition: flex .1s;
    &.open {
      flex: 1;
    }
    &.close {
      flex: 0;
    }
    .ant-layout-content {
      height: 100%;
    }
  }
  &.mobile {
    height: auto;
    .call-chat-content-container {
      .ant-layout-header {
        padding: 10px 8px;
        font-size: 12px;
        .header-content {
          margin-left: 8px;
        }
      }
    }
    .ant-layout-content {
      height: 344px;
      .tip {
        transform: translate(-50%, 150px);
      }
    }
    .ant-layout-footer {
      border-bottom: 1px solid #e8e8e8;
    }
  }
}
</style>
<style lang='scss'>
/* 由于抽屉的位置为项目外部插入，只能使用全局样式
     针对呼入菜单栏位置和高度调整 */
.call-chat-sider {
  .ant-drawer-content-wrapper {
    top: 69px;
    height: calc(100% - 69px) !important;
    .ant-drawer-body {
      padding: 0;
    }
  }
}
</style>
