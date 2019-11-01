<template>
  <div id="call-phone-section" :class="device">
    <a-layout-header>
      <a-row>
        <a-col v-if="device === 'mobile'" class="call-trigger-container inline-block">
          <a-icon type="bars" @click.native="toggle"></a-icon>
        </a-col>
        <a-col class="header-content inline-block" v-bind="{lg:20,xl:22,xxl:22}">
          <a-row :gutter="8">
            <div class="inline-block">
              <a-col class="inline-block">
                <b>{{ customerInfo.name }}</b>
              </a-col>
              <!-- <a-col class="inline-block">
                <b>北京</b>
              </a-col>-->
              <a-col class="inline-block" v-if="$store.state.cti.outcall">
                <b>{{ $store.state.cti.callee }}</b>
              </a-col>

              <a-col class="inline-block" v-else-if="$store.state.cti.incall">
                <b>{{ $store.state.cti.caller }}</b>
              </a-col>
            </div>
            <!-- <div class="call-reason inline-block">
              <a-col>
                <span>来电原因：</span>
                <b>一般咨询</b>
              </a-col>
            </div>-->
          </a-row>
          <a-row :gutter="8">
            <a-col class="inline-block" v-if="$store.state.cti.ringTime">
              <span>响铃时间：</span>
              <span>{{ $store.state.cti.ringTime }}</span>
            </a-col>
            <a-col class="inline-block" v-if="$store.state.cti.hangUpTime">
              <span>挂断时间：</span>
              <span>{{ $store.state.cti.hangUpTime }}</span>
            </a-col>
            <a-col
              class="inline-block"
              v-if="$store.state.cti.answerTime && $store.state.cti.hangUpTime"
            >
              <span>通话时长：</span>
              <span>{{ diffTalkTime($store.state.cti.answerTime, $store.state.cti.hangUpTime) }} 秒</span>
            </a-col>
          </a-row>
        </a-col>
        <a-col
          v-if="device!=='mobile' && $store.state.my.callChatOpened"
          v-bind="{lg:4,xl:2,xxl:2}"
        >
          <a-icon
            class="call-section-trigger"
            type="menu-fold"
            title="收起聊天区"
            @click.native="closeChatSection()"
          ></a-icon>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content>
      <a-row
        class="button-container"
        v-if="$store.state.cti.logined && $store.state.cti.talkingStatusReasonCodes.includes($store.state.cti.reasoncode)"
      >
        <a-col v-bind="phoneButtonLayout">
          <!-- 转接 start -->
          <span v-if="!$store.state.cti.holdStarted && !$store.state.cti.third">
            <a-popover
              placement="top"
              title="输入转接号码"
              trigger="click"
              class="m-l-8"
              :visible="transferPopFormVisiable"
            >
              <template slot="content">
                <a-form :form="transfer_form">
                  <a-form-item label="转接号码" hasFeedback>
                    <a-input
                      size="small"
                      placeholder="请输入转接号码"
                      v-decorator="['transferNumber', {rules: [{ required: true, message: '请输入转接号码' }, { validator: validateTransferNumber }]}]"
                    />
                  </a-form-item>

                  <a-popconfirm title="确定取消吗?" @confirm="() => hideTransferPopForm()">
                    <a-button size="small">取消</a-button>
                  </a-popconfirm>
                  <a-button type="primary" size="small" class="m-l-5" @click="confirmTransfer">确定</a-button>
                </a-form>
              </template>

              <!-- 已经三方通话过不可使用转接 -->
              <!-- 通话中 && (多方未开始 && 多方未结束) && ((转接已开始 && 转接已取消) || (转接未开始 || 转接已完成)) -->
              <a-button
                type="primary"
                class="transfer-call"
                v-if="$store.state.cti.talkingStatusReasonCodes.includes($store.state.cti.reasoncode) && (!$store.state.cti.conferenceStarted && !$store.state.cti.conferenceCompleted) && !$store.state.cti.conferenceStarted && ((!$store.state.cti.transferStarted && $store.state.cti.transferCancled) || (!$store.state.cti.transferStarted || $store.state.cti.transferCompleted))"
                icon="swap"
                @click="showTransferPopForm"
              >转接</a-button>
            </a-popover>

            <!-- 已登录 && 通话中 && 转接已开始 && 转接响铃中 && 转接未接通 -->
            <a-button
              type="primary"
              class="transfer-call"
              icon="swap"
              v-if="$store.state.cti.transferStarted && $store.state.cti.reasoncode === $store.state.cti.ctiInternalStatusMap.ringback.reasoncode && !$store.state.cti.transferAnswered"
              @click="CancleTransfer"
            >取消转接</a-button>

            <!-- 已登录 && 转接已开始 && 转接已接通 && 转接未完成 -->
            <a-button
              type="primary"
              class="transfer-call"
              icon="check"
              v-if="$store.state.cti.transferStarted && $store.state.cti.transferAnswered && !$store.state.cti.transferCompleted"
              @click="completeTransfer"
            >完成转接</a-button>
          </span>
          <!-- 转接 end -->
        </a-col>
        <a-col v-bind="phoneButtonLayout">
          <!-- 多方通话 start -->
          <span v-if="!$store.state.cti.holdStarted && !$store.state.cti.third">
            <a-popover
              placement="top"
              title="输入多方通话号码"
              trigger="click"
              class="m-l-8"
              :visible="conferencePopFormVisiable"
            >
              <template slot="content">
                <a-form :form="conference_form">
                  <a-form-item label="多方通话号码" hasFeedback>
                    <a-input
                      size="small"
                      placeholder="请输入多方通话号码"
                      v-decorator="['conferenceNumber', {rules: [{ required: true, message: '请输入多方通话号码' }, { validator: validateConferenceNumber }]}]"
                    />
                  </a-form-item>

                  <a-popconfirm title="确定取消吗?" @confirm="() => hideConferencePopForm()">
                    <a-button size="small">取消</a-button>
                  </a-popconfirm>
                  <a-button type="primary" size="small" class="m-l-5" @click="confirmConference">确定</a-button>
                </a-form>
              </template>

              <!-- 已经转接过不可使用多方通话 -->
              <!-- 通话中 && (转接未开始 && 转接未结束) && ((多方通话已开始 && 多方通话已取消) || (多方通话未开始 || 多方通话已完成)) -->
              <a-button
                type="primary"
                class="conference-call"
                v-if="$store.state.cti.talkingStatusReasonCodes.includes($store.state.cti.reasoncode) && (!$store.state.cti.transferStarted && !$store.state.cti.transferCompleted) && ((!$store.state.cti.conferenceStarted && $store.state.cti.conferenceCancled) || (!$store.state.cti.conferenceStarted || $store.state.cti.conferenceCompleted))"
                icon="swap"
                @click="showConferencePopForm"
              >多方通话</a-button>
            </a-popover>

            <!-- 已登录 && 通话中 && 多方通话已开始 && 多方通话响铃中 && 多方通话未接通 -->
            <a-button
              type="primary"
              class="conference-call"
              icon="swap"
              v-if="$store.state.cti.conferenceStarted && $store.state.cti.reasoncode === $store.state.cti.ctiInternalStatusMap.ringback.reasoncode && !$store.state.cti.conferenceAnswered"
              @click="CancleConference"
            >取消多方通话</a-button>

            <!-- 已登录 && 多方通话已开始 && 多方通话已接通 && 多方通话未完成 -->
            <a-button
              type="primary"
              class="conference-call"
              icon="check"
              v-if="$store.state.cti.conferenceStarted && $store.state.cti.conferenceAnswered && !$store.state.cti.conferenceCompleted"
              @click="completeConference"
            >完成多方通话</a-button>
          </span>
          <!-- 多方通话 end -->
        </a-col>

        <a-col v-bind="phoneButtonLayout">
          <!-- 保持 start -->
          <!-- 已登录 && 通话中 && (通话保持未开始 && 通话保持已完成) -->
          <a-button
            type="primary"
            class="hold-call"
            icon="pause"
            @click="holdCall()"
            v-if="$store.state.cti.talkingStatusReasonCodes.includes($store.state.cti.reasoncode) && !$store.state.cti.transferStarted && !$store.state.cti.conferenceStarted && (!$store.state.cti.holdStarted || $store.state.cti.holdCompleted)"
          >保持</a-button>

          <!-- 已登录 && 通话保持已开始 && 通话保持未完成 -->
          <a-button
            type="primary"
            class="hold-call"
            icon="caret-right"
            @click="unHoldCall"
            v-if="$store.state.cti.holdStarted && !$store.state.cti.holdCompleted"
          >取消保持</a-button>
          <!-- 保持 end -->
        </a-col>
        <a-col v-bind="phoneButtonLayout">
          <!-- 已登录 && 通话中 -->
          <a-popconfirm title="确定挂断吗?" @confirm="() => hangup()">
            <a-button
              type="primary"
              class="hangup-call"
              icon="phone"
              v-if="$store.state.cti.talkingStatusReasonCodes.includes($store.state.cti.reasoncode)"
            >挂断</a-button>
          </a-popconfirm>
        </a-col>
        <a-col :span="24">
          <a-divider />
        </a-col>
      </a-row>
      <!-- <a-row class="workform-button-container">
        <a-col v-bind="{md: 24, lg: 24, xl: 24, xxl: 24}">
          <a-button size="large" icon="plus">新建投诉工单</a-button>
          <a-button size="large" icon="plus">新建维修工单</a-button>
        </a-col>
      </a-row>-->
    </a-layout-content>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { triggerWindowResizeEvent, diffTime } from '@/utils/util'
