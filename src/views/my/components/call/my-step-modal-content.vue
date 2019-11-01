<template>
  <a-spin :spinning="confirmLoading">
    <a-card :bordered="false" title="基本信息">
      <call-chat-content v-if="operateType==='wechat'" />
      <div v-if="operateType==='phone'">
        <a-form :form="form" :class="[['phone'].includes(operateType) ? 'view-form' : null]">
          <a-row :gutter="16">
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="客户姓名">
                <template>{{ model.customerName }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="通话类型">
                <a-tag
                  :color="model.callType===0?'cyan':model.callType===1?'blue':model.callType===2?'blue':model.callType===3?'blue':''"
                >{{ model.callType===0?'呼出':model.callType===1?'呼入':model.callType===2?'转接':model.callType===3?'三方':'' }}</a-tag>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="接触人">
                <template>{{ getRealNameById()[model.createBy] }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="是否接通">
                <a-badge
                  :status="model.status==='0'?'error':'success'"
                  :text="model.status==='0'?'未接通':'已接通'"
                ></a-badge>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="接触时间">
                <template>{{ model.createAt }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="主叫号码">
                <template>{{ model.callerNumber }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="被叫号码">
                <template>{{ model.calleeNumber }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg" v-if="model.callType===0">
              <a-form-item v-bind="formItemResponsiveCfg" label="拨打时间">
                <template>{{ model.callTime }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="接听时间">
                <template>{{ model.answerTime }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="响铃时长">
                <template>{{ model.ringDuration }} 秒</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="挂断时间">
                <template>{{ model.hangUpTime }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="通话时长">
                <template>{{ model.callDuration }} 秒</template>
              </a-form-item>
            </a-col>
            <a-col
              class="gutter-row"
              v-bind="formColResponsiveCfg"
              v-if="model.callType===1||model.callType===2||model.callType===3"
            >
              <a-form-item v-bind="formItemResponsiveCfg" label="响铃时间">
                <template>{{ model.ringTime }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" v-bind="formColResponsiveCfg">
              <a-form-item v-bind="formItemResponsiveCfg" label="描述">
                <template>{{ model.description }}</template>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="15">
              <a-form-item v-bind="{labelCol: {span:4}, wrapperCol:{span:20} }" label="录音">
                <template>
                  <vue-plyr
                    v-if="showPlayer&&model.soundRecordUrl"
                    ref="plyr"
                    class="audio-style"
                    :options="option"
                  >
                    <audio>
                      <source :src="model.soundRecordUrl" />
                    </audio>
                  </vue-plyr>
                  <div v-if="!model.soundRecordUrl">无录音</div>
                </template>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" title="订单信息">
      <div class="order">
        <!-- table区域-begin -->
        <div>
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
            @expand="handleExpanded"
          >
            <div slot="status" slot-scope="text">
              <a-tag :color="text===0?'orange':'green'">{{ text === 0 ? '未完成' : '已完成' }}</a-tag>
            </div>
            <div slot="amount" slot-scope="text">
              <span class="bold c-red">{{ '￥ '+text }}</span>
            </div>
            <span slot="action" slot-scope="text, record">
              <a-button type="link" icon="eye" @click="handleShow(record)">查看</a-button>
            </span>
            <div slot="expandedRowRender" slot-scope="expandedRowRender,index">
              <a-row class="expandedRow">
                <today-order-model-content :ref="'todayOrderModelContent'+index" />
              </a-row>
            </div>
          </a-table>
        </div>
      </div>
    </a-card>
  </a-spin>
</template>

<script>
import { Col, Spin, Row, Form, Badge, Tag, Table, Card } from 'ant-design-vue'
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import ModalMixin from '@/mixins/ModalMixin'
import callChatContent from '@/views/my/components/call/call-chat-section/call-chat-content.vue'
import todayOrderModelContent from '@/views/my/modules/contact-task/today-order-model-content'
import { mapGetters } from 'vuex'
import JEllipsis from '@/components/jeecg/JEllipsis'

export default {
  name: 'StepModalContent',
  props: {
    recordId: {
      type: Number,
      default: null
    }
  },
  mixins: [ModalMixin, ListMixin, DictMixin],
  components: {
    todayOrderModelContent,
    callChatContent,
    ARow: Row,
    ACol: Col,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    ABadge: Badge,
    ATag: Tag,
    ATable: Table,
    ACard: Card,
    JEllipsis
  },
  data() {
    return {
      operateType: '',
      api: {
        getById: {
          url: '/contact/phone-records?recordId={id}'
        }
      },
      formColResponsiveCfg: {
        xs: 24,
        sm: 12
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
          md: { span: 6 },
          lg: { span: 5 },
          xl: { span: 5 },
          xxl: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
          md: { span: 16 },
          lg: { span: 17 },
          xl: { span: 17 },
          xxl: { span: 17 }
        }
      },
      dictCodes: ['pay_type'],
      option: { i18n: { normal: '1×', speed: '播放速度' } },
      showPlayer: false,
      filters: [{ field: 'contactRecordId', rule: 'eq', val: this.recordId }],
      // 订单部分的变量
      defColumns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => {
            // expand事件无法获取index，增加index属性以判断更新哪行的接触历史数据
            this.dataSource[index]['index'] = index
            return parseInt(index) + 1
          }
        },
        {
          title: '订单号',
          align: 'center',
          dataIndex: 'orderNo'
        },
        {
          title: '订单金额',
          align: 'center',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '支付方式',
          align: 'center',
          dataIndex: 'payType',
          customRender: text => {
            return this.DICT_SHOW_RENDER('pay_type', text)
          }
        },
        {
          title: '备注',
          align: 'center',
          width: 400,
          dataIndex: 'remark',
          customRender: text => {
            return <j-ellipsis value={text ? text : ''} length={20} />
          }
        },
        {
          title: '操作人',
          align: 'center',
          dataIndex: 'updateBy',
          customRender: text => {
            return this.getRealNameById()[text]
          }
        },
        {
          title: '操作时间',
          align: 'center',
          dataIndex: 'updateAt'
        }
      ],
      url: {
        list: '/order/orders'
      }
    }
  },
  methods: {
    ...mapGetters(['getRealNameById']),
    dealModelAfterGetById() {
      this.showPlayer = true
    },
    beforeClose() {
      this.showPlayer = false
    },
    handleExpanded(expanded, row) {
      if (expanded) {
        this.$nextTick(() => {
          this.$refs['todayOrderModelContent' + row.index].show(row)
        })
      }
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
