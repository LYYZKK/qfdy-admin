<template>
  <div :class="[prefixCls, reverseColor && 'reverse-color' ]">
    <span>
      <slot name="term"></slot>
      <span class="item-text">
        <slot></slot>
      </span>
    </span>
    <span :class="[flag]">
      <a-icon :type="`caret-${flag}`" />
    </span>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'

export default {
  name: 'Trend',
  components: {
    AIcon: Icon
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-trend'
    },
    /**
     * 上升下降标识：up|down
     */
    flag: {
      type: String,
      required: true
    },
    /**
     * 颜色反转
     */
    reverseColor: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
