<template>
  <a-modal
    :title="title"
    :width="1300"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <my-step-modal-content ref="modalContent" :recordId="recordId" />
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
import { Col, Modal, Spin, Row, Button, Form, Badge, Tag } from 'ant-design-vue'
import ModalMixin from '@/mixins/ModalMixin'
import callChatContent from '@/views/my/components/call/call-chat-section/call-chat-content.vue'
import myStepModalContent from './my-step-modal-content'

export default {
  name: 'StepModal',
  mixins: [ModalMixin],
  components: {
    callChatContent,
    myStepModalContent,
    ARow: Row,
    ACol: Col,
    AModal: Modal,
    ASpin: Spin,
    AButton: Button,
    AForm: Form,
    AFormItem: Form.Item,
    ABadge: Badge,
    ATag: Tag
  },
  data() {
    return {
      title: '接触历史详情',
      operateType: 'phone',
      visible: false,
      recordId: null
    }
  },
  methods: {
    handleShowDetail(stepItem) {
      this.$nextTick(() => {
        this.recordId = stepItem.recordId
        this.$refs.modalContent.operateType = this.operateType
        this.$refs.modalContent.show({ id: stepItem.recordId })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.audio-style {
  ::v-deep .plyr--audio .plyr__controls {
    width: 100%;
    background: #f3f5fa;
    border-radius: 1px;
    height: 32px;
  }
  ::v-deep .plyr__menu__container {
    top: 41px;
    bottom: auto;
  }
  ::v-deep .plyr__menu__container::after {
    display: none;
  }
}
</style>
