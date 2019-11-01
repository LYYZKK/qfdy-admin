import { message, notification } from 'ant-design-vue'

import store from '@/store'

class MsgData {
  constructor(msg) {
    const _this = this
    msg.BodyData.forEach(v => {
      _this[v.BodyHeader] = v.BodyValue
    })
    this.EventName = msg.EventName
    this.AttachedData = msg.AttachedData
  }
}

/**
 * CTI 的 websocket 返回消息回调函数.
 * @param msg 回调信息
 */
export default msg => {
  const msgData = new MsgData(msg)

  switch (msgData.EventName) {
    case 'RKA': // 心跳回复包, 不必处理.
      break
    case 'reasoncode-change': // 状态变化.
      switch (msgData.reasoncode) {
        case '-1': // 登录.
          message.success('软话机登录成功')
          store.dispatch('SetCTILogined', true)
          store.dispatch('SwitchCTIStatusText', {
            reasoncode: '0',
            statusText: '就绪'
          })

          store.dispatch('SetCTIStatus', store.state.cti.ctiInternalStatusMap.busy_working)
          break
        case '-2': // 登出.
          store.dispatch('CloseCTI')
          message.success('软话机退出成功')
          break
        case '-3': // 来电振铃.
          store.dispatch('SwitchCTIStatusText', store.state.cti.ctiInternalStatusMap.ringing)
          break
        case '-4': // 回铃.
          store.dispatch('SwitchCTIStatusText', store.state.cti.ctiInternalStatusMap.ringback)
          break
        case '-100': // 呼入通话中 (显示为通话中).
          store.dispatch('SetInCall')
          store.dispatch('SwitchCTIStatusText', store.state.cti.ctiInternalStatusMap.incall_talking)
          break
        case '-101': // 呼出通话中 (显示为通话中).
          store.dispatch('SetOutCall')
          store.dispatch('SwitchCTIStatusText', store.state.cti.ctiInternalStatusMap.outcall_talking)
          break
        case '14': // 话后.
          store.dispatch('SwitchCTIStatusText')
          break
        default:
          message.success('切换软话机状态成功')
          store.dispatch('SwitchCTIStatusText')
      }
      break
    case 'SIP_unregister':
      notification.error({
        message: '系统提示',
        description: '请打开软话机',
        duration: 5
      })
      // 返回话机号码未注册时关闭连接.
      store.dispatch('CloseCTI')
      break
    case 'Ringing_Event': // 呼入响应事件.
      store.dispatch('StoreCTICallRecord', msgData)
      store.dispatch('StoreOriCaller', msgData)
      if (msgData.CallerID !== msgData.oriAni) {
        // 转接或三方.
        store.dispatch('TagThird')
      } else {
        // 普通呼入时存储通话记录, 三方或转接时由主通话方创建.
        store.dispatch('AddPhoneRecordForRinging')
      }
      break
    case 'RingBack_Event': // 外呼回铃事件.
      if (!store.state.cti.transferStarted && !store.state.cti.conferenceStarted) {
        // 普通外呼回铃事件要自动应答.
        store.dispatch('StoreCTICallRecord', msgData)
        store.dispatch('Answer')
      } else if (store.state.cti.transferStarted) {
        store.dispatch('StoreTransferUuid', msgData)
      } else if (store.state.cti.conferenceStarted) {
        store.dispatch('StoreConferenceUuid', msgData)
      }
      store.dispatch('StoreOriCaller', msgData)
      store.dispatch('AddPhoneRecordForRingback', msgData)
      break
    case 'Answer_Event': // 呼出接通电话.
      if (store.state.cti.transferStarted && !store.state.cti.transferAnswered) {
        store.dispatch('AnswerTransfer')
        store.dispatch('addThirdPhoneRecordForAnswer', msgData)
      } else if (store.state.cti.conferenceStarted && !store.state.cti.conferenceAnswered) {
        store.dispatch('AnswerConference')
        store.dispatch('addThirdPhoneRecordForAnswer', msgData)
      }
      store.dispatch('updatePhoneRecordForAnswer', msgData)
      store.dispatch('StoreAnswerData')
      break
    case 'Hangup_Event':
      if (msgData.UUID === store.state.cti.uuid) {
        // 挂断事件的 uuid 不等于当前通话的 uuid 表明挂断的是转接的电话, 不更新电话状态.
        store.dispatch('SetCTIStatus', store.state.cti.ctiInternalStatusMap.aftercall)
      }
      store.dispatch('updatePhoneRecordForHangup', msgData)
      store.dispatch('StoreHangupData')
      break
    case 'Hold_Event':
      break
    case 'UnHold_Event':
      break
  }
}
