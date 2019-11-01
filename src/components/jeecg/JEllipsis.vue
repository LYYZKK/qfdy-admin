<template>
  <a-popover v-if="showMoreType === 'popover' && showMore">
    <template slot="content">
      <span>{{ value }}</span>
    </template>
    {{ value | ellipsis(length) }}
  </a-popover>
  <a-tooltip placement="topLeft" v-else-if="showMoreType === 'tooltip' && showMore">
    <template slot="title">
      <span>{{ value }}</span>
    </template>
    {{ value | ellipsis(length) }}
  </a-tooltip>
  <span v-else>{{ value | ellipsis(length) }}</span>
</template>

<script>
import { Popover, Tooltip } from 'ant-design-vue'

export default {
  name: 'JEllipsis',
  components: {
    APopover: Popover,
    ATooltip: Tooltip
  },
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    length: {
      type: Number,
      required: false,
      default: 25
    },
    showMore: {
      type: Boolean,
      required: false,
      default: true
    },
    showMoreType: {
      type: String,
      required: false,
      default: 'tooltip' // 可选 tooltip, popover
    }
  }
}
</script>

<style scoped>
</style>
