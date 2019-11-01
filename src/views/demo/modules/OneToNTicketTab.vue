<template>
  <div>
    <div class="tab-buttons" v-if="['add', 'edit'].includes(operateType)">
      <a-button @click="addRowTicket" type="primary" icon="plus">添加</a-button>
    </div>

    <div class="tab-table">
      <a-row class="form-row tab-table-title" :gutter="16">
        <a-col :span="6">
          <span class="required-mask">*</span>航班号
        </a-col>
        <a-col :span="6">航班时间</a-col>
        <a-col :span="5">操作</a-col>
      </a-row>
      <a-row :gutter="16" v-for="(item, index) in tickets" :key="index">
        <a-col :span="6">
          <a-form-item>
            <a-input
              v-if="['add', 'edit'].includes(operateType)"
              placeholder="航班号"
              v-decorator="['tickets[' + index + '].ticketCode', { initialValue: item.ticketCode, ...validatorRules.ticketCode}]"
            />
            <template v-else>{{ item.ticketCode }}</template>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item>
            <j-date
              v-if="['add', 'edit'].includes(operateType)"
              placeholder="航班时间"
              v-decorator="['tickets[' + index + '].tickectDate', { initialValue: item.tickectDate }]"
            />
            <template v-else>{{ item.tickectDate }}</template>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <a-form-item v-if="['add', 'edit'].includes(operateType)">
            <a-popconfirm title="确定删除吗?" @confirm="delRowTicket(index)">
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
import JDate from '@/components/jeecg/JDate.vue'

export default {
  components: {
    AButton: Button,
    ARow: Row,
    ACol: Col,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    APopconfirm: Popconfirm,
    JDate
  },
  name: 'OneToNTicketTab',
  props: {
    tickets: {
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
        ticketCode: { rules: [{ required: true, message: '请输入航班号!' }] }
      }
    }
  },
  methods: {
    addRowTicket() {
      this.tickets.push({})
      this.$forceUpdate()
    },
    delRowTicket(index) {
      this.tickets.splice(index, 1)
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
