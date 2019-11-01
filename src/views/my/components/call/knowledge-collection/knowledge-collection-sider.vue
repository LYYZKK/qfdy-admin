<template>
  <div id="kb-sider">
    <a-tree showLine :defaultExpandedKeys="['0-0-0']" @select="onSelect">
      <a-tree-node key="0-0">
        <span slot="title" style="color: #1890ff">parent 1</span>
        <a-tree-node title="parent 1-0" key="0-0-0">
          <a-tree-node title="leaf" key="0-0-0-0" />
          <a-tree-node title="leaf" key="0-0-0-1" />
          <a-tree-node title="leaf" key="0-0-0-2" />
        </a-tree-node>
        <a-tree-node title="parent 1-1" key="0-0-1">
          <a-tree-node title="leaf" key="0-0-1-0" />
        </a-tree-node>
        <a-tree-node title="parent 1-2" key="0-0-2">
          <a-tree-node title="leaf" key="0-0-2-0" />
          <a-tree-node title="leaf" key="0-0-2-1" />
        </a-tree-node>
      </a-tree-node>
    </a-tree>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { Tree } from 'ant-design-vue'
export default {
  name: 'KnowledgeCollectionSider',
  mixins: [mixinDevice],
  components: {
    ATree: Tree,
    ATreeNode: Tree.TreeNode
  },
  data() {
    return {
      // collectionIsChecked: false
    }
  },
  methods: {
    onSelect() {
      if (this.device === 'mobile') this.scrollToContent()
    },
    scrollToContent() {
      // document.getElementById('kb-content').scrollIntoView()
      document.getElementById('kb-content').scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style lang='scss' scoped>
#kb-sider {
  .fr {
    float: right !important;
  }
  .fl {
    float: left !important;
  }
  .inline-block {
    display: inline-block;
  }
}
</style>
