import { message } from 'ant-design-vue'
import moment from 'moment'

import WebSocketClient from '@/utils/websocket-client'

import ctiWSCallback from '@/components/cti/cti-ws-callback'
import * as ctiMsg from '@/components/cti/cti-ws-msg'

import { buildTreeDataForAntd } from '@/utils/util'

import { request } from '@/api'

const api = {
  getEnabledDictItems: {
    url: '/system/dicts/{dictCode}/items/enable',
    method: 'get'
  },
  addPhoneRecord: {
    url: '/contact/phone-records',
    method: 'post'
  },
  updatePhoneRecord: {
    url: '/contact/phone-records',
    method: 'patch'
  }
}

const ctiInternalStatusMap = {
  busy_working: {
    tempReasonCode: '13',
    tempStatusText: '示忙 - 联系客户'
  },
  ringing: {
    reasoncode: '-3',
    statusText: '来电响铃中'
  },
  ringback: {
    reasoncode: '-4',
    statusText: '响铃中'
  },
  holding: {
    statusText: '通话保持中'
  },
  incall_talking: {
    reasoncode: '-100',
    statusText: '通话中'
  },
  outcall_talking: {
    reasoncode: '-101',
    statusText: '通话中'
  },
  aftercall: {
    tempReasonCode: '14',
    tempStatusText: '话后'
  }
}

/**
 * 1、普通呼出存储接触记录数据逻辑:
 * 1.1) 普通 ringback 事件中调用接口保存数据, 主键为 uuid.
 * 1.2) 普通 answer、hangup 事件中调用接口更新相关参数, 主键为 uuid.
 */

/**
 * 2、呼出转接 (A 呼出 B, A 转接给 C)存储接触记录数据逻辑:
 *
 * A -> B 的接触记录由 1.1 ~ 1.2 处理
 *
 * A -> C 的接触记录存储逻辑:
 * 2.1) transfer 类型的 ringback 事件中调用接口保存数据, 主键为 uuid.
 * 2.2) transfer 类型的 answer、hangup 事件中调用接口保存数据, 主键为 uuid.
 *
 * B -> C 的接触记录存储逻辑:
 * 2.3) transfer 类型的 answer 事件中调用接口保存数据, 主键为 otherLegUUID.
 * 2.4) 普通 answer、hangup 事件中调用接口更新相关参数, 主键为 uuid.
 */

/**
 * 3、呼出转三方存储接触记录数据逻辑:
 * 参考 2.1 ~ 2.4
 */

/**
 * 4、普通呼入存储接触记录数据逻辑:
 * 4.1) 普通 ringing 事件中调用接口保存数据, 主键为 uuid.
 * 4.2) 普通 answer、hangup 事件中调用接口更新相关参数, 主键为 uuid.
 */
const addPhoneRecord = params => {
  return request({
    ...api.addPhoneRecord,
    params
  })
}

const updatePhoneRecord = params => {
  return request({
    ...api.updatePhoneRecord,
    params
  })
}

/**
 * 内部状态说明.
 *
 * -3 振铃.
 * -4 响铃中.
 * -100 呼入通话.
 * -101 呼出通话.
 * 14 话后.
 */
