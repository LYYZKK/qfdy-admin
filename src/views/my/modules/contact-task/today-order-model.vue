<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <today-order-model-content ref="modelContent" />
    <template slot="footer">
      <a-popconfirm
        v-if="['add', 'edit'].includes(operateType)"
        title="确定取消吗?"
        @confirm="() => handleCancel()"
      >
        <a-button>取消</a-button>
      </a-popconfirm>
      <a-button @click="handleCancel" v-else>关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin'
import todayOrderModelContent from './today-order-model-content'
import { Modal, Spin, Row, Col, Button, Popconfirm, Table, Form, Card, Tag } from 'ant-design-vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'

export default {
  name: 'TodayOrderModel',
  mixins: [ModalMixin],
  components: {
    AModal: Modal,
    ASpin: Spin,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    APopconfirm: Popconfirm,
    ATable: Table,
    AForm: Form,
    AFormItem: Form.Item,
    ACard: Card,
    ATag: Tag,
    JDictViewTag,
    todayOrderModelContent
  },
  data() {
    return {
      title: '操作',
      operateType: 'add',
      visible: false
    }
  },
  methods: {
    showDetail(record) {
      this.$nextTick(() => {
        this.$refs.modelContent.operateType = this.operateType
        this.$refs.modelContent.show(record)
      })
    }
  }
}
</script>

<style scoped>
</style>
