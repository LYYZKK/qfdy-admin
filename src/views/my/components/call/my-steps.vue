<template>
  <a-row id="my-steps" :class="tablet?'pad':device">
    <div class="btn left-btn" v-if="upBtnVisible" @click="handleUp">
      <a-icon :type="tablet||device==='mobile'?'up':'left'" />
    </div>
    <a-spin :spinning="loading">
      <!-- 没有接触记录 -->
      <a-row v-if="!stepInfo || stepInfo.length === 0" type="flex" justify="center">
        <a-col v-show="loading === false">暂无接触记录</a-col>
      </a-row>

      <!-- 多行显示接触记录 -->
      <template v-if="stepInfo && stepInfo.length > 0 &&stepInfo[0].length">
        <a-col v-bind="columuLayout" v-for="(allStep,colIndex) in stepInfo" :key="colIndex">
          <a-steps
            :direction="direction?direction:tablet?'vertical':device==='mobile'?'vertical':'horizontal'"
            class="step-multi-rows"
          >
            <a-step
              v-for="(stepItem,rowIndex) in allStep"
              :key="rowIndex"
              :description="stepItem.time"
              :status="stepItem.stepStatus"
              class="step-item"
            >
              <j-ellipsis :value="stepItem.title" slot="title" class="step-title" />
              <a-popover slot="progressDot" overlayClassName="customer-view-step-tip">
                <template slot="content">
                  <div class="step-item-tip-content">
                    <a-row>
                      <a-col :span="12">
                        <b>电话进线</b>
                      </a-col>
                      <a-col class="detail" :span="12">
                        <a-button
                          type="link"
                          icon="eye"
                          @click="handleShowDetail(stepItem,rowIndex)"
                        >详情</a-button>
                      </a-col>
                    </a-row>
                    <a-spin :spinning="timesLoading">
                      <template v-if="stepItem.status==='1'">
                        <a-row v-if="stepItem.callType===0">
                          <span class="bold">拨打时间：</span>
                          <span>{{ stepItem.callTime }}</span>
                        </a-row>
                        <a-row
                          v-if="stepItem.callType===1||stepItem.callType===2||stepItem.callType===3"
                        >
                          <span class="bold">响铃时间：</span>
                          <span>{{ stepItem.ringTime }}</span>
                        </a-row>
                        <a-row>
                          <span class="bold">接听时间：</span>
                          <span>{{ stepItem.answerTime }}</span>
                        </a-row>
                        <a-row>
                          <span class="bold">响铃时长：</span>
                          <span>{{ stepItem.ringDuration }} 秒</span>
                        </a-row>
                        <a-row>
                          <span class="bold">挂断时间：</span>
                          <span>{{ stepItem.hangUpTime }}</span>
                        </a-row>
                        <a-row>
                          <span class="bold">通话时长：</span>
                          <span>{{ stepItem.callDuration }} 秒</span>
                        </a-row>
                      </template>
                      <template v-if="stepItem.status==='0'">
                        <a-badge status="error" text="未接通"></a-badge>
                      </template>
                    </a-spin>
                  </div>
                </template>
                <a-avatar
                  :size="40"
                  class="step-icon"
                  @mouseenter="handleShowTimes({stepItem:stepItem,colIndex:colIndex,rowIndex:rowIndex})"
                >
                  <a-icon
                    :type="stepItem.icon"
                    theme="filled"
                    :class="stepItem.prStatus===0?'c-red':''"
                  />
                </a-avatar>
              </a-popover>
            </a-step>
          </a-steps>
        </a-col>
      </template>

      <!-- 单行显示接触记录 -->
      <a-col v-if="stepInfo && stepInfo.length > 0 && !stepInfo[0].length">
        <a-steps
          :direction="direction?direction:tablet?'vertical':device==='mobile'?'vertical':'horizontal'"
          class="step-row"
        >
          <a-step
            v-for="(stepItem,rowIndex) in stepInfo"
            :key="rowIndex"
            :description="stepItem.time"
            :status="stepItem.stepStatus"
            class="step-item"
          >
            <j-ellipsis
              :value="stepItem.title?stepItem.title:'无小结'"
              slot="title"
              class="step-title"
            />
            <a-popover slot="progressDot" overlayClassName="customer-view-step-tip">
              <template slot="content">
                <div class="step-item-tip-content">
                  <a-row>
                    <a-col :span="12">
                      <a-tag
                        :color="stepItem.callType===0?'cyan':stepItem.callType===1?'blue':stepItem.callType===2?'blue':stepItem.callType===3?'blue':''"
                      >{{ stepItem.callType===0?'呼出':stepItem.callType===1?'呼入':stepItem.callType===2?'转接':stepItem.callType===3?'三方':'' }}</a-tag>
                    </a-col>
                    <a-col class="detail" :span="12"></a-col>
                  </a-row>
                  <a-spin :spinning="timesLoading">
                    <template v-if="stepItem.status==='1'">
                      <a-row>
                        <span class="bold">接听时间：</span>
                        <span>{{ stepItem.answerTime }}</span>
                      </a-row>
                      <a-row>
                        <span class="bold">通话时长：</span>
                        <span>{{ stepItem.callDuration }} 秒</span>
                      </a-row>
                      <a-row
                        v-if="stepItem.callType===1||stepItem.callType===2||stepItem.callType===3"
                      >
                        <span class="bold">响铃时间：</span>
                        <span>{{ stepItem.ringTime }}</span>
                      </a-row>
                      <a-row>
                        <span class="bold">响铃时长：</span>
                        <span>{{ stepItem.ringDuration }} 秒</span>
                      </a-row>
                      <a-row v-if="stepItem.callType===0">
                        <span class="bold">拨打时间：</span>
                        <span>{{ stepItem.callTime }}</span>
                      </a-row>
                      <a-row>
                        <span class="bold">挂断时间：</span>
                        <span>{{ stepItem.hangUpTime }}</span>
                      </a-row>
                    </template>
                    <template v-if="stepItem.status==='0'">
                      <a-badge status="error" text="未接通"></a-badge>
                      <a-row
                        v-if="stepItem.callType===1||stepItem.callType===2||stepItem.callType===3"
                      >
                        <span class="bold">响铃时间：</span>
                        <span>{{ stepItem.ringTime }}</span>
                      </a-row>
                      <a-row>
                        <span class="bold">响铃时长：</span>
                        <span>{{ stepItem.ringDuration }} 秒</span>
                      </a-row>
                      <a-row v-if="stepItem.callType===0">
                        <span class="bold">拨打时间：</span>
                        <span>{{ stepItem.callTime }}</span>
                      </a-row>
                      <a-row>
                        <span class="bold">挂断时间：</span>
                        <span>{{ stepItem.hangUpTime }}</span>
                      </a-row>
                    </template>
                  </a-spin>
                  <a-row>
                    <a-col :span="12"></a-col>
                    <a-col class="detail" :span="12">
                      <a-button
                        type="link"
                        icon="eye"
                        @click="handleShowDetail(stepItem,rowIndex)"
                      >详情</a-button>
                    </a-col>
                  </a-row>
                </div>
              </template>
              <a-avatar
                :size="40"
                class="step-icon"
                @mouseenter="handleShowTimes({stepItem:stepItem,rowIndex:rowIndex})"
              >
                <a-icon
                  :type="stepItem.icon"
                  theme="filled"
                  :class="stepItem.prStatus===0?'c-red':''"
                />
              </a-avatar>
            </a-popover>
          </a-step>
        </a-steps>
      </a-col>
    </a-spin>
    <div class="btn right-btn" v-if="downBtnVisible" @click="handleDown">
      <a-icon :type="tablet||device==='mobile'?'down':'right'" />
    </div>
    <step-modal ref="modalForm" />
  </a-row>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import { Row, Icon, Col, Steps, Popover, Avatar, Spin, Tag, Badge, Button } from 'ant-design-vue'
