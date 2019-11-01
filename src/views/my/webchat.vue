<template>
  <div class="wechat" :style="`height:${viewHeight}px;`">
    <div class="top" v-if="device==='mobile'&&!tablet">
      Wise CRM 呼叫中心运营平台
      <a-icon
        type="menu-unfold"
        class="toggle"
        v-if="device==='mobile'&&!tablet"
        @click="showDrawer()"
      ></a-icon>
    </div>
    <a-row class="main">
      <!-- 聊天部分 -->
      <a-col :span="device==='mobile'&&!tablet?24:12" class="left">
        <chat-detail></chat-detail>
      </a-col>
      <!-- 详情介绍抽屉 -->
      <a-drawer placement="right" :closable="true" @close="onClose" :visible="visible" width="100%">
        <introduce></introduce>
      </a-drawer>
      <!-- 详情介绍 -->
      <a-col :span="12" class="introduce" v-if="device==='desktop'||(tablet&&device==='mobile')">
        <introduce></introduce>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import ComminMixin from '@/mixins/CommonMixin'
import { mixinDevice } from '@/utils/mixin.js'
import { formatDate } from '@/utils/util.js'
import ChatDetail from './modules/chat-detail'
import introduce from './modules/introduce'
import { Col, Row, Icon, Drawer } from 'ant-design-vue'
export default {
  name: 'WebChat',
  mixins: [mixinDevice, ComminMixin],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    formatDate: formatDate,
    send() {
      this.chatData.push(this.singleData)
      this.singleData = { send: '' }
      setTimeout(() => {
        this.scrollContainer = document.querySelector('.detail')
        const el = this.scrollContainer
        el.scrollTop = el.scrollHeight - el.clientHeight
      }, 100)
    }
  },
  components: {
    ADrawer: Drawer,
    AIcon: Icon,
    ACol: Col,
    ARow: Row,
    introduce,
    ChatDetail
  }
}
</script>
<style lang="less">
// 在线客服抽屉部分样式无法在组件内覆盖原有样式，所以在全局中添加样式修改
.ant-drawer-body {
  padding: 0;
}
.ant-collapse {
  background-color: #fff;
  border: none;
}
.ant-collapse-header {
  padding: 5px 0 5px 40px;
}
.ant-collapse-content-box {
  padding: 10px;
}
</style>

<style lang="less" scoped>
::v-deep .ant-layout-header {
  background: #fff;
}
::v-deep .ant-layout-content {
  background: #fff;
}
::v-deep .ant-layout-sider {
  background: #fff;
}

.wechat {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  background: #fff;
  .top {
    // position: fixed;
    // top: 0;
    // left: 0;
    width: 100%;
    height: 60px;
    z-index: 999;
    background: #1890ff;
    color: #fff;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
    .toggle {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
  .main {
    height: 100%;
    position: relative;
    .left {
      height: 100%;
    }
  }
  .introduce {
    height: 100%;
    border-left: 1px solid #eee;
    .content {
      text-align: center;
      .img {
        display: inline-block;
        width: 150px;
      }
      .margin_10 {
        margin: 10px 0;
      }
    }
  }
}
</style>


