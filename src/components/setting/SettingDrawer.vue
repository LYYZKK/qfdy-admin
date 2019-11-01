<template>
  <div class="setting-drawer">
    <a-drawer
      title="系统设置"
      width="300"
      placement="right"
      @close="onClose"
      :visible="visible"
      :handle="handle"
    >
      <div class="setting-drawer-index-content">
        <div class="m-b-20">
          <h4 class="setting-drawer-index-title">菜单风格设置</h4>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">暗色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('dark')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg"
                  alt="dark"
                />
                <div class="setting-drawer-index-selectIcon" v-if="navTheme === 'dark'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">亮色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('light')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg"
                  alt="light"
                />
                <div class="setting-drawer-index-selectIcon" v-if="navTheme !== 'dark'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>

        <div class="m-b-20">
          <h4 class="setting-drawer-index-title">主题色</h4>

          <div class="h-20">
            <a-tooltip
              class="setting-drawer-theme-color-colorBlock"
              v-for="(item, index) in colorList"
              :key="index"
            >
              <template slot="title">{{ item.key }}</template>
              <a-tag :color="item.color" @click="changeColor(item.color)">
                <a-icon type="check" v-if="item.color === primaryColor"></a-icon>
              </a-tag>
            </a-tooltip>
          </div>
        </div>
        <a-divider />

        <div class="m-b-20">
          <h4 class="setting-drawer-index-title">导航模式</h4>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">侧边栏导航</template>
              <div class="setting-drawer-index-item" @click="handleLayout('sidemenu')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg"
                  alt="sidemenu"
                />
                <div class="setting-drawer-index-selectIcon" v-if="layoutMode === 'sidemenu'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">顶部栏导航</template>
              <div class="setting-drawer-index-item" @click="handleLayout('topmenu')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg"
                  alt="topmenu"
                />
                <div class="setting-drawer-index-selectIcon" v-if="layoutMode !== 'sidemenu'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>
          </div>
          <div :style="{ marginTop: '20px' }">
            <a-list :split="false">
              <a-list-item v-if="layoutMode !== 'sidemenu'">
                <a-select
                  size="small"
                  class="w-80"
                  :defaultValue="contentWidth"
                  @change="handleContentWidthChange"
                >
                  <a-select-option value="Fixed">固定</a-select-option>
                  <a-select-option value="Fluid">流式</a-select-option>
                </a-select>
                <a-list-item-meta>
                  <div slot="title">内容区域宽度</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :defaultChecked="fixedHeader"
                  @change="handleFixedHeader"
                />
                <a-list-item-meta>
                  <div slot="title">固定顶部</div>
                </a-list-item-meta>
              </a-list-item>
              <!-- <a-list-item v-if="layoutMode !== 'topmenu'">
                <a-switch
                  slot="actions"
                  size="small"
                  :checked="dataFixSiderbar"
                  @change="handleFixSiderbar"
                />
                <a-list-item-meta>
                  <div slot="title">固定侧边菜单</div>
                </a-list-item-meta>
              </a-list-item>-->
            </a-list>
          </div>
        </div>
        <a-divider />

        <div class="m-b-20">
          <h4 class="setting-drawer-index-title">其他设置</h4>
          <div>
            <a-list :split="false">
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :defaultChecked="colorWeak"
                  @change="onColorWeak"
                />
                <a-list-item-meta>
                  <div slot="title">色弱模式</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :defaultChecked="multipage"
                  @change="onMultipageWeak"
                />
                <a-list-item-meta>
                  <div slot="title">多页签模式</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import DetailList from '@/components/tools/DetailList'
import SettingItem from '@/components/setting/SettingItem'
import config from '@/defaultSettings'
import { updateTheme, updateColorWeak, colorList } from '@/components/tools/setting'
import { mixin, mixinDevice } from '@/utils/mixin.js'
import { triggerWindowResizeEvent } from '@/utils/util'
import { Drawer, Tooltip, Icon, Tag, Divider, List, Switch, Select } from 'ant-design-vue'

export default {
  components: {
    DetailList,
    SettingItem,
    ADrawer: Drawer,
    ATooltip: Tooltip,
    AIcon: Icon,
    ATag: Tag,
    ADivider: Divider,
    AList: List,
    AListItem: List.Item,
    AListItemMeta: List.Item.Meta,
    ASwitch: Switch,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      visible: false,
      colorList,
      handle: <div />,
      dataFixSiderbar: config.fixSiderbar
    }
  },
  mounted() {
    // 当主题色不是默认色时，才进行主题编译
    if (this.primaryColor !== config.primaryColor) {
      updateTheme(this.primaryColor)
    }
    if (this.colorWeak !== config.colorWeak) {
      updateColorWeak(this.colorWeak)
    }
    if (this.multipage !== config.multipage) {
      this.$store.dispatch('ToggleMultipage', this.multipage)
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    toggle() {
      this.visible = !this.visible
    },
    onColorWeak(checked) {
      this.$store.dispatch('ToggleWeak', checked)
      updateColorWeak(checked)
    },
    onMultipageWeak(checked) {
      this.$store.dispatch('ToggleMultipage', checked)
    },
    handleMenuTheme(theme) {
      this.$store.dispatch('ToggleTheme', theme)
    },
    handleLayout(mode) {
      this.$store.dispatch('ToggleLayoutMode', mode)
      this.handleFixSiderbar(true)
      // 触发窗口resize事件
      triggerWindowResizeEvent()
    },
    handleContentWidthChange(type) {
      this.$store.dispatch('ToggleContentWidth', type)
    },
    changeColor(color) {
      if (this.primaryColor !== color) {
        this.$store.dispatch('ToggleColor', color)
        updateTheme(color)
      }
    },
    handleFixedHeader(fixed) {
      this.$store.dispatch('ToggleFixedHeader', fixed)
    },
    handleFixedHeaderHidden(autoHidden) {
      this.$store.dispatch('ToggleFixedHeaderHidden', autoHidden)
    },
    handleFixSiderbar(fixed) {
      // 因为顶部菜单不能固定左侧菜单栏，所以强制关闭
      if (this.layoutMode === 'topmenu') {
        fixed = false
      }
      this.dataFixSiderbar = fixed
      this.$store.dispatch('ToggleFixSiderbar', fixed)
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-drawer-index-content {
  .setting-drawer-index-blockChecbox {
    display: flex;

    .setting-drawer-index-item {
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      cursor: pointer;

      img {
        width: 48px;
      }

      .setting-drawer-index-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 20px;
        height: 100%;
        color: #1890ff;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
}
</style>
