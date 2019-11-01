<template>
  <a-range-picker
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    :value="momVal"
    :showTime="showTime"
    :format="format"
    :getCalendarContainer="getCalendarContainer"
  />
</template>
<script>
import moment from 'moment'
import { DatePicker } from 'ant-design-vue'

export default {
  name: 'JRangeDate',
  components: {
    ARangePicker: DatePicker.RangePicker
  },
  props: {
    placeholder: {
      type: Array,
      default: () => ['开始时间', '结束时间'],
      required: false
    },
    value: {
      type: Array,
      default: () => [],
      required: false
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
      required: false
    },
    // 此属性可以被废弃了
    triggerChange: {
      type: Boolean,
      required: false,
      default: false
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    showTime: {
      type: Boolean,
      required: false,
      default: false
    },
    getCalendarContainer: {
      type: Function,
      default: () => document.body
    }
  },
  data() {
    return {
      decorator: '',
      momVal: []
    }
  },
  watch: {
    value(val) {
      if (val && val[0]) {
        this.momVal = val.map(item => {
          return moment(item, this.format)
        })
      } else {
        this.momVal = []
      }
    }
  },
  methods: {
    moment,
    handleDateChange(mom, dateArr) {
      this.$emit('change', dateArr)
    }
  },
  beforeMount() {
    if (this.value && this.value.length) {
      this.momVal = this.value.map(item => {
        return moment(item, this.format)
      })
    }
  },
  // 2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型 这个牛逼
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>
