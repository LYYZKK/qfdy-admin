<template>
  <a-layout id="kb" :class="device">
    <a-layout-sider theme="light">
      <knowledge-collection-sider />
    </a-layout-sider>
    <a-layout-content id="kb-content">
      <a-row class="search-container">
        <a-input-search
          placeholder="全文搜索"
          @search="handleSearch"
          enterButton="搜索"
          class="kb-search"
        />
      </a-row>
      <a-divider />
      <a-row>
        <div class="kb-item">
          <header>
            <div class="fl">
              <b>我将如何自定义前端页面？</b>
            </div>
            <div
              class="collection"
              v-if="collectionIsChecked"
              @click="clickCollection(collectionIsChecked)"
            >
              <a-icon type="star" theme="filled" />
              <b>取消</b>
            </div>
            <div class="collection" v-else @click="clickCollection(collectionIsChecked)">
              <a-icon type="star" />
              <b>收藏</b>
            </div>
          </header>
          <section class="m-b-10">阿什兰卡德加阿什兰卡德加阿斯利康的骄傲了开始简单拉克丝建档立卡四季豆期间搜ID就骄傲了开始简单拉克丝建档立卡四季豆期间搜ID就</section>
          <footer>
            <div>
              <span>标签：</span>
              <span>商品版本</span>
            </div>
            <div>模板设置</div>
            <div>
              <span>点击：</span>
              <span>3</span>
            </div>
          </footer>
        </div>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import KnowledgeCollectionSider from './knowledge-collection-sider'
import { Layout, Row, Input, Divider, Icon } from 'ant-design-vue'
export default {
  name: 'KnowledgeCollection',
  mixins: [mixinDevice],
  components: {
    KnowledgeCollectionSider,
    ALayout: Layout,
    ALayoutSider: Layout.Sider,
    ALayoutContent: Layout.Content,
    ARow: Row,
    AInputSearch: Input.Search,
    ADivider: Divider,
    AIcon: Icon
  },
  data() {
    return {
      collectionIsChecked: false
    }
  },
  methods: {
    handleSearch() {
      console.log('全文搜索')
    },
    // 收藏 取消
    clickCollection(collectionIsChecked) {
      this.collectionIsChecked = !collectionIsChecked
    }
  }
}
</script>

<style lang='scss' scoped>
#kb {
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
    height: 100%;
    padding: 5px 10px;
    border-right: 1px solid #e8e8e8;
  }
  #kb-content.ant-layout-content {
    padding: 10px;
    height: 100%;
    overflow-y: auto;
    background: #fff;
    .search-container {
      display: flex;
      justify-content: center;
      .kb-search {
        width: 80%;
        margin-top: 10px 0 5px 0;
      }
    }
    .kb-item {
      header {
        overflow: hidden;
        margin-bottom: 10px;
      }
    }
    .collection {
      cursor: pointer;
      color: #009dde;
      float: right;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      b {
        padding-left: 5px;
      }
    }
  }
  footer {
    div {
      display: inline-block;
      color: #cdcdcd;
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  &.mobile {
    padding: 0;
    flex-direction: column;
    .ant-layout-sider {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      border-bottom: 1px solid #e8e8e8;
      border-right: none;
      // height:calc(100vh - 59px);
      // height:100%;
    }
    // #kb-content{
    //   height:344px;
    // }
  }
}
</style>
