<template>
  <a-modal
    width="80%"
    :title="title"
    placement="right"
    :visible="visible"
    @cancel="() => this.visible = false"
    wrapClassName="add-products-drawer"
  >
    <a-row id="add-products" class="m-b-15">
      <products-list ref="productsList" :isDrawer="isDrawer" />
    </a-row>
    <template slot="footer" class="footer-btn-container">
      <a-button @click="handleCloseSelf">取消</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import productsList from '../productsList'
import ModalMixin from '@/mixins/ModalMixin'
import { Row, Col, Form, Input, Button, Divider, Icon, Tooltip, Select, InputNumber, Modal } from 'ant-design-vue'
export default {
  name: 'AddProducts',
  mixins: [ModalMixin],
  components: {
    ARow: Row,
    ACol: Col,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ATextarea: Input.TextArea,
    AButton: Button,
    ADivider: Divider,
    AIcon: Icon,
    ATooltip: Tooltip,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInputNumber: InputNumber,
    AModal: Modal,
    productsList
  },
  data() {
    return {
      title: null,
      operateType: null,
      isDrawer: true,
      model: {}
    }
  },
  methods: {
    openSelf(checkedProducts) {
      this.title = '选择售卖的商品'
      this.visible = true
      this.$nextTick(() => {
        if (checkedProducts) this.$refs.productsList.selectedRowKeys = checkedProducts
        else this.$refs.productsList.selectedRowKeys = []
      })
    },
    handleCloseSelf() {
      this.visible = false
    },
    afterHandleOkRequest(res) {
      if (res.success) {
        this.$emit('refresh', res.data)
      }
    },
    handleOk() {
      this.$emit('ok', this.$refs.productsList.selectionRows)
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
#add-products {
  background: #fff;
  .footer-btn-container {
    text-align: right;
    .ant-btn {
      margin: 0 3px;
    }
  }
}
</style>
<style lang="scss">
.add-products-drawer {
  .ant-modal-body {
    padding: 0 !important;
  }
}
</style>
