<template>
  <div id="order-info" :class="tablet?'pad':device">
    <a-tabs :defaultActiveKey="0" id="contact-task" class="bg-white" @change="changeTab">
      <a-tab-pane v-for="(item,index) in products" :tab="item.name" :key="index">
        <order-product @buy="addBuy" ref="orderProduct" :product="item" :productIndex="index" />
      </a-tab-pane>
    </a-tabs>
    <a-card class="order-container bg-white m-t-10" :bordered="false" title="订单信息">
      <a-row class="tab-table">
        <a-row class="form-row tab-table-title bold">
          <a-col :span="8">名称</a-col>
          <a-col :span="8">数量</a-col>
          <a-col :span="6">总价</a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-row>
      <a-divider />
      <a-row
        type="flex"
        justify="center"
        v-if="!(model.orderProducts && model.orderProducts.length)"
      >暂无商品</a-row>
      <a-row v-for="(item,index) in model.orderProducts" :key="index">
        <a-col :span="8">{{ item.name }}</a-col>
        <a-col :span="8">
          <a-input-number
            size="small"
            :min="1"
            v-model="item.productNum"
            @change="changeNum(item.productNum,item.price,index)"
          />
        </a-col>
        <a-col :span="6" class="c-red bold">￥ {{ totalPrice[index] }}</a-col>
        <a-col :span="2" class="c-red bold">
          <a-popconfirm title="确定删除吗?" @confirm="() => handleProductDelete(index)">
            <a-button type="link" size="small">删除</a-button>
          </a-popconfirm>
        </a-col>
        <a-col :span="24">
          <a-divider />
        </a-col>
      </a-row>
      <a-row class="order-submit" type="flex" align="middle">
        <a-col :span="20">
          <div class="f-l">
            <span class="bold">总金额：</span>
            <span class="c-red bold">￥ {{ model.amount }}</span>
          </div>
        </a-col>
        <a-col :span="4">
          <a-button
            type="primary"
            @click="submitOrder"
            :disabled="!(model.orderProducts && model.orderProducts.length)"
          >提交订单</a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'
import orderProduct from './order-product'
import {
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Input,
  Form,
  InputNumber,
  Tooltip,
  Icon,
  Select,
  Divider,
  Popconfirm
} from 'ant-design-vue'
import { request } from '@/api'
import { mapState } from 'vuex'

export default {
  name: 'OrderInfo',
  mixins: [mixinDevice, KeepAliveMixin],
  components: {
    orderProduct,
    JEllipsis,
    JDictSelectTag,
    ARow: Row,
    ACol: Col,
    ACard: Card,
    AButton: Button,
    AForm: Form,
    AFormItem: Form.Item,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AInput: Input,
    AInputNumber: InputNumber,
    ATooltip: Tooltip,
    AIcon: Icon,
    ASelect: Select,
    ASelectOption: Select.Option,
    ADivider: Divider,
    APopconfirm: Popconfirm
  },
  data() {
    return {
      form: this.$form.createForm(this),
      model: {
        amount: 0,
        customerId: this.customerId,
        orderProducts: []
      },
      priceArr: [],
      products: [],
      orderList: [],
      totalPrice: [],
      productDetail: {},
      customerId: null,
      campaignId: null,
      validatorRules: {
        productNum: { rules: [{ required: true, message: '请输入数量!' }] }
      },
      api: {
        getProducts: {
          url: '/contact/campaigns/{id}/products'
        },
        addOrder: {
          url: '/order/orders',
          method: 'post'
        },
        getProductDetailById: {
          url: '/order/products/{id}'
        },
        sendMsg: {
          url: '/order/orders/send-order-msg/{orderNo}',
          method: 'patch'
        }
      }
    }
  },
  computed: {
    ...mapState({
      callChatStatus: state => state.my.callChatStatus,
      taskData: state => state.my.taskData.data,
      contactRecordIds: state => state.cti.contactRecordIds
    }),
    totalPriceLength() {
      return this.totalPrice.length
    }
  },
  methods: {
    addBuy(productDetail) {
      this.productDetail = productDetail
      this.$set(this.model.orderProducts, this.model.orderProducts.length, productDetail)
      this.model.orderProducts = Array.from(new Set(this.model.orderProducts))
      this.$set(this.totalPrice, this.totalPrice.length, productDetail.price)
      this.totalPrice = Array.from(new Set(this.totalPrice))
    },
    handleProductDelete(index) {
      this.model.orderProducts.splice(index, 1)
      this.totalPrice.splice(index, 1)
    },
    changeTab(index) {
      this.getProductDetailById(this.products[index].id, index)
    },
    changeFormLayout() {
      this.$nextTick(() => {
        this.$refs.orderProduct.forEach(item => {
          item.changeFormLayout(this.callChatStatus)
        })
      })
    },
    changeNum(val, price, index) {
      // 如果表单没有填写，为防止计算结果NaN补零
      if (!val) this.products[index].productNum = 1
      // 计算单个商品的总金额
      this.totalPrice[index] = val * price
      // // 设置到产品价格的数组对应下标内
      // this.$set(this.priceArr, index, this.totalPrice[index])
      // 重置总金额
      this.model.amount = 0
      // 遍历计算总金额
      this.totalPrice.forEach(item => {
        this.model.amount = parseFloat((this.model.amount + item).toFixed(2))
      })
    },
    getProducts() {
      this.spinning = true
      request({ ...this.api.getProducts, urlReplacements: [{ substr: '{id}', replacement: this.campaignId }] }).then(
        res => {
          if (res.success) {
            this.products = res.data.map(item => {
              item['productNum'] = 1
              return item
            })
            this.getProductDetailById(this.products[0].id, 0)
            this.spinning = false
          }
        }
      )
    },
    getProductDetailById(id, index) {
      this.spinning = true
      request({ ...this.api.getProductDetailById, urlReplacements: [{ substr: '{id}', replacement: id }] }).then(
        res => {
          if (res.success) {
            this.products[index].productProperties = res.data.productProperties
            this.spinning = false
          }
        }
      )
    },
    submitOrder() {
      if (!this.contactRecordIds || this.contactRecordIds.length === 0) {
        this.$message.error('请先联系客户再提交订单')
        return false
      }

      let formData = {
        amount: this.model.amount,
        customerId: this.model.customerId,
        orderProducts: []
      }
      this.model.orderProducts.forEach((product, productIndex) => {
        formData.orderProducts.push({ productId: product.id, productProperties: [] })
        product.productProperties.forEach(productProperty => {
          formData.orderProducts[productIndex].productProperties.push({
            productPropertyId: productProperty.id,
            val: productProperty.val
          })
        })
      })
      request({ ...this.api.addOrder, params: formData }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.model.orderProducts = []
          this.totalPrice = []
          this.model.amount = 0
          this.sendMsg(res.data.orderNo)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    sendMsg(orderNo) {
      request({ ...this.api.sendMsg, urlReplacements: [{ substr: '{orderNo}', replacement: orderNo }] }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  },
  beforeMount() {
    // 浅克隆
    for (let key in this.taskData) {
      if (key === 'customerId') {
        this.customerId = this.taskData[key]
      } else if (key === 'campaignId') {
        this.campaignId = this.taskData[key]
      }
    }
    this.getProducts()
  },
  watch: {
    totalPriceLength() {
      let amount = 0
      for (let i = 0; i < this.totalPrice.length; i++) {
        amount += this.totalPrice[i]
      }
      this.model.amount = amount
    },
    deep: true
  }
}
</script>
<style lang="scss" scoped>
.text-align-right {
  text-align: right;
}
</style>