import JEllipsis from '@/components/jeecg/JEllipsis'
import stepModal from './my-step-modal.vue'
import { request } from '@api'
import constantConfig from '@/config/constant.config'

export default {
  name: 'MySteps',
  props: {
    getByCustomerId: {
      type: String,
      default: ''
    },
    getTimesById: {
      type: String,
      default: ''
    },
    customerId: {
      type: Number,
      default: null
    },
    userId: {
      type: Number,
      default: null
    },
    // 控制组件竖直还是水平摆放步骤
    direction: {
      type: String,
      default: null
    },
    // 控制是否分行,不传默认不分行
    multipleRows: {
      type: Boolean,
      default: false
    },
    // multipleRows=true时为每行显示多少个步骤（不分页），multipleRows=false时为pageSize
    stepSize: {
      type: Number,
      default: null
    }
  },
  mixins: [mixinDevice, KeepAliveMixin],
  components: {
    stepModal,
    ARow: Row,
    AIcon: Icon,
    ASteps: Steps,
    AStep: Steps.Step,
    APopover: Popover,
    ACol: Col,
    AAvatar: Avatar,
    ASpin: Spin,
    ATag: Tag,
    ABadge: Badge,
    AButton: Button,
    JEllipsis
  },
  data() {
    return {
      loading: false,
      timesLoading: false,
      columuLayout: {
        xs: { span: 12 },
        sm: { span: 12 },
        md: { span: 8 },
        lg: { span: 24 },
        xl: { span: 24 },
        xxl: { span: 24 }
      },
      stepInfo: [],
      api: {
        getByCustomerId: {
          url: this.getByCustomerId
        },
        getTimesById: {
          url: this.getTimesById
        }
      },
      pageNo: 1,
      totalPage: null,
      upBtnVisible: false,
      downBtnVisible: true,
      quertParams: {
        fields: 'id,customerName,time,summaryItemName',
        conditions: [],
        sorts: [{ field: 'updateAt', direction: 'desc' }],
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    initStepInfo(stepData) {
      const len = stepData.length
      let stepInfo = []
      let lineNum = len % this.stepSize === 0 ? len / this.stepSize : Math.floor(len / this.stepSize + 1)
      for (let i = 0; i < lineNum; i++) {
        let temp = stepData.slice(i * this.stepSize, i * this.stepSize + this.stepSize)
        // 防止改变原数组
        stepInfo.push(JSON.parse(JSON.stringify(temp)))
      }
      return stepInfo
    },
    getRecordsByCustomerId({ customerId, pageNo = 1 }) {
      this.loading = true
      this.quertParams.conditions = JSON.stringify(
        this.userId
          ? [{ field: 'customerId', rule: 'eq', val: customerId }, { field: 'createBy', rule: 'eq', val: this.userId }]
          : [{ field: 'customerId', rule: 'eq', val: customerId }]
      )
      this.quertParams.pageNo = pageNo
      if (this.multipleRows) {
        this.quertParams.pageSize = constantConfig.MAX_PAGE_SIZE
      } else {
        this.quertParams.pageSize = this.stepSize ? this.stepSize : 10
      }
      request({
        ...this.api.getByCustomerId,
        params: this.quertParams
      }).then(res => {
        if (res.success) {
          this.loading = false
          this.totalPage = res.page.totalPage
          this.stepInfo = []
          res.data.forEach(item => {
            this.stepInfo.push({
              icon: item.type === '1' ? 'phone' : item.type === '1' ? 'wechat' : item.type === '3' ? 'mail' : '',
              type: item.type, // 接触类型，电话(1)、微信(2)、短信(3)
              title: item.summaryItemName,
              time: item.time,
              stepStatus: item.finishStatus === '0' ? 'process' : 'finish', // 结束状态，未结束(0)、已结束(1)
              summaryId: item.summaryItemId,
              recordId: item.recordId,
              prStatus: item.prStatus
            })
          })
          if (this.multipleRows) {
            this.stepInfo = this.initStepInfo(this.stepInfo)
          }
          if (pageNo === 1 && res.page.totalPage > 1) {
            this.downBtnVisible = true
          } else if (pageNo === 1 && res.page.totalPage <= 1) {
            this.upBtnVisible = false
            this.downBtnVisible = false
          }
        }
      })
    },
    handleShowDetail(stepItem) {
      this.$refs.modalForm.title = '接触历史详情'
      this.$refs.modalForm.operateType =
        stepItem.type === '1' ? 'phone' : stepItem.type === '2' ? 'wechat' : stepItem.type === '3' ? 'mail' : ''
      this.$refs.modalForm.visible = true
      this.$refs.modalForm.handleShowDetail(stepItem)
    },
    handleShowTimes({ stepItem, colIndex, rowIndex }) {
      this.timesLoading = true
      request({ ...this.api.getTimesById, params: { recordId: stepItem.recordId } }).then(res => {
        if (res.success) {
          if (this.stepInfo && this.stepInfo.length > 0 && this.stepInfo[0].length) {
            this.stepInfo[colIndex][rowIndex] = { ...this.stepInfo[colIndex][rowIndex], ...res.data }
          } else {
            this.stepInfo[rowIndex] = { ...this.stepInfo[rowIndex], ...res.data }
          }
          this.timesLoading = false
        }
      })
    },
    handleDown() {
      this.pageNo++
      this.getRecordsByCustomerId({ customerId: this.customerId, pageNo: this.pageNo })
    },
    handleUp() {
      this.pageNo--
      this.getRecordsByCustomerId({ customerId: this.customerId, pageNo: this.pageNo })
    }
  },
  watch: {
    pageNo(val) {
      if (val > 1) {
        this.upBtnVisible = true
      }
      if (val === 1) {
        this.upBtnVisible = false
      }
      if (val == this.totalPage) {
        this.downBtnVisible = false
      }
      if (val < this.totalPage) {
        this.downBtnVisible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#my-steps {
  height: 50px;
  margin-top: 20px;
  padding: 0 30px;
  ::v-deep .ant-steps-item-title {
    line-height: normal;
  }
  .step-title {
    font-size: 14px;
  }
  .ant-avatar {
    z-index: 1;
  }
  .btn {
    color: #fff;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    background: rgba(0, 0, 0, 0.1);
    z-index: 2;
    padding: 25px 5px;
    height: 50%;
    display: flex;
    align-items: center;
    transition: background-color 0.5s;
    cursor: pointer;
    &.left-btn {
      left: 0;
      & > i {
        transform: scale(1, 2.5);
      }
    }
    &.right-btn {
      right: 0;
      & > i {
        transform: scale(1, 2.5);
      }
    }
    &:hover {
      background: rgba(0, 0, 0, 0.4);
    }
  }
  .ant-steps {
    ::v-deep .ant-steps-item-icon {
      border: none;
      line-height: 40px;
      height: 40px;
      width: 40px;
    }
    .ant-steps-item-description {
      font-size: 12px;
    }
  }
  &::-webkit-scrollbar {
    display: none;
  }
  .step-icon {
    color: #70c0e0;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    border-color: rgba(0, 0, 0, 0.09);
  }
  .doughnuts-container {
    margin-top: 10px;
    .ant-card {
      border: none;
    }
    #doughnuts1,
    #doughnuts2 {
      background: #fff;
      width: 100%;
    }
  }
  .hotmenuitem-container {
    margin-top: 10px;
    & > div {
      padding: 10px;
      background: #fff;
      .hotmenuitem-type {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        background: #eef2f4;
      }
      .hotmenuitem-content {
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
  &.mobile,
  &.pad {
    background: #fff;
    .btn {
      left: 0;
      right: 0;
      transform: none;
      text-align: center;
      padding: 5px 5px;
      height: 40px;
      justify-content: center;
      &.left-btn {
        top: 0;
        & > i {
          font-size: 1.5em;
          transform: scale(3.5, 1);
        }
      }
      &.right-btn {
        top: auto;
        bottom: 0;
        & > i {
          font-size: 1.5em;
          transform: scale(3.5, 1);
        }
      }
    }
    &::-webkit-scrollbar {
      display: block;
    }
  }
}
</style>
<style lang="scss">
/*
popover为在组件外部插入的元素，在全局修改
*/
.customer-view-step-tip {
  // .ant-popover-arrow {
  //   border-right-color: #70c0e0 !important;
  //   border-bottom-color: #70c0e0 !important;
  // }
  // .ant-popover-inner {
  //   background: #fff;
  // }
  .step-item-tip-content {
    width: 230px;
    // color: #fff;
    a {
      text-decoration: underline;
      // color: #fff;
    }
    .detail {
      text-align: right;
    }
  }
}
</style>