import { Layout, Row, Col, Icon, Button, Divider, Input, Popover, Form, Popconfirm } from 'ant-design-vue'
import { mapState } from 'vuex'
import CTIMixin from '@/mixins/CTIMixin'

export default {
  components: {
    ALayout: Layout,
    ALayoutHeader: Layout.Header,
    ALayoutContent: Layout.Content,
    ARow: Row,
    ACol: Col,
    AIcon: Icon,
    AButton: Button,
    ADivider: Divider,
    APopconfirm: Popconfirm,
    APopover: Popover,
    AInput: Input,
    AForm: Form,
    AFormItem: Form.Item
  },
  name: 'CallPhoneSection',
  mixins: [mixinDevice, CTIMixin],
  computed: {
    ...mapState({
      customerInfo: state => state.my.customerInfo
    })
  },
  data() {
    return {
      phoneButtonLayout: {
        xs: 6,
        sm: 6,
        md: 6,
        lg: 10,
        xl: 6,
        xxl: 6
      },
      workFormLayout: {
        md: 10,
        lg: 10,
        xl: 12,
        xxl: 12
      }
    }
  },
  methods: {
    // 向call-chat传参
    toggle() {
      this.$emit('toggle', '')
    },
    closeChatSection() {
      this.$store.dispatch('setCallChatStatus', false)
      triggerWindowResizeEvent()
    },
    diffTalkTime(startTime, endTime) {
      return diffTime({ startTime, endTime })
    }
  }
}
</script>

