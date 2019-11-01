<template>
  <div>
    <a-row type="flex" justify="end" :gutter="10" class="title">
      <a-col>
        <a-badge status="default" />
        <span class="marginLeft">未登录</span>
      </a-col>
      <a-col>
        <a-badge status="processing" />
        <span class="marginLeft">未接听</span>
      </a-col>
      <a-col>
        <a-badge status="warning" />
        <span class="marginLeft">就绪</span>
      </a-col>
      <a-col>
        <a-badge status="success" />
        <span class="marginLeft">忙碌</span>
      </a-col>
      <a-col>
        <a-badge status="error" />
        <span class="marginLeft">话后</span>
      </a-col>
    </a-row>
    <a-row :class="device==='mobile'?'mobile_monitor':'monitor'">
      <a-col v-for="(item,index) in 20" :key="index" class="single">
        <div class="tip" v-if="index===6||index===13">
          <span class="text">警告</span>
        </div>
        <div class="left">
          <a-avatar :size="35" icon="user" />
          <a-badge
            :status="index===0||index===5||index===3?'success':index===2||index===6||index===8?'processing':index===4||index===15?'error':index>10?'warning':'default'"
          />
        </div>
        <div class="right">
          <span>分机：10033</span>
          <span>姓名：lyy</span>
          <span>工号：10033</span>
          <span class="icon">
            <a-icon type="phone" />
            <a-icon type="wechat" />
            <a-icon type="message" />
          </span>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { mixinDevice } from '@/utils/mixin.js'
import { Row, Col, Badge, Avatar, Icon } from 'ant-design-vue'
export default {
  components: {
    ARow: Row,
    ACol: Col,
    ABadge: Badge,
    AAvatar: Avatar,
    AIcon: Icon
  },
  name: 'Status',
  mixins: [mixinDevice]
}
</script>
<style lang="less" scoped>
.title {
  margin: 10px 0;
  .marginLeft {
    margin-left: 10px;
  }
}
.monitor {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 20px;
}
.single {
  display: flex;
  padding: 10px;
  box-shadow: 0 0 3px 0px #eee;
  position: relative;
  margin: 3px;
  .tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-width: 0 0 22px 50px;
    border-color: transparent red;
    border-style: solid;
    color: #000;
    font-size: 11px;
    transform: scale(45deg);
    .text {
      color: #fff;
      position: absolute;
      width: 50px;
      height: 22px;
      top: 0px;
      left: -48px;
    }
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding-right: 10px;
    border-right: 1px solid #eee;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 10px;
    span {
      font-size: 12px;
    }
    .icon {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
.mobile_monitor {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 20px;
}
</style>


