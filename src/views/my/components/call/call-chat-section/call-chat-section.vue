<template>
  <div id="call-chat-section" :class="tablet?'pad':device">
    <a-layout-header>
      <a-row>
        <a-col v-if="device==='mobile'&&!tablet" class="call-trigger-container inline-block">
          <a-icon type="bars" @click.native="toggle"></a-icon>
        </a-col>
        <a-col class="header-content inline-block" v-bind="{lg:20,xl:22,xxl:22}">
          <a-row :gutter="8">
            <a-col class="inline-block">
              <b>小红帽</b>
            </a-col>
            <a-col class="inline-block">
              <span>来源：</span>
              <span>公众号名</span>
            </a-col>
            <a-col class="inline-block">
              <span>服务入口：</span>
              <span>咨询</span>
            </a-col>
          </a-row>
          <a-row :gutter="8">
            <a-col class="inline-block">
              <span>开始时间：</span>
              <span>13:24:01</span>
            </a-col>
            <a-col class="inline-block">
              <span>结束时间：</span>
              <span>13:24:01</span>
            </a-col>
            <a-col class="inline-block">
              <span>会话时长：</span>
              <span>13:24:01</span>
            </a-col>
          </a-row>
        </a-col>
        <a-col
          v-if="device!=='mobile' && $store.state.my.callChatOpened"
          v-bind="{lg:4,xl:2,xxl:2}"
        >
          <a-icon
            class="call-section-trigger"
            type="menu-fold"
            title="收起聊天区"
            @click.native="closeChatSection()"
          ></a-icon>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content>
      <call-chat-content />
    </a-layout-content>
    <a-layout-footer>
      <call-chat-footer />
    </a-layout-footer>
    <a-card class="tip">
      <p>我们的商品包含XXXX版本和XXXX版本</p>
    </a-card>
  </div>
</template>

<script>
import callChatContent from './call-chat-content'
import callChatFooter from './call-chat-footer'
import { mixinDevice } from '@/utils/mixin.js'
import { triggerWindowResizeEvent } from '@/utils/util'
import { Layout, Row, Col, Icon, Card } from 'ant-design-vue'
export default {
  name: 'CallChatSection',
  mixins: [mixinDevice],
  components: {
    callChatContent,
    callChatFooter,
    ALayout: Layout,
    ALayoutHeader: Layout.Header,
    ALayoutContent: Layout.Content,
    ALayoutFooter: Layout.Footer,
    ARow: Row,
    ACol: Col,
    AIcon: Icon,
    ACard: Card
  },
  data() {
    return {
      siderStatus: null,
      contentType: null
    }
  },
  methods: {
    // 手机端控制会话区域展开与关闭
    toggle() {
      this.$emit('toggle', '')
    },
    closeChatSection() {
      this.$store.dispatch('setCallChatStatus', false)
      triggerWindowResizeEvent()
    }
  }
}
</script>

<style lang='scss' scoped>
#call-chat-section {
  height: 100%;
  max-height: 100%;
  background: #fff;
  position: relative;
  .fr {
    float: right !important;
  }
  .fl {
    float: left !important;
  }
  .inline-block {
    display: inline-block;
  }
  .ant-layout-header {
    background: #fff;
    padding: 10px;
    border-bottom: 1px solid #e8e8e8;
    height: auto;
    line-height: normal;
    .call-section-trigger {
      cursor: pointer;
      padding: 10px;
      font-size: 20px;
      &:hover {
        color: #57afff;
      }
    }
    // & > div.ant-row {
    //   display: flex;
    // }
    div.ant-row:first-child {
      line-height: normal;
      // display: flex;
      // flex-wrap: nowrap;
      span:first-child {
        color: #cdcdcd;
      }
    }
    div.ant-row:nth-child(2) {
      line-height: normal;
      span {
        color: #cdcdcd;
      }
    }
  }
  .ant-layout-sider {
    border-right: 1px solid #e8e8e8;
  }
  .ant-layout-content {
    padding: 10px;
    height: calc(100% - 231px);
    min-height: 260px;
    overflow-y: auto;
    background: #fff;
    position: relative;
  }
  .ant-layout-footer {
    border-top: 1px solid #e8e8e8;
    padding: 0;
    box-sizing: border-box;
    background: #fff;
    height: 170px;
  }
  .tip {
    position: absolute;
    width: 90%;
    left: 50%;
    transform: translate(-50%, -300px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    border-color: rgba(0, 0, 0, 0.09);
  }
  &.pad {
    .ant-layout-content {
      height: 500px;
    }
  }
  &.mobile {
    border-right: 1px solid #e8e8e8;
    .ant-layout-header {
      padding: 10px 8px;
      font-size: 12px;
      .call-trigger-container {
        vertical-align: top;
      }
      .header-content {
        margin-left: 8px;
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
