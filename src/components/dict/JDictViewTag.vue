<template>
  <span v-if="refresh">
    <span :style="spanDictStyle" v-if="dictItemShowType === 'text'">{{ dictText }}</span>
    <a-tag :color="dictOption.showColor" v-else-if="dictItemShowType === 'tag'">{{ dictText }}</a-tag>
    <a-tag :color="dictOption.showColor" v-else-if="dictItemShowType === 'badge'">{{ dictText }}</a-tag>
  </span>
</template>

<script>
import { Tag } from 'ant-design-vue'

import { buildTreeDataForAntd } from '@/utils/util'
import { filterDictOptionByVal, getDictByCode, getEnableDictItemsByDictCode } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'JDictViewTag',
  components: {
    ATag: Tag
  },
  props: {
    dictCode: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      dict: {},
      dictOptions: [],
      dictOption: {},
      refresh: false
    }
  },
  created() {
    const _this = this
    new Promise(resolve => {
      getDictByCode(_this.dictCode).then(res => {
        if (res.success) {
          _this.dict = res.data[0]

          resolve(res.success)
        }
      })
    }).then(() => {
      getEnableDictItemsByDictCode(_this.dictCode, null).then(res => {
        if (res.success) {
          /**
           * dict.type 数据字典类型, 0: 一级, 1: 多级.
           */
          if (_this.dict.type === 0) {
            _this.dictOptions = res.data
            _this.dictOption = filterDictOptionByVal(_this.dictOptions, _this.value)
          } else {
            const tree = buildTreeDataForAntd({ data: res.data, titleField: 'itemText', valueField: 'itemVal' })

            _this.dictOptions = tree.data
            _this.dictOption = tree.valueMap[_this.value]
          }

          _this.refresh = false
          _this.$nextTick(() => {
            _this.refresh = true
          })
        }
      })
    })
  },
  computed: {
    dictItemShowType() {
      return this.dictOption.showType || 'text'
    },
    spanDictStyle() {
      return this.dictOption.showColor ? `clor: ${this.dictOption.showColor};` : ''
    },
    dictText() {
      return this.dictOption.itemText
    }
  }
}
</script>

<style scoped>
</style>