const cti = {
  state: {
    socketClient: new WebSocketClient({
      url: process.env.CTI_HOST,
      pingMsg: ctiMsg.pingMsg(),
      pingIntervalTime: 30 * 1000,
      msgCallback: ctiWSCallback
    }),
    socket: null,
    logined: false,
    AgentID: 'admin',
    dn: null,
    ctiStatusDictCode: 'cti_status',
    ctiStatusDictOptionsValue: [],
    enableSwitchStatus: true,
    reasoncode: '', // 当前状态码.
    ctiInternalStatusMap,
    disableSwitchStatusReasonCodes: ['-3', '-4', '-100', '-101', '14'], // 不允许手动切换状态的状态码.
    talkingStatusReasonCodes: ['-100', '-101'], // 正在通话中的状态.
    statusText: '未登录',
    tempReasonCode: '',
    tempStatusText: '',
    uuid: '', // cti 通话唯一标识.
    caller: '', // 主叫号码.
    callee: '', // 被叫号码.
    oriCaller: '', // 原始主叫.
    customerId: '', // 当前联系的客户id.
    taskId: '',
    contactRecordIds: [],
    ringTime: '',
    answerTime: '', // 接听时间.
    hangUpTime: '', // 挂断时间.
    incall: false,
    outcall: false,
    holdStarted: false,
    holdCompleted: false,

    third: false, // 标识当前接通的电话是否转接或三方.

    transferUuid: '', // 转接后的通话唯一标识.
    transferNumber: '', // 需要转接的目标号码.
    transferStarted: false,
    transferAnswered: false,
    transferCompleted: false,
    transferCancled: false,

    conferenceUuid: '', // 多方通话后的通话唯一标识.
    conferenceNumber: '', // 需要转接的目标号码.
    conferenceStarted: false,
    conferenceAnswered: false,
    conferenceCompleted: false,
    conferenceCancled: false
  },
  mutations: {
    SET_IN_CALL: state => {
      state.incall = true
      state.outcall = false
    },
    SET_OUT_CALL: state => {
      state.incall = false
      state.outcall = true
    },
    SET_DN: (state, dn) => {
      state.dn = dn
    },
    CONNECT_CTI: state => {
      state.socketClient.initConnection()
      state.socket = state.socketClient.socket

      request({
        ...api.getEnabledDictItems,
        params: null,
        urlReplacements: [
          {
            substr: '{dictCode}',
            replacement: state.ctiStatusDictCode
          }
        ]
      }).then(res => {
        const tree = buildTreeDataForAntd({
          data: res.data,
          titleField: 'itemText',
          valueField: 'itemVal'
        })

        state.ctiStatusDictOptionsValue = tree.data
      })
    },
    LOGIN_CTI: (state, { AgentID, dn }) => {
      state.AgentID = AgentID
      state.dn = dn
      state.socketClient.sendMsg(
        ctiMsg.loginMsg({
          AgentID,
          DN: dn
        })
      )
    },
    CLOSE_CTI: state => {
      state.socketClient.close()
      state.socket = null
      state.logined = false
      state.reasoncode = ''
      state.statusText = '未登录'
    },
    LOGOUT_CTI: state => {
      state.socketClient.sendMsg(
        ctiMsg.logoutMsg({
          AgentID: state.AgentID,
          DN: state.dn
        })
      )
    },
    SET_CTI_LOGINED: (state, logined) => {
      state.logined = logined
    },
    OUT_CALL: (state, { destDN, customerId, taskId }) => {
      state.socketClient.sendMsg(
        ctiMsg.outCallMsg({
          srcDN: state.dn,
          destDN
        })
      )
      state.customerId = customerId
      state.taskId = taskId
    },
    STORE_CALL_DATA: (state, { UUID, CallerID, CalleeID }) => {
      state.uuid = UUID
      state.caller = CallerID
      state.callee = CalleeID
      state.ringTime = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    SET_CTI_STATUS: (state, { tempReasonCode = '', tempStatusText = '' }) => {
      state.socketClient.sendMsg(
        ctiMsg.setStatusMsg({
          AgentID: state.AgentID,
          reasoncode: tempReasonCode
        })
      )
      state.tempReasonCode = tempReasonCode
      state.tempStatusText = tempStatusText
    },
    SWITCH_CTI_STATUS_TEXT: (state, { reasoncode, statusText, justSwitchText = false }) => {
      if (!justSwitchText) {
        if (reasoncode) {
          state.reasoncode = reasoncode
        } else {
          state.reasoncode = state.tempReasonCode
        }
      }

      if (statusText) {
        state.statusText = statusText
      } else {
        state.statusText = state.tempStatusText
      }
    },
    ANSWER: state => {
      state.socketClient.sendMsg(
        ctiMsg.answerMsg({
          UUID: state.uuid,
          DN: state.dn
        })
      )
    },
    HANGUP: (state, { hangupTransferUUID = false, hangupConferenceUUID = false }) => {
      if (hangupTransferUUID) {
        state.socketClient.sendMsg(
          ctiMsg.hangupMsg({
            UUID: state.transferUuid,
            DN: state.dn
          })
        )
      } else if (hangupConferenceUUID) {
        state.socketClient.sendMsg(
          ctiMsg.hangupMsg({
            UUID: state.conferenceUuid,
            DN: state.dn
          })
        )
      } else {
        state.socketClient.sendMsg(
          ctiMsg.hangupMsg({
            UUID: state.uuid,
            DN: state.dn
          })
        )
      }
    },
    STORE_ORI_CALLER: (state, { oriAni }) => {
      state.oriCaller = oriAni
    },
    TAG_THIRD: state => {
      state.third = true
    },
    STORE_ANSWER_DATA: state => {
      state.answerTime = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    STORE_HANGUP_DATA: state => {
      state.hangUpTime = moment().format('YYYY-MM-DD HH:mm:ss')
    },

    // 保持.
    HOLD_CALL: state => {
      state.socketClient.sendMsg(
        ctiMsg.holdMsg({
          UUID: state.uuid
        })
      )
      state.holdStarted = true
    },
    UN_HOLD_CALL: state => {
      state.socketClient.sendMsg(
        ctiMsg.unHoldMsg({
          UUID: state.uuid
        })
      )
      state.holdStarted = false
      state.holdCompleted = true
    },

    // 转接.
    START_TRANSFER: (state, transferDigits) => {
      state.socketClient.sendMsg(
        ctiMsg.startTransferMsg({
          AgentID: state.AgentID,
          UUID: state.uuid,
          transferDigits: transferDigits,
          ani: state.incall ? state.caller : state.callee
        })
      )
      state.transferNumber = transferDigits
      state.transferStarted = true
      state.transferCancled = false
      state.transferAnswered = false
      state.transferCompleted = false
    },
    ANSWER_TRANSFER: state => {
      state.transferAnswered = true
    },
    STORE_TRANSFER_UUID: (state, { UUID }) => {
      state.transferUuid = UUID
    },
    CANCLE_TRANSFER: state => {
      state.transferStarted = false
      state.transferCancled = true
      state.transferNumber = ''
      state.transferUuid = ''
    },
    COMPLETE_TRANSFER: state => {
      state.socketClient.sendMsg(
        ctiMsg.completeTransferMsg({
          AgentID: state.AgentID,
          DN: state.dn,
          UUID: state.uuid
        })
      )

      state.transferStarted = false
      state.transferCancled = false
      state.transferAnswered = false
      state.transferCompleted = true
    },
    UPDATE_TRANSFER_CALL: state => {
      state.socketClient.sendMsg(
        ctiMsg.updateCallInfoMsg({
          Transfer_DN: state.dn,
          A_DN: state.callee,
          A_UUID: state.uuid,
          C_DN: state.transferNumber,
          C_UUID: state.transferUuid
        })
      )

      state.transferNumber = ''
      state.transferUuid = ''
    },

    // 多方.
    START_CONFERENCE: (state, conferenceDigits) => {
      state.socketClient.sendMsg(
        ctiMsg.startTransferMsg({
          AgentID: state.AgentID,
          UUID: state.uuid,
          transferDigits: conferenceDigits,
          ani: state.incall ? state.caller : state.callee
        })
      )
      state.conferenceNumber = conferenceDigits
      state.conferenceStarted = true
      state.conferenceCancled = false
      state.conferenceAnswered = false
      state.conferenceCompleted = false
    },
    ANSWER_CONFERENCE: state => {
      state.conferenceAnswered = true
    },
    STORE_CONFERENCE_UUID: (state, { UUID }) => {
      state.conferenceUuid = UUID
    },
    CANCLE_CONFERENCE: state => {
      state.conferenceStarted = false
      state.conferenceCancled = true
      state.conferenceNumber = ''
      state.conferenceUuid = ''
    },
    COMPLETE_CONFERENCE: state => {
      state.socketClient.sendMsg(
        ctiMsg.CompleteConferenceMsg({
          AgentID: state.AgentID,
          DN: state.dn,
          UUID: state.uuid
        })
      )

      state.conferenceStarted = false
      state.conferenceCancled = false
      state.conferenceAnswered = false
      state.conferenceCompleted = true
    },
    UPDATE_CONFERENCE_CALL: state => {
      state.socketClient.sendMsg(
        ctiMsg.updateCallInfoMsg({
          Transfer_DN: state.dn,
          A_DN: state.callee,
          A_UUID: state.uuid,
          C_DN: state.conferenceNumber,
          C_UUID: state.conferenceUuid
        })
      )

      state.conferenceNumber = ''
      state.conferenceUuid = ''
    },

    COMPLETE_CALL: state => {
      state.uuid = ''

      state.caller = ''
      state.callee = ''
      state.oriCaller = ''
      state.customerId = ''
      state.taskId = ''
      state.contactRecordIds = []

      state.incall = false
      state.outcall = false

      state.third = false

      state.transferStarted = false
      state.transferAnswered = false
      state.transferCompleted = false
      state.transferCancled = false

      state.conferenceStarted = false
      state.conferenceAnswered = false
      state.conferenceCompleted = false
      state.conferenceCancled = false

      state.holdStarted = false
      state.holdCompleted = false

      state.ringTime = null
      state.answerTime = null
      state.hangUpTime = null
    },

    /**
     * 1、普通呼出存储接触记录数据逻辑:
     * 1.1) 普通 ringback 事件中调用接口保存数据, 主键为 uuid.
     * 1.2) 普通 answer、hangup 事件中调用接口更新相关参数, 主键为 uuid.
     */

    /**
     * 2、呼出转接 (A 呼出 B, A 转接给 C)存储接触记录数据逻辑:
     *
     * A -> B 的接触记录由 1.1 ~ 1.2 处理
     *
     * A -> C 的接触记录存储逻辑:
     * 2.1) transfer 类型的 ringback 事件中调用接口保存数据, 主键为 uuid.
     * 2.2) transfer 类型的 answer、hangup 事件中调用接口更新相关参数, 主键为 uuid.
     *
     * B -> C 的接触记录存储逻辑:
     * 2.3) transfer 类型的 answer 事件中调用接口保存数据, 主键为 otherLegUUID.
     * 2.4) 普通 answer、hangup 事件中调用接口更新相关参数, 主键为 uuid.
     */

    /**
     * 3、呼出转三方存储接触记录数据逻辑:
     * 参考 2.1 ~ 2.4
     */

    /**
     * 4、普通呼入存储接触记录数据逻辑:
     * 4.1) 普通 ringing 事件中调用接口保存数据, 主键为 uuid.
     * 4.2) 普通 answer、hangup 事件中调用接口更新相关参数, 主键为 uuid.
     */
    ADD_PHONE_RECORD_FOR_RINGING: state => {
      const now = moment()
      const nowTime = now.format('YYYY-MM-DD HH:mm:ss')

      addPhoneRecord({
        outRecordId: state.uuid,
        callTime: nowTime,
        callType: 1, // 通话方向(0呼出、1呼入、2转接、3三方).
        callerNumber: state.caller,
        calleeNumber: state.callee,
        customerId: state.customerId,
        ringTime: nowTime,
        status: '0', // 状态(0未接通 1接通).
        taskId: state.taskId
      }).then(res => {
        if (res.success) {
          state.contactRecordIds.push(res.data.recordId)
        }
      })
    },
    ADD_PHONE_RECORD_FOR_RINGBACK: (state, { CallerID, CalleeID, oriAni, UUID }) => {
      const now = moment()
      const nowTime = now.format('YYYY-MM-DD HH:mm:ss')

      const params = {
        outRecordId: state.uuid,
        callTime: nowTime,
        callType: 0, // 通话方向(0呼出、1呼入、2转接、3三方).
        callerNumber: state.caller,
        calleeNumber: state.callee,
        customerId: state.customerId,
        ringTime: nowTime,
        status: '0', // 状态(0未接通 1接通).
        taskId: state.taskId
      }

      // A -> B, A 转接或发起三方通话到 C, 此处保存 A -> C 的通话记录.
      if (state.transferStarted) {
        params.callType = 2
        params.callerNumber = CallerID
        params.calleeNumber = CalleeID
        params.originNumber = oriAni
        params.outRecordId = UUID
        params.oriOutRecordId = state.uuid
      } else if (state.conferenceStarted) {
        params.callType = 3
        params.callerNumber = CallerID
        params.calleeNumber = CalleeID
        params.originNumber = oriAni
        params.outRecordId = UUID
        params.oriOutRecordId = state.uuid
      }

      addPhoneRecord(params).then(res => {
        if (res.success) {
          state.contactRecordIds.push(res.data.recordId)
        }
      })
    },
    ADD_THIRD_PHONE_RECORD_FOR_ANSWER: (state, { CallerID, CalleeID, otherLegUUID }) => {
      const now = moment()
      const nowTime = now.format('YYYY-MM-DD HH:mm:ss')
      const nowDate = now.format('YYYY/MM/DD')

      const params = {
        outRecordId: otherLegUUID,
        oriOutRecordId: state.uuid,
        callTime: nowTime,
        ringTime: nowTime,
        answerTime: nowTime,
        callerNumber: CallerID,
        calleeNumber: CalleeID,
        originNumber: state.oriCaller,
        customerId: state.customerId,
        status: '1', // 状态(0未接通 1接通).
        taskId: state.taskId,
        soundRecordUrl: `${process.env.CTI_SOUND_RECORD_HOST}/${nowDate}/${otherLegUUID}_.wav`
      }

      if (state.transferStarted) {
        params.callType = 2
      } else if (state.conferenceStarted) {
        params.callType = 3
      }

      // A -> B, A 转接或发起三方通话到 C, 此处保存 B -> C 的通话记录, B -> C 的通话只有 C 接起电话才能真正建立起来.
      addPhoneRecord(params).then(res => {
        if (res.success) {
          state.contactRecordIds.push(res.data.recordId)
        }
      })
    },
    UPDATE_PHONE_RECORD_FOR_ANSWER: (state, { UUID }) => {
      const now = moment()
      const nowTime = now.format('YYYY-MM-DD HH:mm:ss')
      const nowDate = now.format('YYYY/MM/DD')

      updatePhoneRecord({
        outRecordId: UUID,
        answerTime: nowTime,
        status: '1', // 状态(0未接通 1接通).
        soundRecordUrl: `${process.env.CTI_SOUND_RECORD_HOST}/${nowDate}/${state.uuid}_${state.caller}.wav`
      })
    },
    UPDATE_PHONE_RECORD_FOR_HANGUP: (state, { UUID }) => {
      const nowTime = moment().format('YYYY-MM-DD HH:mm:ss')

      updatePhoneRecord({
        outRecordId: UUID,
        hangUpTime: nowTime
      })
    }
  },
  actions: {
    SetDN({ commit }, dn) {
      commit('SET_DN', dn)
    },
    ConnectCTI({ commit }) {
      commit('CONNECT_CTI')
    },
    LoginCTI({ commit, getters }) {
      commit('CONNECT_CTI')
      commit('LOGIN_CTI', { AgentID: getters.username, dn: getters.softPhoneNo })
    },
    SetCTILogined({ commit }, logined) {
      commit('SET_CTI_LOGINED', logined)
    },
    LogoutCTI({ commit, state }) {
      if (state.reasoncode !== '0') {
        message.warn(`请先切换到就绪 (空闲) 状态`, 5)
        return false
      }
      commit('LOGOUT_CTI')
    },
    CloseCTI({ commit }) {
      commit('CLOSE_CTI')
    },

    OutCall({ commit, state }, { destDN, customerId, taskId }) {
      if (state.reasoncode.lastIndexOf('13') === -1) {
        let loginedWarnMsg = ''
        if (!state.logined) {
          loginedWarnMsg = '登录话机并'
        }
        message.warn(`请${loginedWarnMsg}切换到示忙状态`, 5)
      } else {
        commit('OUT_CALL', { destDN, customerId, taskId })
      }
    },
    SetCTIStatus({ commit }, status) {
      commit('SET_CTI_STATUS', status)
    },
    SwitchCTIStatusText({ commit }, status = {}) {
      commit('SWITCH_CTI_STATUS_TEXT', status)
    },
    Answer({ commit }) {
      commit('ANSWER')
    },
    Hangup({ commit }) {
      commit('HANGUP', {})
    },
    SetInCall({ commit }) {
      commit('SET_IN_CALL')
    },
    SetOutCall({ commit }) {
      commit('SET_OUT_CALL')
    },
    StoreCTICallRecord({ commit }, data) {
      commit('STORE_CALL_DATA', data)
    },
    StoreOriCaller({ commit }, data) {
      commit('STORE_ORI_CALLER', data)
    },
    TagThird({ commit }) {
      // 标识当前通话是否由转接或三方.
      commit('TAG_THIRD')
    },
    StoreAnswerData({ commit }) {
      commit('STORE_ANSWER_DATA')
    },
    StoreHangupData({ commit }) {
      commit('STORE_HANGUP_DATA')
    },

    // 保持.
    HoldCall({ commit }) {
      commit('HOLD_CALL')
      commit('SWITCH_CTI_STATUS_TEXT', {
        ...ctiInternalStatusMap.holding,
        justSwitchText: true
      })
    },
    UnHoldCall({ commit }) {
      commit('UN_HOLD_CALL')
    },

    // 转接.
    StartTransfer({ commit }, transferDigits) {
      commit('START_TRANSFER', transferDigits)
    },
    CancleTransfer({ commit, state }) {
      commit('HANGUP', { hangupTransferUUID: true })
      commit('CANCLE_TRANSFER')

      if (state.incall) {
        commit('SWITCH_CTI_STATUS_TEXT', ctiInternalStatusMap.incall_talking)
      } else if (state.outcall) {
        commit('SWITCH_CTI_STATUS_TEXT', ctiInternalStatusMap.outcall_talking)
      }
    },
    AnswerTransfer({ commit }) {
      commit('ANSWER_TRANSFER')
    },
    StoreTransferUuid({ commit }, msgData) {
      commit('STORE_TRANSFER_UUID', msgData)
    },
    CompleteTransfer({ commit }) {
      commit('COMPLETE_TRANSFER')
      commit('UPDATE_TRANSFER_CALL')
      commit('SET_CTI_STATUS', ctiInternalStatusMap.aftercall)
    },

    // 多方.
    StartConference({ commit }, conferenceDigits) {
      commit('START_CONFERENCE', conferenceDigits)
    },
    CancleConference({ commit, state }) {
      commit('HANGUP', { hangupConferenceUUID: true })
      commit('CANCLE_CONFERENCE')

      if (state.incall) {
        commit('SWITCH_CTI_STATUS_TEXT', ctiInternalStatusMap.incall_talking)
      } else if (state.outcall) {
        commit('SWITCH_CTI_STATUS_TEXT', ctiInternalStatusMap.outcall_talking)
      }
    },
    AnswerConference({ commit }) {
      commit('ANSWER_CONFERENCE')
    },
    StoreConferenceUuid({ commit }, msgData) {
      commit('STORE_CONFERENCE_UUID', msgData)
    },
    CompleteConference({ commit }) {
      commit('COMPLETE_CONFERENCE')
      commit('UPDATE_CONFERENCE_CALL')
    },

    CompleteCall({ commit }) {
      commit('COMPLETE_CALL')
    },

    AddPhoneRecordForRinging({ commit }) {
      commit('ADD_PHONE_RECORD_FOR_RINGING')
    },
    AddPhoneRecordForRingback({ commit }, msgData) {
      commit('ADD_PHONE_RECORD_FOR_RINGBACK', msgData)
    },
    addThirdPhoneRecordForAnswer({ commit }, msgData) {
      commit('ADD_THIRD_PHONE_RECORD_FOR_ANSWER', msgData)
    },
    updatePhoneRecordForAnswer({ commit }, msgData) {
      commit('UPDATE_PHONE_RECORD_FOR_ANSWER', msgData)
    },
    updatePhoneRecordForHangup({ commit }, msgData) {
      commit('UPDATE_PHONE_RECORD_FOR_HANGUP', msgData)
    }
  }
}

export default cti
