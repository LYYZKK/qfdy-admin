<template>
  <a-date-picker
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    :value="momVal"
    :showTime="showTime"
    :format="format"
    :getCalendarContainer="getCalendarContainer"
    :disabledDate="disabledDate"
    :disableTime="disableTime"
  />
</template>
<script>
import moment from 'moment'
import { DatePicker } from 'ant-design-vue'

export default {
  name: 'JDate',
  components: {
    ADatePicker: DatePicker
  },
  props: {
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    value: {
      type: String,
      required: false,
      default: ''
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
    },
    disabledDate: {
      type: Function,
      required: false,
      // eslint-disable-next-line no-unused-vars
      default: currentDate => {}
    },
    disabledTime: {
      type: Function,
      required: false,
      // eslint-disable-next-line no-unused-vars
      default: () => {}
    }
  },
  data() {
    let dateStr = this.value
    return {
      decorator: '',
      momVal: !dateStr ? null : moment(dateStr, this.format)
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.momVal = null
      } else {
        this.momVal = moment(val, this.format)
      }
    }
  },
  methods: {
    moment,
    handleDateChange(mom, dateStr) {
      this.$emit('change', dateStr)
    }
  },
  // 2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型 这个牛逼
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>
