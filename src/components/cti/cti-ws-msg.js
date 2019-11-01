const buildMsg = (CommandName, BodyDataVal = {}) => {
  const BodyData = []
  for (let key in BodyDataVal) {
    BodyData.push({ BodyHeader: key, BodyValue: BodyDataVal[key] })
  }
  return {
    CommandName,
    BodyData
  }
}

/**
 * 组装登录 CTI 话机 ws 数据.
 * @param {AgentID} 坐席帐号
 * @param {DN} 坐席分机号
 * @param {QueueName} 队列号
 * @param {Position} 坐席权限, 优先级, 数字越小优化级越高.
 * @param {Type} 登陆方式, 1: 电话, 2: 微信
 */
export const loginMsg = ({ AgentID, DN, QueueName = '518', Position = '1', Type = '1' }) => {
  return buildMsg('Login', { AgentID, DN, QueueName, Position, Type })
}

/**
 * 组装登出 CTI 话机 ws 数据.
 * @param {AgentID} 坐席帐号
 * @param {DN} 坐席分机号
 * @param {QueueName} 队列号
 */
export const logoutMsg = ({ AgentID, DN, QueueName = '518' }) => {
  return buildMsg('Logoff', { AgentID, DN, QueueName })
}

/**
 * 组装 CTI 外呼 ws 数据.
 * @param {srcDN} 主叫号码
 * @param {destDN} 被叫号码
 */
export const outCallMsg = ({ srcDN, destDN }) => {
  return buildMsg('OutCall', { srcDN, destDN })
}

/**
 * 组装 CTI 修改状态 ws 数据.
 * @param {AgentID} 坐席用户名.
 * @param {reasoncode} 状态码.
 */
export const setStatusMsg = ({ AgentID, reasoncode }) => {
  return buildMsg('SetStatus', { AgentID, reasoncode })
}

/**
 * 组装接通 CTI 电话 ws 数据.
 * @param {UUID} CTI 通话唯一标识.
 * @param {DN} 当前软话机.
 */
export const answerMsg = ({ UUID, DN }) => {
  return buildMsg('Answer', { UUID, DN })
}

/**
 * 组装挂断 CTI 电话 ws 数据.
 * @param {UUID} CTI 通话唯一标识.
 * @param {DN} 当前软话机.
 */
export const hangupMsg = ({ UUID, DN }) => {
  return buildMsg('Hangup', { UUID, DN })
}

/**
 * 组装开始保持 CTI 电话 ws 数据.
 * @param {UUID} CTI 通话唯一标识.
 */
export const holdMsg = ({ UUID }) => {
  return buildMsg('Hold', { UUID })
}

/**
 * 组装结束保持 CTI 电话 ws 数据.
 * @param {UUID} CTI 通话唯一标识.
 */
export const unHoldMsg = ({ UUID }) => {
  return buildMsg('UnHold', { UUID })
}

/**
 * 组装开始转接 CTI 电话 ws 数据.
 * @param {AgentID} 坐席用户名.
 * @param {UUID} CTI 通话唯一标识.
 * @param {transferDigits} 需要转接到的目标号码.
 * @param {ani} 转接后通话的主叫号码 (A -> (call) B, A => (transfer) C, 这个参数的值是 B).
 */
export const startTransferMsg = ({ AgentID, UUID, transferDigits, ani }) => {
  return buildMsg('StartTransfer', { AgentID, UUID, transferDigits, ani })
}

/**
 * 组装完成转接 CTI 电话 ws 数据.
 * @param {AgentID} 坐席用户名.
 * @param {DN} 当前软话机.
 * @param {UUID} CTI 通话唯一标识.
 */
export const completeTransferMsg = ({ AgentID, DN, UUID }) => {
  return buildMsg('CompleteTransfer', { AgentID, DN, UUID })
}

/**
 * 组装完成多方 CTI 电话 ws 数据.
 * @param {AgentID} 坐席用户名.
 * @param {DN} 当前软话机.
 * @param {UUID} CTI 通话唯一标识.
 */
export const CompleteConferenceMsg = ({ AgentID, DN, UUID }) => {
  return buildMsg('CompleteConference', { AgentID, DN, UUID })
}

/**
 * 组装更新通话信息 ws 数据 (完成转接或三方时发送到 CTI).
 *
 * @param {Transfer_DN} 操作转接的话机号码.
 * @param {A_DN} 原通话被叫号码.
 * @param {A_UUID} 原通话 uuid.
 * @param {C_DN} 转接或三方目标号码.
 * @param {C_UUID} 转接或三方新通话 uuid.
 */
export const updateCallInfoMsg = ({ Transfer_DN, A_DN, A_UUID, C_DN, C_UUID }) => {
  return buildMsg('UpdateCallInfo', { Transfer_DN, A_DN, A_UUID, C_DN, C_UUID })
}

/**
 * 获取 CTI 心跳包数据.
 */
export const pingMsg = () => {
  return buildMsg('keepalivetimer')
}