<style lang='scss' scoped>
#call-phone-section {
  background: #fff;
  .fr {
    float: right !important;
  }
  .fl {
    float: left !important;
  }
  .inline-block {
    display: inline-block;
  }
  .ant-layout-header {
    background: #fff;
    padding: 10px;
    height: auto;
    line-height: normal;
    .call-section-trigger {
      cursor: pointer;
      padding: 10px;
      font-size: 20px;
      &:hover {
        color: #57afff;
      }
    }
    // .header-content {
    //   width: 100%;
    //   & > .ant-row:first-child {
    //     &:first-child {
    //       & > div:first-child {
    //         flex: 8;
    //       }
    //       & > div:nth-child(2) {
    //         text-align: right;
    //         flex: 3;
    //       }
    //     }
    //   }
    // }
    // & > div.ant-row {
    //   display: flex;
    // }
    div.ant-row:first-child {
      line-height: normal;
      // display: flex;
      // flex-wrap: nowrap;
      .call-reason {
        span {
          color: #cdcdcd;
        }
      }
    }
    div.ant-row:nth-child(2) {
      line-height: normal;
      span {
        color: #cdcdcd;
      }
    }
    // div.inline-block {
    //   &:first-child {
    //     margin-left: 0;
    //   }
    //   margin-left: 8px;
    // }
  }
  .ant-layout-sider {
    border-right: 1px solid #e8e8e8;
  }
  .ant-layout-content {
    padding: 10px;
    height: 500px;
    overflow-y: auto;
    background: #fff;
    position: relative;
    .button-container {
      text-align: center;

      .transfer-call {
        border-color: #27a0db;
        background: #27a0db;
      }

      .thirdparty-call {
        border-color: #27a0db;
        background: #27a0db;
      }

      .hold-call {
        border-color: #5cb432;
        background: #5cb432;
      }

      .hangup-call {
        border-color: #c8514f;
        background: #c8514f;
      }

      .ant-btn {
        font-size: 12px;
        border-radius: 20px;
        margin: 2px 0;
        i {
          font-size: 20px;
          vertical-align: middle;
        }
      }
    }
    .workform-button-container {
      text-align: right;
      .ant-btn {
        margin: 4px;
        i {
          vertical-align: middle;
        }
      }
    }
  }
  &.mobile {
    height: auto;
    .ant-layout-header {
      padding: 10px 8px;
      font-size: 12px;
      .call-trigger-container {
        vertical-align: top;
      }
      .header-content {
        margin-left: 8px;
        & > .ant-row:first-child {
          &:first-child {
            & > div:first-child {
              flex: 8;
            }
            & > div:nth-child(2) {
              text-align: right;
              flex: 4;
            }
          }
        }
      }
    }
    .ant-layout-content {
      height: auto;
      .tip {
        transform: translate(-50%, 150px);
      }
    }
  }
}
</style>
