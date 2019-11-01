<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <!-- 客服信息 -->
      <a-tab-pane tab="客服信息" key="1">
        <a-row class="content">
          <a-col>
            <img
              src="https://chat60.live800.com/live800/chatClient/refactor/v6.0.1/dist/images/6_avatar@2x-9c77b40b41.png"
              class="img"
            />
          </a-col>
          <a-col class="margin_10">客服代表睿睿</a-col>
          <a-col>所在部门：客户服务中心</a-col>
          <a-col class="margin_10">固定电话：xxxxxxxxxxx</a-col>
          <a-col>联系地址：深圳市南山区尚美科技大厦1303A</a-col>
        </a-row>
      </a-tab-pane>
      <!-- 常见问题 -->
      <a-tab-pane tab="常见问题" key="2" forceRender>
        <a-collapse accordion>
          <a-collapse-panel header="问题1" key="1">
            <p>ghhjhjjjkkk</p>
          </a-collapse-panel>
          <a-collapse-panel header="问题2" key="2" :disabled="false">
            <p>ghhjhjjjkkk</p>
          </a-collapse-panel>
          <a-collapse-panel header="问题3" key="3">
            <p>ghhjhjjjkkk</p>
          </a-collapse-panel>
        </a-collapse>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { Tabs, Row, Col, Collapse } from 'ant-design-vue'
export default {
  name: 'Introduce',
  components: {
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    ACol: Col,
    ARow: Row,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-collapse {
  background-color: #fff;
  border: none;
}
::v-deep .ant-collapse-header {
  padding: 5px 0 5px 40px;
}
::v-deep .ant-collapse-content-box {
  padding: 10px;
}
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
</style>


