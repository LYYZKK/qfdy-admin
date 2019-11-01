<template>
  <div>
    <a-form layout="vertical" :form="form">
      <a-form-item label="表单名称" required>
        <a-input v-model="formProperty.name" />
      </a-form-item>
      <a-form-item label="表单类型">
        <j-dict-select-tag v-model="formProperty.type" dictCode="form_type" placeholder="请选择" />
      </a-form-item>
      <a-form-item label="表单有效性">
        <a-radio-group name="radioGroup1" v-model="formProperty.status">
          <a-radio :value="0">有效</a-radio>
          <a-radio :value="1">无效</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="工单备注">
        <a-input v-model="formProperty.description" />
      </a-form-item>
      <a-form-item label="布局方式">
        <a-radio-group
          :defaultValue="formProperty.layoutType"
          buttonStyle="solid"
          name="radioGroup2"
          v-model="formProperty.layoutType"
          @change="changeLayout"
        >
          <a-radio :value="0">固定布局</a-radio>
          <a-radio :value="1">响应式布局</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { Form, Input, Radio, InputNumber } from 'ant-design-vue'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
export default {
  name: 'FormProperty',
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // maxControl() {
    //   if (this.formProperty.labelWidth + this.formProperty.containerWidth > 24) {
    //     this.$message.error('数字之和不能超过24')
    //     this.formProperty.labelWidth = 3
    //     this.formProperty.containerWidth = 20
    //   }
    // },
    // duplicateCheck(fieldName, fieldVal, id) {
    //   this.$emit('checkValueDuplicate', { fieldName, fieldVal, id })
    // },
    changeLayout() {
      this.$emit('changeLayoutType')
    }
  },
  props: {
    hasData: {
      type: Boolean,
      default() {
        return false
      }
    },
    formProperty: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ARadioButton: Radio.Button,
    AInputNumber: InputNumber,
    JDictSelectTag
  }
}
</script>
<style lang="less" scoped>
.ml10 {
  margin-left: 10px;
}
</style>
