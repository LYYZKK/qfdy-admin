<template>
  <a-row>
    <a-button type="primary" @click="loadingQR">登录微信</a-button>
    <a-modal
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <div>我是二维码</div>
    </a-modal>
  </a-row>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin'

import { Modal, Row, Button } from 'ant-design-vue'

export default {
  name: 'Modal',
  mixins: [ModalMixin],
  components: {
    AModal: Modal,
    ARow: Row,
    AButton: Button
  },
  data() {
    return {}
  },
  methods: {
    loadingQR() {
      console.log('获取二维码')
    }
  }
}
</script>

<style scoped>
</style>
