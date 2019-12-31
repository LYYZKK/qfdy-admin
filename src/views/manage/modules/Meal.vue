<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <div>套餐详情</div>
  </a-modal>
</template>

<script>
import { Modal } from 'ant-design-vue'
import ModalMixin from '@/mixins/ModalMixin'
export default {
  name: 'Meal',
  mixins: [ModalMixin],
  data() {
    return {}
  },
  components: {
    AModel: Modal
  }
}
</script>

<style>
</style>
