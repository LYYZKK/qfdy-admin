<template>
  <a-radio-group
    v-if="dict.type === 0 && tagType === 'radio'"
    :value="value"
    @change="handleInputChange"
    :disabled="disabled"
  >
    <a-radio v-for="(item, key) in dictOptions" :key="key" :value="item.itemVal">{{ item.itemText }}</a-radio>
  </a-radio-group>

  <a-select
    v-else-if="dict.type === 0 && tagType === 'select'"
    :placeholder="placeholder"
    :value="value"
    @change="handleInputChange"
    :disabled="disabled"
  >
    <a-select-option v-if="hasEmptyOption" value>{{ emptyOptionText }}</a-select-option>

    <a-select-option
      v-for="(item, key) in dictOptions"
      :key="key"
      :value="item.itemVal"
    >{{ item.itemText }}</a-select-option>
  </a-select>

  <a-tree-select
    v-else-if="dict.type === 1"
    :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
    :value="value"
    @change="handleTreeSelectChange"
    :treeData="dictOptions"
    :placeholder="placeholder"
    treeDefaultExpandAll
    allowClear
    :disabled="disabled"
  />
</template>

<script>
import { Radio, Select, TreeSelect } from 'ant-design-vue'
import { Promise } from 'bluebird'

import { getEnableDictItemsByDictCode, getDictByCode } from '@/components/dict/JDictSelectUtil'
import { buildTreeDataForAntd } from '@/utils/util'

export default {
  name: 'JDictSelectTag',
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATreeSelect: TreeSelect
  },
  props: {
    dictCode: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    triggerChange: {
      type: Boolean,
      required: false,
      default: true
    },
    type: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      type: String,
      required: false,
      default: ''
    },
    hasEmptyOption: {
      type: Boolean,
      required: false,
      default: true
    },
    emptyOptionText: {
      type: String,
      required: false,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      tagType: '',
      dict: {},
      dictOptions: []
    }
  },
  created() {
    if (!this.type || this.type === 'list') {
      this.tagType = 'select'
    } else {
      this.tagType = this.type
    }

    // 获取字典数据.
    this.initDictData()
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    initDictData() {
      const _this = this
      const p1 = new Promise(resolve => {
        getDictByCode(_this.dictCode).then(res => {
          if (res.success) {
            _this.dict = res.data[0]

            resolve(res.success)
          }
        })
      })

      const p2 = new Promise(() => {
        getEnableDictItemsByDictCode(_this.dictCode, null).then(res => {
          if (res.success) {
            /**
             * dict.type 数据字典类型, 0: 一级, 1: 多级.
             */
            if (_this.dict.type === 0) {
              _this.dictOptions = res.data
            } else {
              const tree = buildTreeDataForAntd({ data: res.data, titleField: 'itemText', valueField: 'itemVal' })
              _this.dictOptions = tree.data
              _this.dictOptionsValueMap = tree.valueMap
            }
          }
        })
      })

      p1.then(() => {
        p2
      })
    },

    handleInputChange(e) {
      let val
      if (this.tagType === 'radio') {
        val = e.target.value
      } else {
        val = e
      }

      if (this.triggerChange) {
        this.$emit('change', val)
      } else {
        this.$emit('input', val)
      }
    },
    handleTreeSelectChange(val) {
      if (this.triggerChange) {
        this.$emit('change', this.dictOptionsValueMap[val].value)
      } else {
        this.$emit('input', this.dictOptionsValueMap[val].value)
      }
    }
  }
}
</script>

<style scoped>
</style>
