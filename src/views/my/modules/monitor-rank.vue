<template>
  <div>
    <a-row class="top">
      <a-col v-for="(item,index) in 10" :key="index" :span="12" class="topitem">
        <span
          class="circle"
          :style="index === 0 ? 'background: #f85437' : (index === 1 ? 'background: #f88a37;' : (index === 2 ? 'background: #fad54a;' : 'background: #18d5ff;'))"
        >{{ index+1 }}</span>
        <span>宋丹丹</span>
        <span class="m-l-30">00:52:00</span>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { Row, Col } from 'ant-design-vue'
export default {
  components: {
    ARow: Row,
    ACol: Col
  },
  name: 'Rank'
}
</script>

<style lang="less" scoped>
.circle {
  font-size: 12px;
  margin-right: 10px;
  width: 18px;
  height: 18px;
  display: inline-block;
  border-radius: 50%;
  background: #eee;
  line-height: 18px;
  text-align: center;
  color: #fff;
}
.colorful1 {
  background: #3798f8;
}
.colorful2 {
  background: #59cb74;
}
.colorful3 {
  background: #fad54a;
}
.colorful4 {
  background: #4dcccb;
}
.top {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 135px;
  // margin-top: 30px;
  .topitem {
    font-size: 12px;
    width: 50%;
    margin-bottom: 8px;
  }
}
</style>

