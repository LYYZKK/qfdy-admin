<template>
  <a-spin :spinning="loading">
    <a-card id="customer-favorite" :bordered="false" :class="tablet?'pad':device">
      <div class="favorites-container">
        <div v-for="(item,index) in favorites" :key="index">
          <div class="p-10">
            <section>
              <a-row class="favorite-content">{{ item.hobby }}</a-row>
            </section>
            <footer>
              <a-row class="c-g9">
                <a-col :span="4">
                  <span>添加人:</span>
                  <span class="m-l-5">{{ getRealNameById()[item.createBy] }}</span>
                </a-col>
                <a-col :span="8">
                  <span>添加时间:</span>
                  <span class="m-l-5">{{ item.createAt }}</span>
                </a-col>
              </a-row>
            </footer>
          </div>
        </div>
      </div>
      <a-form class="m-t-10">
        <a-form-item :wrapper-col="{ span: 24 }">
          <a-textarea rows="2" v-model="favoriteItem" placeholder="请输入客户喜好" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="addFavorites">添加</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-spin>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import { Row, Col, Card, Form, Input, Button, Divider, Spin } from 'ant-design-vue'
import { request } from '@/api'
import { mapState, mapGetters } from 'vuex'
import constantConfig from '@/config/constant.config'

export default {
  name: 'CustomerFavorite',
  mixins: [mixinDevice, KeepAliveMixin],
  components: {
    ARow: Row,
    ACol: Col,
    ACard: Card,
    ACardMeta: Card.Meta,
    AForm: Form,
    AFormItem: Form.Item,
    ATextarea: Input.TextArea,
    AButton: Button,
    ADivider: Divider,
    ASpin: Spin
  },
  computed: {
    ...mapState({
      customerInfo: state => state.my.customerInfo
    })
  },
  data() {
    return {
      favoriteItem: null,
      favorites: [],
      loading: false,
      params: {
        fields: 'id,customerId,hobby,createBy,createAt',
        conditions: null,
        sorts: JSON.stringify([{ field: 'updateAt', direction: 'desc' }]),
        pageNo: 1,
        pageSize: constantConfig.MAX_PAGE_SIZE
      },
      api: {
        getHobbyByCustomerId: {
          url: '/customer/customer-hobby'
        },
        setCustomerHobby: {
          url: '/customer/customer-hobby',
          method: 'post'
        }
      }
    }
  },
  methods: {
    ...mapGetters(['getRealNameById']),
    addFavorites() {
      const params = {
        customerId: this.customerInfo.id,
        hobby: this.favoriteItem
      }
      request({ ...this.api.setCustomerHobby, params: params }).then(res => {
        if (res.success) {
          this.getHobbyByCustomerId()
          this.favoriteItem = null
        }
      })
    },
    getHobbyByCustomerId() {
      this.params.conditions = JSON.stringify([{ field: 'customerId', rule: 'eq', val: this.customerInfo.id }])
      this.loading = true
      request({ ...this.api.getHobbyByCustomerId, params: this.params }).then(res => {
        if (res.success) {
          this.loading = false
          this.favorites = res.data
          console.log(res.data)
        }
      })
    }
  },
  beforeMount() {
    console.log('当前客户信息： ', this.customerInfo)
    this.getHobbyByCustomerId()
    this.favorites = this.customerInfo.hobbies
  }
}
</script>
<style lang="scss" scoped>
#customer-favorite {
  textarea.ant-input {
    resize: none;
  }
  .favorites-container {
    max-height: 805px;
    overflow-y: auto;
    .p-10 {
      border-bottom: 1px solid #e8e8e8;
      .favorite-content {
        font-size: 16px;
        font-weight: 600px;
      }
      .c-g9 {
        font-size: 12px;
      }
    }
  }
}
</style>
