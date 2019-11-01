<template>
  <div>
    <a-row type="flex" align="middle">
      <a-avatar class="avatar" :size="40" icon="wechat" />
      <div class="font12 left chat-container">123</div>
      <!-- <a-icon type="loading" class="m-l-5" />
      <a-icon type="exclamation-circle" theme="filled" class="m-l-5 c-red" /> -->
    </a-row>
    <div class="m-l-50 c-g9">2019-9-3 9:54:00</div>
    <a-row type="flex" align="middle" class="row-reverse">
      <a-avatar class="avatar" :size="40" icon="wechat" />
      <div class="font12 right chat-container">123</div>
      <!-- <a-icon type="loading" class="m-r-5" />
      <a-icon type="exclamation-circle" theme="filled" class="m-r-5 c-red" /> -->
    </a-row>
    <div class="fr m-r-50 c-g9">2019-9-3 9:55:00</div>
  </div>
</template>

<script>
import { Row, Avatar, Icon } from 'ant-design-vue'
export default {
  name: 'CallChatContent',
  components: {
    ARow: Row,
    AAvatar: Avatar,
    AIcon: Icon
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.fr {
  float: right !important;
}
.fl {
  float: left !important;
}
.inline-block {
  display: inline-block;
}
.ant-layout-content {
  padding: 10px !important;
  height: 500px !important;
}
.left,
.right {
  min-height: 40px;
  position: relative;
  display: table;
}
.left > p,
.right > p {
  /*使内容居中*/
  display: table-cell;
  vertical-align: middle;
  padding: 0 10px;
}
.left:before,
.right:after {
  /*用伪类写出小三角形*/
  content: '';
  display: block;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  position: absolute;
  top: 7px;
}
.left:before {
  border-right: 8px solid #eaf1f5;
  left: -16px;
}
.right:after {
  border-left: 8px solid #57afff;
  right: -16px;
}
.chat-record-container {
  height: 78vh;
  overflow-y: auto;
}
.row-reverse {
  flex-direction: row-reverse;
}
.chat-container {
  max-width: 290px;
  text-align: left;
  word-break: break-all;
  color: #020202;
  padding: 7px 10px;
  min-height: 30px;
  background-color: #fff;
  border-radius: 2px;
  border: 1px solid #57afff;
  &.left {
    background-color: #eaf1f5;
    border: 1px solid #eaf1f5;
    margin-left: 10px;
    margin-top: 3px;
  }
  &.right {
    background: #57afff;
    color: #fff;
    margin-right: 10px;
    margin-top: 3px;
  }
}
.m-r-50,
.m-l-50 {
  font-size: 12px;
}
</style>
