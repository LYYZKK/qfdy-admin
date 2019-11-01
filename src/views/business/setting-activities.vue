<template>
  <a-row
    id="setting-activities"
    :class="tablet?'pad':device"
    :style="isDesktop()?`min-height:${viewHeight}px;`:''"
  >
    <a-row class="m-b-15">
      <a-alert
        :message="alertData.message"
        :description="alertData.description"
        type="info"
        showIcon
      />
    </a-row>
    <a-card :bordered="false">
      <a-row>
        <h4 class="bold">一、设置活动基本信息</h4>
        <a-form :form="form">
          <a-form-item label="名称" :label-col="inputLabel" :wrapper-col="{ span: 8 }">
            <a-input
              v-if="['add', 'edit'].includes(operateType)"
              placeholder="请输入名称"
              v-decorator="['name', validatorRules.name]"
            />
            <template v-else>{{ campaignInfo.name }}</template>
          </a-form-item>
          <a-form-item label="说明" :label-col="inputLabel" :wrapper-col="{ span: 12 }">
            <a-textarea
              v-if="['add', 'edit'].includes(operateType)"
              rows="2"
              v-decorator="['description', validatorRules.description]"
            />
            <template v-else>{{ campaignInfo.description }}</template>
          </a-form-item>
        </a-form>
      </a-row>
    </a-card>
    <a-card :bordered="false">
      <a-row class="selling-products-list m-b-15">
        <h4 class="bold">二、选择售卖的商品</h4>
        <a-button
          v-if="['add', 'edit'].includes(operateType)"
          type="dashed"
          icon="plus"
          class="add-product-btn"
          size="small"
          @click="handleAddProducts(productsTableData)"
        >添加商品</a-button>
        <a-row v-for="(item,index) in productsTableData" :key="index">
          <a-col :span="11">
            <j-ellipsis :value="item.name" :length="50" />
          </a-col>
          <a-col :span="2" v-if="['add', 'edit'].includes(operateType)">
            <a-popconfirm title="确定删除吗?" @confirm="() => handleProductDelete(index)">
              <a-button type="link" size="small">删除</a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-row>
    </a-card>
    <a-card :bordered="false">
      <a-row class="channel m-b-15">
        <h4 class="bold">
          三、设置渠道
          <a-tooltip placement="right">
            <template slot="title">
              <div>
                <span>xxx</span>
                <br />
                <span>电话销售渠道用途</span>
              </div>
            </template>
            <a-icon type="info-circle" />
          </a-tooltip>
        </h4>
        <div :class="tablet?'p-l-50':'p-l-27'">
          <a-row class="m-b-15" v-if="['add', 'edit'].includes(operateType)">
            <a-col v-bind="channelSwitchLayout">
              <span>是否使用网络引流</span>
            </a-col>
            <a-col :span="2">
              <a-switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked
                @change="handleSwitchChange"
              />
            </a-col>
          </a-row>
          <div class="channel-table-container">
            <a-row
              v-if="channelVisible&&channelTableData.length||['add', 'edit'].includes(operateType)"
              class="m-b-15"
            >
              <header class="bold">网络引流</header>
              <a-divider />
              <section class="tab-table">
                <a-row class="form-row tab-table-title" :gutter="16">
                  <a-col :span="6">
                    <span class="required-mask">*</span>名称
                  </a-col>
                  <a-col :span="5">
                    <span class="required-mask">*</span>推广代号
                  </a-col>
                  <a-col :span="3">
                    <span class="required-mask">*</span>链接数量
                  </a-col>
                </a-row>
                <a-row :gutter="16" v-for="(item,index) in channelTableData" :key="index">
                  <a-col :span="6">{{ item.name }}</a-col>
                  <a-col :span="5">{{ item.pcCodeScope }}</a-col>
                  <a-col :span="3">{{ item.urlCount }}</a-col>
                  <a-col>
                    <template v-if="['add', 'edit'].includes(operateType)">
                      <a-button
                        type="link"
                        size="small"
                        @click="handleOpenChannelDrawer('edit',item,index)"
                      >编辑</a-button>
                      <a-divider type="vertical" />
                    </template>
                    <a-button type="link" size="small" @click="handleCopyLinkDrawer(item.id)">复制链接</a-button>
                    <template v-if="['add', 'edit'].includes(operateType)">
                      <a-divider type="vertical" />
                      <a-popconfirm
                        title="确定删除吗?"
                        @confirm="() => handleChannelDelete(item.id,index)"
                      >
                        <a-button type="link" size="small">删除</a-button>
                      </a-popconfirm>
                    </template>
                  </a-col>
                </a-row>
                <a-row>
                  <a-button
                    v-if="['add', 'edit'].includes(operateType)"
                    type="dashed"
                    icon="plus"
                    size="large"
                    block
                    @click="handleOpenChannelDrawer('add')"
                  >添加网络引流渠道</a-button>
                </a-row>
              </section>
            </a-row>
            <a-row>
              <header class="bold">电话销售</header>
              <a-divider />
              <section class="telemarketing">
                <a-row>
                  <a-table
                    rowKey="id"
                    :columns="telemarketingTableColumn"
                    :dataSource="telemarketingTableData"
                    class="telemarketing-table"
                    size="small"
                    :bordered="false"
                    :pagination="false"
                    :defaultExpandAllRows="true"
                  >
                    <div slot="customTitle">
                      <span class="required-mask">*</span>呼叫方式
                    </div>
                    <span slot="callType" slot-scope="callType,record">
                      <j-dict-view-tag v-model="record.callType" dictCode="call_skill" />
                    </span>
                    <div slot="action" slot-scope="record">
                      <a-button
                        v-if="['add', 'edit'].includes(operateType)"
                        type="link"
                        size="small"
                        @click="handleOpenChoiceSeatModel(record)"
                      >添加坐席组</a-button>
                    </div>
                    <div slot="expandedRowRender" slot-scope="record">
                      <a-row class="expandedRow">
                        <a-row class="form-row tab-table-title" :gutter="16">
                          <a-col :span="6">坐席组</a-col>
                          <a-col :span="3">呼叫技能</a-col>
                          <a-col :span="3">坐席数量</a-col>
                          <a-col :span="7">说明</a-col>
                          <a-col :span="5" />
                        </a-row>
                        <a-row
                          :gutter="16"
                          v-for="(item,index) in record.expandedRowData"
                          :key="index"
                        >
                          <a-col :span="6">{{ item.name }}</a-col>
                          <a-col :span="3">
                            <j-dict-view-tag
                              v-if="item.skill"
                              v-model="item.skill"
                              dictCode="call_skill"
                            />
                            <j-dict-view-tag
                              v-else
                              v-model="item.usergroupSkill"
                              dictCode="call_skill"
                            />
                          </a-col>
                          <a-col :span="3">{{ item.pax?item.pax:item.userCount }}</a-col>
                          <a-col :span="7">{{ item.description }}</a-col>
                          <a-col :span="5" v-if="['add', 'edit'].includes(operateType)">
                            <!-- <a-button type="link" size="small">编辑</a-button> -->
                            <!-- <a-divider type="vertical" /> -->
                            <a-popconfirm
                              title="确定删除吗?"
                              @confirm="() => handleTelemarketingDelete(index,record.callType)"
                            >
                              <a-button type="link" size="small">删除</a-button>
                            </a-popconfirm>
                          </a-col>
                        </a-row>
                      </a-row>
                    </div>
                  </a-table>
                </a-row>
              </section>
            </a-row>
          </div>
        </div>
      </a-row>
    </a-card>
    <a-row :class="tablet?'footer-btn-container p-l-50':'footer-btn-container p-l-27'">
      <a-button v-if="['add', 'edit'].includes(operateType)" @click="handleCancel">取消</a-button>
      <a-button v-if="['add', 'edit'].includes(operateType)" type="primary" @click="handleSubmit">确定</a-button>
      <a-button @click="handleCancel" v-else>关闭</a-button>
    </a-row>
    <promotion-channel ref="operationChannel" @refresh="afterAddWebChannel" />
    <sale-channel ref="choiceSeat" @refresh="afterAddUserGroup" />
    <copy-link ref="copyLink" />
    <add-products ref="addProducts" @ok="afterAddProducts" />
  </a-row>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import CommonMixin from '@/mixins/CommonMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import PromotionChannel from './modules/promotion-channel'
