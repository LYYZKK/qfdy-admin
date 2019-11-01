<template>
  <div class="cti-bar-container">
    <!-- 登录/退出话机 start -->
    <template>
      <a-popconfirm v-if="!$store.state.cti.logined" title="确定登录话机吗?" @confirm="() => loginCTI()">
        <a-button type="primary" icon="phone">登录话机</a-button>
      </a-popconfirm>

      <a-popconfirm v-if="$store.state.cti.logined" title="确定退出话机吗?" @confirm="() => logoutCTI()">
        <a-button type="danger" icon="phone">退出话机</a-button>
      </a-popconfirm>
    </template>
    <!-- 登录/退出话机 end -->

    <!-- 显示/切换状态 start -->
    <span class="m-l-8 m-r-8">
      <span class="m-r-5">当前状态:</span>
      <a-tag v-if="!$store.state.cti.logined" color="orange">未登录</a-tag>

      <!-- 如果状态处于内部通话中等特殊状态, 只显示状态, 不可手动修改状态 -->
      <a
        class="ant-dropdown-link"
        href="#"
        v-else-if="$store.state.cti.logined && $store.state.cti.disableSwitchStatusReasonCodes.includes($store.state.cti.reasoncode)"
      >{{ $store.state.cti.statusText }}</a>

      <!-- 如果状态不是处于内部通话中等特殊状态, 可以手动修改状态 -->
      <a-dropdown
        placement="topCenter"
        v-if="$store.state.cti.logined && !$store.state.cti.disableSwitchStatusReasonCodes.includes($store.state.cti.reasoncode)"
      >
        <a class="ant-dropdown-link" href="#">
          {{ $store.state.cti.statusText }}
          <a-icon type="caret-up" />
        </a>

        <a-menu
          slot="overlay"
          mode="horizontal"
          @mouseover="statusMouseOver()"
          @mouseout="statusMouseOut()"
        >
          <template v-for="(item) in $store.state.cti.ctiStatusDictOptionsValue">
            <a-menu-item
              v-if="!item.children"
              :key="item.itemVal"
              @click="switchCTIStatus({tempReasonCode: item.itemVal, tempStatusText: item.itemText})"
            >{{ item.itemText }}</a-menu-item>
            <a-sub-menu v-else :key="item.itemVal" :title="item.itemText">
              <a-menu-item-group :key="item.itemVal" :title="item.itemText">
                <a-menu-item
                  v-for="(itemChild) in item.children"
                  :key="itemChild.itemVal"
                  @click="switchCTIStatus({
                    tempReasonCode: itemChild.itemVal.lastIndexOf('13') > -1 ? '13' : itemChild.itemVal,
                    tempStatusText: itemChild.itemVal.lastIndexOf('13') > -1 ? `示忙 - ${itemChild.itemText}` : itemChild.itemText,
                  })"
                >{{ itemChild.itemText }}</a-menu-item>
              </a-menu-item-group>
            </a-sub-menu>
          </template>
        </a-menu>
      </a-dropdown>
    </span>
    <!-- 显示/切换状态 end -->

    <!-- 功能按钮 start -->
    <template>
      <!--
      <a-popover
        placement="top"
        title="输入外呼号码"
        trigger="click"
        class="m-l-8"
        :visible="outCallPopFormVisiable"
      >
        <template slot="content">
          <a-form :form="outcall_form">
            <a-form-item label="外呼号码" hasFeedback>
              <a-input
                size="small"
                placeholder="请输入外呼号码"
                v-decorator="['outCallNumber', {rules: [{ required: true, message: '请输入外呼号码' }, { validator: validateCallNumber }]}]"
              />
            </a-form-item>

            <a-popconfirm title="确定取消吗?" @confirm="() => hideOutCallPopForm()">
              <a-button size="small">取消</a-button>
            </a-popconfirm>
            <a-button type="primary" size="small" class="m-l-5" @click="confirmOutCall">确定</a-button>
          </a-form>
        </template>

        <a-button
          class="m-l-8"
          v-if="$store.state.cti.logined && $store.state.cti.reasoncode.lastIndexOf('13') > -1"
          type="dashed"
          icon="phone"
          @click="showOutCallPopForm"
        >呼叫</a-button>
      </a-popover>
      -->

      <!-- 来电响铃中 -->
      <a-button
        class="m-l-8"
        v-if="$store.state.cti.logined && $store.state.cti.reasoncode === '-3'"
        type="dashed"
        icon="shake"
        @click="answerCall"
      >接听</a-button>

      <!-- 通话中相关功能按钮区域 start -->
      <span v-if="$store.state.cti.logined">
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

        <!-- 已登录 && 通话中 -->
        <a-popconfirm title="确定挂断吗?" @confirm="() => hangup()">
          <a-button
            type="primary"
            class="hangup-call"
            icon="phone"
            v-if="$store.state.cti.talkingStatusReasonCodes.includes($store.state.cti.reasoncode)"
          >挂断</a-button>
        </a-popconfirm>
      </span>

      <!-- 已登录 && 状态是话后 -->
      <!-- <a-popconfirm title="确定完成通话吗?" @confirm="() => completeCall()">
        <a-button
          type="primary"
          class="hangup-call"
          icon="check"
          v-if="$store.state.cti.reasoncode === $store.state.cti.ctiInternalStatusMap.aftercall.tempReasonCode"
        >完成通话</a-button>
      </a-popconfirm>-->
    </template>
    <!-- 呼叫中相关功能按钮区域 end -->
    <!-- 功能按钮 end -->
  </div>
</template>

<script>
import { Icon, Button, Popconfirm, Menu, Tag, Dropdown, Input, Popover, Form } from 'ant-design-vue'
import CTIMixin from '@/mixins/CTIMixin'

export default {
  mixins: [CTIMixin],
  components: {
    AIcon: Icon,
    AButton: Button,
    APopconfirm: Popconfirm,
    AMenu: Menu,
    ASubMenu: Menu.SubMenu,
    AMenuItemGroup: Menu.ItemGroup,
    AMenuItem: Menu.Item,
    ATag: Tag,
    ADropdown: Dropdown,
    APopover: Popover,
    AInput: Input,
    AForm: Form,
    AFormItem: Form.Item
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.cti-bar-container {
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

  .answer-call {
    border-color: #27a156;
    background: #27a156;
  }

  .hangup-call {
    border-color: #c8514f;
    background: #c8514f;
  }

  .ant-btn {
    font-size: 12px !important;
    border-radius: 20px !important;
    margin: 2px 4px !important;
    i {
      font-size: 20px !important;
      vertical-align: middle !important;
    }
  }
}
</style>
