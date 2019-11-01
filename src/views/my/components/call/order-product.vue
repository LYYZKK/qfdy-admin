<template>
  <a-spin :spinning="spinning">
    <a-card :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="单价">
              <span class="bold c-red">￥ {{ product.price }}</span>
            </a-form-item>
          </a-col>
          <a-col
            v-bind="formColResponsiveCfg"
            v-for="(propertItem,propertIndex) in product.productProperties"
            :key="propertIndex"
          >
            <a-form-item v-bind="formItemResponsiveCfg">
              <span slot="label">
                <j-ellipsis :value="propertItem.name" :length="callChatStatus === 'open' ? 2 : 4" />
                <a-tooltip :title="propertItem.remark" v-if="propertItem.remark">
                  <a-icon type="info-circle" />
                </a-tooltip>
              </span>
              <template>
                <j-ellipsis
                  v-if="propertItem.showOrInput===1"
                  :value="propertItem.val"
                  :length="callChatStatus === 'open' ? 10 : 11"
                />
              </template>
              <template v-if="propertItem.type==='text'">
                <a-input
                  v-if="propertItem.showOrInput===0"
                  type="text"
                  v-decorator="['productProperties['+propertIndex+'].val', {rules:propertItem.isRequired===0?[{}]:[{required: true, message: `请输入${propertItem.name}!` }]}]"
                />
              </template>
              <template v-if="propertItem.type==='select'">
                <a-select
                  type="select"
                  v-decorator="['productProperties['+propertIndex+'].val', {rules:propertItem.isRequired===0?[{}]:[{required: true, message: `请输入${propertItem.name}!` }]}]"
                >
                  <a-select-option
                    v-for="(selectOpt,selectOptIndex) in JSON.parse(propertItem.val)"
                    :key="selectOptIndex"
                    :value="selectOpt.value"
                  >{{ selectOpt.label }}</a-select-option>
                </a-select>
              </template>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="20" />
          <a-col :span="4">
            <a-button type="primary" @click="handleBuy">购买商品</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-spin>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { Row, Col, Card, Button, Input, Form, Spin, InputNumber, Tooltip, Icon, Select } from 'ant-design-vue'
import { mapState } from 'vuex'

export default {
  name: 'OrderProduct',
  mixins: [mixinDevice, KeepAliveMixin],
  components: {
    JEllipsis,
    ARow: Row,
    ACol: Col,
    ACard: Card,
    AButton: Button,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AInputNumber: InputNumber,
    ASpin: Spin,
    ATooltip: Tooltip,
    AIcon: Icon,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    productIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      spinning: false,
      form: this.$form.createForm(this),
      formColResponsiveCfg: {
        xs: 24,
        md: 8,
        sm: 8,
        lg: 24,
        xl: 8,
        xxl: 8
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 9 },
          md: { span: 9 },
          lg: { span: 9 },
          xl: { span: 9 },
          xxl: { span: 9 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 },
          md: { span: 15 },
          lg: { span: 15 },
          xl: { span: 15 },
          xxl: { span: 15 }
        }
      },
      validatorRules: {
        productNum: { rules: [{ required: true, message: '请输入数量!' }] }
      },
      productDetail: {},
      api: {
        getProducts: {
          url: '/contact/campaigns/{id}/products'
        },
        getProductDetailById: {
          url: '/order/products/{id}'
        }
      }
    }
  },
  computed: {
    ...mapState({
      callChatStatus: state => state.my.callChatStatus
    })
  },
  methods: {
    changeFormLayout(val) {
      if (val === 'open') {
        this.formColResponsiveCfg = {
          xs: 24,
          md: 8,
          sm: 8,
          lg: 8,
          xl: 8,
          xxl: 8
        }
      } else {
        this.formColResponsiveCfg = {
          xs: 24,
          md: 6,
          sm: 6,
          lg: 6,
          xl: 6,
          xxl: 6
        }
      }
    },
    handleBuy() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.productDetail.productProperties = this.product.productProperties.map((item, index) => {
            let productProperties = item
            if (values.productProperties && values.productProperties[index]) {
              productProperties.val = values.productProperties[index].val
            }
            return productProperties
          })
          this.$emit('buy', this.productDetail)
        }
      })
    }
  },
  beforeMount() {
    this.productDetail = this.product
    this.changeFormLayout(this.callChatStatus)
  },
  watch: {
    callChatStatus(val) {
      this.changeFormLayout(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.text-align-right {
  text-align: right;
}
</style>
