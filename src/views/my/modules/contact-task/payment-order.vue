<template>
  <a-layout id="payment-order">
    <a-layout-header class="p-0 ant-header-fixedHeader">
      <div class="header light" :class="store.getters.theme">Wise CRM 呼叫中心运营平台</div>
    </a-layout-header>
    <a-layout-content class="p-10 p-b-0 p-t-74">
      <a-card :bordered="false" title="订单详情" class="bold">
        <a-row type="flex" justify="space-between" class="m-b-20">
          <span>订单号</span>
          <span>{{ orderData.orderCode }}</span>
        </a-row>
        <a-row type="flex" justify="space-between" class="m-b-20">
          <span>订单金额</span>
          <span class="price">￥ {{ orderData.orderAmount }}</span>
        </a-row>
        <a-row class="m-b-20">
          <a-row type="flex" justify="space-between">
            <span>商品</span>
            <span>数量</span>
          </a-row>
          <a-row
            type="flex"
            justify="space-between"
            v-for="(item,index) in orderData.productList"
            :key="index"
            class="font-weight-normal c-g9"
          >
            <span>{{ item.name }}</span>
            <span>{{ item.count }}</span>
          </a-row>
        </a-row>
        <a-row>
          <a-row>订单描述</a-row>
          <a-row class="font-weight-normal c-g9">{{ orderData.remark }}</a-row>
        </a-row>
      </a-card>
      <a-card :bordered="false" title="请选择支付方式：" class="m-t-10">
        <a-radio-group v-model="paymentType" class="payment-type">
          <a-row type="flex" justify="space-between" align="middle">
            <a-icon class="alipay" type="alipay-circle" />
            <span>支付宝</span>
            <a-radio value="0"></a-radio>
          </a-row>
          <a-row type="flex" justify="space-between" align="middle">
            <a-icon class="wechat" type="wechat" />
            <span>微信支付</span>
            <a-radio value="1"></a-radio>
          </a-row>
        </a-radio-group>
      </a-card>
    </a-layout-content>
    <a-layout-footer class="p-10 p-b-0">
      <a-row>
        <a-button type="primary" block>立即支付</a-button>
      </a-row>
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { Layout, Card, Row, Col, Radio, Icon, Button } from 'ant-design-vue'
import store from '@/store'

export default {
  name: 'PaymentOrder',
  components: {
    ALayout: Layout,
    ALayoutHeader: Layout.Header,
    ALayoutContent: Layout.Content,
    ALayoutFooter: Layout.Footer,
    ACard: Card,
    ACardMeta: Card.Meta,
    ARow: Row,
    ACol: Col,
    ARadioGroup: Radio.Group,
    ARadio: Radio,
    AIcon: Icon,
    AButton: Button
  },
  data() {
    return {
      store: store,
      orderData: {
        orderCode: '19851981984',
        orderAmount: '123',
        productList: [{ name: '手机', count: '10' }, { name: '平板', count: '15' }, { name: '显示器', count: '20' }],
        remark: 'asdasdasdfwfwefwef'
      },
      paymentType: null
      // needAliveDataKeys: ['queryParam']
    }
  },
  methods: {},
  created() {},
  beforeMount() {},
  watch: {
    paymentType(val) {
      console.log(val)
    }
  }
}
</script>

<style lang='scss' scoped>
$height: 59px;

#payment-order {
  .header {
    z-index: 2;
    color: white;
    height: $height;
    background-color: #1890ff;
    transition: background 300ms;
    text-align: center;
    font-size: 18px;
    font-weight: bold;

    /* dark 样式 */
    &.dark {
      color: #000000;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
      background-color: white !important;
    }
  }
  .ant-layout-header {
    height: $height;
    line-height: $height;
  }
  .price {
    color: #f5222d;
  }
  .ant-header-fixedHeader {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.2s;
  }
  .font-weight-normal {
    font-weight: normal;
  }
  .payment-type {
    width: 100%;
    & > .ant-row-flex {
      height: 50px;
      line-height: 50px;
      &:first-child {
        border-bottom: 1px solid #e8e8e8;
      }
    }
    svg {
      height: 30px;
      width: 30px;
    }
    .alipay {
      color: #19a0e4;
    }
    .wechat {
      color: #1ec522;
    }
  }
}
</style>
