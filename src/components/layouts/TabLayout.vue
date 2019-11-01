<template>
  <global-layout @dynamicRouterShow="dynamicRouterShow">
    <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect" />
    <a-tabs
      @contextmenu.native="e => onContextmenu(e)"
      v-if="multipage"
      :active-key="activePage"
      :class="['tab-layout-tabs', fixedHeader ? 'ant-tab-fixedTab' : null, 'h-52' ]"
      :hide-add="true"
      type="editable-card"
      @change="changePage"
      @edit="editPage"
    >
      <a-tab-pane
        :id="page.fullPath"
        :key="page.fullPath"
        :closable="page.fullPath !== indexPagePath"
        v-for="page in pageList"
      >
        <span slot="tab" :pagekey="page.fullPath">{{ page.meta.title }}</span>
      </a-tab-pane>
    </a-tabs>
    <div
      :style="fixedHeader ? (device === 'mobile' ? '' : (multipage ? 'margin: 64px 12px 0;' : 'margin: 12px 12px 0;')) : 'margin: 12px 12px 0;'"
    >
      <transition name="page-toggle">
        <router-view />
      </transition>
    </div>
  </global-layout>
</template>

<script>
import GlobalLayout from '@/components/page/GlobalLayout'
import Contextmenu from '@/components/menu/Contextmenu'
import { mixin, mixinDevice } from '@/utils/mixin.js'
import { Tabs } from 'ant-design-vue'
import { mapState } from 'vuex'

const indexPagePath = '/dashboard/analysis'

export default {
  name: 'TabLayout',
  components: {
    GlobalLayout,
    Contextmenu,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      menuVisible: false,
      menuItemList: [
        { key: '1', icon: 'arrow-left', text: '关闭左侧' },
        { key: '2', icon: 'arrow-right', text: '关闭右侧' },
        { key: '3', icon: 'close', text: '关闭其它' }
      ],
      indexPagePath
    }
  },
  computed: {
    ...mapState({
      pageList: state => state.tab.pageList,
      linkList: state => state.tab.linkList,
      activePage: state => state.tab.activePage,
      activeRouter: state => state.tab.activeRouter
    }),
    multipage() {
      // 判断如果是手机模式，自动切换为单页面模式
      if (this.isMobile()) {
        return false
      } else {
        return this.$store.state.app.multipage
      }
    }
  },
  created() {
    this.$store.dispatch('InitTabs', { route: this.$route, indexPagePath })
  },
  watch: {
    $route: function(newRoute) {
      this.$store.dispatch('ChangeRoute', { multipage: this.multipage, newRoute })
    },
    multipage: function(newVal) {
      if (!newVal) {
        this.$store.dispatch('SwitchMultipage', { route: this.$route })
      }
    }
  },
  methods: {
    changePage(path) {
      this.$store.dispatch('ActiveTab', { path })

      this.$router.push(Object.assign({}, this.activeRouter))
    },
    editPage(path, action) {
      this[action](path)
    },
    remove(path) {
      if (path == indexPagePath) {
        this.$message.warning('首页不能关闭!')
        return
      }
      if (this.pageList.length === 1) {
        this.$message.warning('这是最后一页，不能再关闭了')
        return
      }
      this.$store.dispatch('CloseAndActiveOtherTab', { path })
      this.$router.push(Object.assign({}, this.activeRouter))
    },
    onContextmenu(e) {
      const pagekey = this.getPageKey(e.target)
      if (pagekey !== null) {
        e.preventDefault()
        this.menuVisible = true
      }
    },
    getPageKey(target, depth) {
      depth = depth || 0
      if (depth > 2) {
        return null
      }
      let pageKey = target.getAttribute('pagekey')
      pageKey =
        pageKey || (target.previousElementSibling ? target.previousElementSibling.getAttribute('pagekey') : null)
      return pageKey || (target.firstElementChild ? this.getPageKey(target.firstElementChild, ++depth) : null)
    },
    onMenuSelect(key, target) {
      let pageKey = this.getPageKey(target)
      switch (key) {
        case '1':
          this.closeLeft(pageKey)
          break
        case '2':
          this.closeRight(pageKey)
          break
        case '3':
          this.closeOthers(pageKey)
          break
        default:
          break
      }
    },
    closeOthers(path) {
      this.$store.dispatch('CloseOtherTabs', { path, indexPagePath })
    },
    closeLeft(path) {
      if (path == indexPagePath) {
        return
      }
      this.$store.dispatch('CloseLeftTabs', { path, indexPagePath })
    },
    closeRight(path) {
      this.$store.dispatch('CloseRightTabs', { path, indexPagePath })
    },
    dynamicRouterShow(path, title) {
      this.$store.dispatch('RenderTabsForDynamicRouters', { path, title })
    }
  }
}
</script>

<style lang="scss">
/*
  * The following styles are auto-applied to elements with
  * transition="page-transition" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the page transition by editing
  * these styles.
  */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/*美化弹出Tab样式*/
.ant-tabs-nav-container {
  margin-top: 4px;
}

/* 修改 ant-tabs 样式 */
.tab-layout-tabs.ant-tabs {
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  background-color: white;
  padding: 0 20px;

  .ant-tabs-bar {
    margin: 4px 0 0;
    border: none;
  }
}

.ant-tabs {
  &.ant-tabs-card .ant-tabs-tab {
    padding: 0 24px !important;
    background-color: white !important;
    margin-right: 10px !important;

    .ant-tabs-close-x {
      width: 12px !important;
      height: 12px !important;
      opacity: 0 !important;
      cursor: pointer !important;
      font-size: 12px !important;
      margin: 0 !important;
      position: absolute;
      top: 36%;
      right: 6px;
    }

    &:hover .ant-tabs-close-x {
      opacity: 1 !important;
    }
  }
}

.ant-tabs.ant-tabs-card > .ant-tabs-bar {
  .ant-tabs-tab {
    border: none !important;
    border-bottom: 1px solid transparent !important;
  }

  .ant-tabs-tab-active {
    border-color: #1890ff !important;
  }
}

.ant-layout-content {
  .ant-tab-fixedTab {
    position: fixed;
    top: 59px;
    z-index: 10;
    width: 100%;
    transition: width 0.2s;
  }
}
</style>
