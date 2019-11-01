<template>
  <div class="footer-item">
    <a-icon type="picture" />
    <a-icon type="smile" />
    <a-icon type="message" />
    <a-icon type="folder" />
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
export default {
  name: 'CallChatFooterItem',
  components: {
    AIcon: Icon
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.footer-item {
  padding: 0 10px;
  border-bottom: 1px solid #e8e8e8;
  height: 40px;
  line-height: 42px;
  .anticon {
    cursor: pointer;
    margin-right: 8px;
    font-size: 20px;
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