import SaleChannel from './modules/sale-channel'
import CopyLink from './modules/copy-link'
import addProducts from './modules/add-products'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { request } from '@/api'
import { mapState } from 'vuex'
import {
  Row,
  Col,
  Alert,
  Form,
  Input,
  Button,
  Switch,
  Divider,
  Table,
  Tag,
  Icon,
  Tooltip,
  Popconfirm,
  Card
} from 'ant-design-vue'
export default {
  name: 'SettingActivities',
  mixins: [mixinDevice, CommonMixin, KeepAliveMixin],
  components: {
    JEllipsis,
    JDictViewTag,
    PromotionChannel,
    SaleChannel,
    CopyLink,
    ARow: Row,
    ACol: Col,
    AAlert: Alert,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ATextarea: Input.TextArea,
    AButton: Button,
    ASwitch: Switch,
    ADivider: Divider,
    ATable: Table,
    ATag: Tag,
    AIcon: Icon,
    ATooltip: Tooltip,
    APopconfirm: Popconfirm,
    ACard: Card,
    addProducts
  },
  computed: {
    ...mapState({
      pageList: state => state.tab.pageList,
      linkList: state => state.tab.linkList,
      activePage: state => state.tab.activePage,
      activeRouter: state => state.tab.activeRouter
    }),
    operateType() {
      return this.$route.params.operateType
    },
    campaignId() {
      return this.$route.params.id
    }
  },
  data() {
    return {
      alertData: {
        message: '说明',
        description: '设置售卖的商品，以及网络推广和电销渠道'
      },
      inputLabel: {
        md: 3,
        lg: 1,
        xl: 1,
        xxl: 1
      },
      channelSwitchLayout: {
        md: 5,
        lg: 2,
        xl: 2,
        xxl: 2
      },
      channelVisible: true,
      channelTableData: [],
      productsTableData: [],
      telemarketingTableColumn: [
        {
          dataIndex: 'callType',
          key: 'callType',
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'callType' }
        },
        {
          title: '坐席组数量',
          dataIndex: 'count',
          key: 'count'
        },
        {
          title: '说明',
          dataIndex: 'explain',
          key: 'explain',
          width: 300
        },
        {
          dataIndex: '',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      telemarketingTableData: [
        // {
        //   callType: '1',
        //   count: 0,
        //   explain: '定义负责呼入引流搜集的名单数据的坐席组',
        //   expandedRowData: []
        // },
        {
          callType: '2',
          count: 0,
          explain: '定义负责呼出引流搜集的名单数据的坐席组',
          expandedRowData: []
        }
      ],
      form: this.$form.createForm(this),
      campaignInfo: {},
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入名称' }] }
      },
      api: {
        getProductById: {
          url: '/contact/campaigns/{id}/products'
        },
        getById: {
          url: '/contact/campaigns/{id}/CampaignPcChannel'
        },
        telemarketing: {
          url: '/contact/scusergroup'
        },
        delwebChannel: {
          url: '/contact/promotion-channel/{id}',
          method: 'delete'
        },
        addProductChannel: {
          url: '/contact/campaigns/product-channel',
          method: 'post'
        },
        editProductChannel: {
          url: '/contact/campaigns/product-channel',
          method: 'patch'
        }
      }
    }
  },
  methods: {
    getCampaignDetail() {
      this.getById()
      this.getProdustList()
      this.getTelemarketing()
    },
    // 查询活动详情
    getById() {
      request({ ...this.api.getById, urlReplacements: [{ substr: '{id}', replacement: this.campaignId }] }).then(
        res => {
          if (res.success) {
            this.campaignInfo = res.data
            if (this.operateType === 'edit') {
              this.$nextTick(() => {
                this.form.setFieldsValue({ name: res.data.name, description: res.data.description })
              })
            }
            this.channelTableData = res.data.promotionChannels
          }
        }
      )
    },
    // 查询与该活动关联的商品
    getProdustList() {
      request({ ...this.api.getProductById, urlReplacements: [{ substr: '{id}', replacement: this.campaignId }] }).then(
        res => {
          if (res.success) {
            this.productsTableData = res.data
          }
        }
      )
    },
    // 查询电话销售渠道
    getTelemarketing() {
      request({
        ...this.api.telemarketing,
        params: { campaignId: this.campaignId }
      }).then(res => {
        if (res.success) {
          // this.telemarketingTableData[0].count = res.data.incomingCallSize
          // this.telemarketingTableData[0].expandedRowData = res.data.incomingCall
          // this.telemarketingTableData[1].count = res.data.outboundCallSize
          // this.telemarketingTableData[1].expandedRowData = res.data.outboundCall
          this.telemarketingTableData[0].count = res.data.outboundCallSize
          this.telemarketingTableData[0].expandedRowData = res.data.outboundCall
        }
      })
    },
    // 添加商品
    handleAddProducts(productsTableData) {
      console.log('productsTableData ', productsTableData)
      const checkedProducts = productsTableData.map(item => {
        return item.id
      })
      // 调用子组件中的方法打开抽屉
      this.$refs.addProducts.openSelf(checkedProducts)
    },
    afterAddProducts(tableData) {
      this.productsTableData = tableData
    },
    // 删除产品
    handleProductDelete(index) {
      this.productsTableData.splice(index, 1)
    },
    afterAddWebChannel(val) {
      if (val.operateType === 'add') {
        this.$set(this.channelTableData, this.channelTableData.length, val.data)
      } else {
        this.$set(this.channelTableData, val.channelIndex, val.data)
      }
    },
    // telemarketingTableData index===0 为呼入 index===1 为呼呼出
    afterAddUserGroup(val) {
      if (val.type === 'in') {
        this.telemarketingTableData[0].count = val.data.length
        this.telemarketingTableData[0].expandedRowData = val.data
      } else {
        this.telemarketingTableData[0].count = val.data.length
        this.telemarketingTableData[0].expandedRowData = val.data
      }
    },
    handleSwitchChange(val) {
      this.channelVisible = val
    },
    // 删除网网络渠道
    handleChannelDelete(id, index) {
      var that = this
      request({ ...this.api.delwebChannel, urlReplacements: [{ substr: '{id}', replacement: id }] }).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.channelTableData.splice(index, 1)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    // 删除用户组
    handleTelemarketingDelete(index, callType) {
      if (callType === '1') {
        this.telemarketingTableData[0].expandedRowData.splice(index, 1)
        this.telemarketingTableData[0].count--
      } else if (callType === '2') {
        this.telemarketingTableData[0].expandedRowData.splice(index, 1)
        this.telemarketingTableData[0].count--
      }
    },
    handleOpenChannelDrawer(type, record, index) {
      // 调用子组件中的方法打开抽屉
      this.$refs.operationChannel.openSelf(type, record, index)
    },
    handleOpenChoiceSeatModel(record) {
      // 调用子组件中的方法打开抽屉
      this.$refs.choiceSeat.openSelf(record.callType, record)
    },
    handleCopyLinkDrawer(pcId) {
      // 调用子组件中的方法打开抽屉
      this.$refs.copyLink.openSelf(pcId)
    },
    validateParams(params) {
      let result = {}
      if (params.products && !params.products.length) {
        result = { validate: false, message: '请添加商品' }
      } else if (this.channelVisible && params.promotionChannels && !params.promotionChannels.length) {
        result = { validate: false, message: '请添加推广渠道' }
      } else if (params.incomingCall && !params.incomingCall.length) {
        result = { validate: false, message: '请添加电销渠道' }
      } else if (params.outboundCall && !params.outboundCall.length) {
        result = { validate: false, message: '请添加电销渠道' }
      } else {
        result = { validate: true }
      }
      return result
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        let params = {}
        params['campaign'] = values
        params['products'] = this.productsTableData.map(item => {
          return item.id
        })
        if (this.channelVisible) {
          params['promotionChannels'] = this.channelTableData.map(item => {
            return item.id
          })
        }
        params['saleChannels'] = this.telemarketingTableData
        // params['incomingCall'] = this.telemarketingTableData[0].expandedRowData.map(item => {
        //   return item.id
        // })
        params['outboundCall'] = this.telemarketingTableData[0].expandedRowData.map(item => {
          return item.id
        })
        if (!err) {
          if (!this.validateParams(params)['validate']) {
            if (this.validateParams(params)['message']) this.$message.warning(this.validateParams(params)['message'])
            return false
          }
          if (this.operateType === 'add') {
            request({ ...this.api.addProductChannel, params: params }).then(res => {
              if (res.success) {
                this.handleCancel()
                this.$message.success(res.message)
              } else {
                this.$message.warning(res.message)
              }
            })
          } else if (this.operateType === 'edit') {
            params.campaign['id'] = this.campaignId
            request({ ...this.api.editProductChannel, params: params }).then(res => {
              if (res.success) {
                this.handleCancel()
                this.$message.success(res.message)
              } else {
                this.$message.warning(res.message)
              }
            })
          }
        }
      })
    },
    handleCancel() {
      this.$store.dispatch('CloseTab', { path: this.$route.fullPath })
      this.$router.push({
        name: 'business-activities',
        path: '/business/activities'
      })
    }
  },
  beforeMount() {
    if (['edit', 'show'].includes(this.operateType)) {
      this.getCampaignDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
#setting-activities {
  background: #fff;
  padding: 10px;
  .full-width-btn {
    width: 100%;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }
  textarea.ant-input {
    resize: none;
  }
  .ant-alert {
    padding: 8px 15px 8px 64px;
  }
  .selling-products-list {
    h4 {
      display: inline-block;
      margin-right: 10px;
    }
    .ant-row {
      .ant-col-2 {
        text-align: center;
        vertical-align: middle;
        height: 24px;
        line-height: 24px;
      }
    }
  }
  .channel {
    .channel-table-container {
      width: 60%;
    }
    .tab-table {
      padding-left: 10px;
      .ant-col-5,
      .ant-col-6 {
        height: 32px;
        line-height: 32px;
        text-align: left;
      }
    }
    .telemarketing-table {
      ::v-deep .ant-table {
        border: none;
        td,
        th {
          border: none;
        }
      }
      .expandedRow {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .footer-btn-container {
    .ant-btn {
      margin: 0 5px;
    }
  }
  ::v-deep .ant-alert-with-description {
    padding: 5px 40px !important;

    .ant-alert-icon {
      top: 6px !important;
      left: 10px !important;
    }

    .ant-alert-close-icon {
      top: 6px !important;
    }
  }
  &.pad {
    .p-l-50 {
      padding-left: 50px;
    }
    .selling-products-list {
      & > .ant-row {
        padding-left: 50px;
      }
    }
    .channel {
      .channel-table-container {
        width: 100%;
      }
    }
  }
}
</style>
