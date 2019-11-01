<template>
  <div class="call-chat-footer">
    <a-row>
      <call-chat-footer-item />
    </a-row>
    <a-row class="textarea-container">
      <a-textarea rows="7" />
    </a-row>
  </div>
</template>

<script>
import callChatFooterItem from './call-chat-footer-item'
import { Row, Input } from 'ant-design-vue'
export default {
  name: 'CallChatFooter',
  components: {
    callChatFooterItem, // 聊天框工具栏
    ARow: Row,
    ATextarea: Input.TextArea
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.call-chat-footer {
  height: 100%;
  .textarea-container {
    height: calc(100% - 40px);
    textarea.ant-input {
      border: none;
      resize: none;
      height: 100%;
      &:focus {
        border-color: none;
        outline: 0;
        box-shadow: none;
        border-right-width: 0 !important;
      }
    }
  }
}
</style>
