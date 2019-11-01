<template>
  <span>
    <template v-if="isEdit">
      <area-select
        :type="returnType"
        :placeholder="placeholder"
        v-model="addVal"
        :level="level"
        :data="pcaa"
        v-if="level === 0 || selectType === 'select'"
      />
      <area-cascader
        :type="returnType"
        :placeholder="placeholder"
        v-model="addVal"
        :level="cascaderLevel"
        :data="pcaa"
        v-else-if="selectType === 'cascader'"
      />
    </template>

    <template v-else-if="!isEdit && returnType === 'code'">
      <template v-if="level >= 0 && value.length >= 1">{{ pcaa['86'][value[0]] }}</template>
      <template v-if="level >= 1 && value.length >= 2">/ {{ pcaa[value[0]][value[1]] }}</template>
      <template v-if="level >= 2 && value.length >= 3">/ {{ pcaa[value[1]][value[2]] }}</template>
    </template>

    <template v-else-if="!isEdit && returnType === 'text'">
      <template v-if="level >= 0 && value.length >= 1">{{ value[0] }}</template>
      <template v-if="level >= 1 && value.length >= 2">/ {{ value[1] }}</template>
      <template v-if="level >= 2 && value.length >= 3">/ {{ value[2] }}</template>
    </template>

    <template v-else-if="!isEdit && returnType === 'all'">
      <template v-if="level >= 0 && value.length >= 1">{{ values(value[0]).join('') }}</template>
      <template v-if="level >= 1 && value.length >= 2">/ {{ values(value[1]).join('') }}</template>
      <template v-if="level >= 2 && value.length >= 3">/ {{ values(value[2]).join('') }}</template>
    </template>
  </span>
</template>

<script>
import { pcaa } from 'area-data'
import values from 'lodash.values'

import { AreaSelect, AreaCascader } from 'vue-area-linkage'

import '@public/area-linkage.less'

export default {
  name: 'JAddress',
  description: '省市区选择组件',
  components: {
    AreaSelect,
    AreaCascader
  },
  props: {
    /**
     * 是否只读, 用于区分编辑和查看.
     */
    isEdit: {
      type: Boolean,
      required: false,
      default: true
    },
    /**
     * 选择组件类型, select: 各级独立级联下拉选择, cascader: 合一级联下拉选择.
     */
    selectType: {
      type: String,
      required: false,
      default: 'select'
    },
    /**
     * 返回数据类型, code: 编码数组 (默认), text: 文本数组, all: {code: text}, {编码:文本}对象数组.
     * e.g:
     *  code: ['110000', '110101']
     *  text 或 all: ['北京市', '东城区']
     */
    returnType: {
      type: String,
      required: false,
      default: 'code'
    },
    /**
     * 所选数据层级, 0: 省, 1: 省/市 (默认), 2: 省/市/区.
     */
    level: {
      type: Number,
      required: false,
      default: 1
    },
    /**
     * 默认渲染值, 数组形式, 类型跟 returnType 返回值一致.
     * e.g:
     *  returnType 为 code 时, value 格式为 ['110000', '110101'].
     *  returnType 为 text 或 all 时, value 格式为 ['北京市', '东城区'].
     */
    value: {
      type: Array,
      required: false,
      default: () => []
    },
    placeholder: {
      type: String,
      required: false,
      default: '请选择地区'
    }
  },
  data() {
    return {
      pcaa,
      addVal: this.value,
      cascaderLevel: this.level === 1 && this.selectType === 'cascader' ? 0 : 1
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    addVal(newValue) {
      this.$emit('change', newValue)
    }
  },
  methods: {
    values(obj) {
      return values(obj)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
