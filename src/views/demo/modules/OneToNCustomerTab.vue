<template>
  <div>
    <div class="tab-buttons" v-if="['add', 'edit'].includes(operateType)">
      <a-button @click="addRowCustom" type="primary" icon="plus">添加</a-button>
    </div>

    <div class="tab-table">
      <a-row class="form-row tab-table-title" :gutter="16">
        <a-col :span="5">
          <span class="required-mask">*</span>客户名
        </a-col>
        <a-col :span="5">性别</a-col>
        <a-col :span="5">身份证号码</a-col>
        <a-col :span="5">手机号</a-col>
        <a-col :span="2">操作</a-col>
      </a-row>

      <a-row :gutter="16" v-for="(item, index) in customers" :key="index">
        <a-col :span="5">
          <a-form-item>
            <a-input
              v-if="['add', 'edit'].includes(operateType)"
              placeholder="客户名"
              v-decorator="['customers[' + index + '].name', {initialValue: item.name, ...validatorRules.name}]"
            />
            <template v-else>{{ item.name }}</template>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item>
            <j-dict-select-tag
              v-if="['add', 'edit'].includes(operateType)"
              v-decorator="['customers[' + index + '].sex', {initialValue: item.sex}]"
              :value="item.sex"
              :triggerChange="true"
              placeholder="请选择性别"
              dictCode="sex"
            />
            <j-dict-view-tag v-else v-model="item.sex" dictCode="industry" />
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item>
            <a-input
              v-if="['add', 'edit'].includes(operateType)"
              placeholder="身份证号"
              v-decorator="['customers[' + index + '].idcard', {initialValue: item.idcard, ...validatorRules.idcard}]"
            />
            <template v-else>{{ item.idcard }}</template>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item>
            <a-input
              v-if="['add', 'edit'].includes(operateType)"
              placeholder="手机号"
              v-decorator="['customers[' + index + '].telphone', {initialValue: item.telphone, ...validatorRules.telphone}]"
            />
            <template v-else>{{ item.telphone }}</template>
          </a-form-item>
        </a-col>
        <a-col :span="2">
          <a-form-item v-if="['add', 'edit'].includes(operateType)">
            <a-popconfirm title="确定删除吗?" @confirm="delRowCustom(index)">
              <a-button icon="delete" type="danger" title="删除" />
            </a-popconfirm>
          </a-form-item>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { Button, Row, Col, Form, Input, Popconfirm } from 'ant-design-vue'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'

export default {
  components: {
    AButton: Button,
    ARow: Row,
    ACol: Col,
    AForm: Form,
    AFormItem: Form.Item,
    APopconfirm: Popconfirm,
    AInput: Input,
    JDictSelectTag,
    JDictViewTag
  },
  name: 'OneToNCustomerTab',
  props: {
    customers: {
      required: true,
      type: Array,
      default() {
        return []
      }
    },
    operateType: {
      required: true,
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入用户名!' }] },
        idcard: {
          rules: [
            {
              pattern: '^\\d{6}(18|19|20)?\\d{2}(0[1-9]|1[012])(0[1-9]|[12]\\d|3[01])\\d{3}(\\d|[xX])$',
              message: '身份证号格式不正确!'
            }
          ]
        },
        telphone: { rules: [{ pattern: '^1(3|4|5|7|8|9)\\d{9}$', message: '手机号格式正确!' }] }
      }
    }
  },
  methods: {
    addRowCustom() {
      this.customers.push({})
      this.$forceUpdate()
    },
    delRowCustom(index) {
      this.customers.splice(index, 1)
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-buttons {
  .ant-btn {
    margin-bottom: 8px;
    margin-left: 8px;
  }
}

.tab-table {
  padding-left: 10px;

  .tab-table-title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
}
</style>
