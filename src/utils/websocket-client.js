import isFunction from 'lodash.isfunction'
import moment from 'moment'

class WebSocketClient {
  constructor({
    url,
    pingMsg,
    msgCallback,
    pingIntervalTime = 10 * 1000, // ms.
    pingTimeoutTime = 8 * 1000 // ms.
  }) {
    this.url = url
    this.pingMsg = pingMsg
    this.msgCallback = msgCallback
    this.pingIntervalTime = pingIntervalTime
    this.logTimeFormat = 'YYYY-MM-DD HH:mm:ss'
    this.pingTimeoutTime = pingTimeoutTime

    this.initDeclaredField()
  }

  initDeclaredField() {
    this.normalClose = false
    this.lockReconnect = false
    this.connectionReadyLogged = false
    this.reConnectTimeout = null
    this.pingInterval = null
    this.pingTimeout = null
  }

  initConnection(cb) {
    this.initDeclaredField()

    const _this = this

    this.initConnectionCB = cb

    try {
      this.socket = new WebSocket(this.url)
    } catch (err) {
      console.error(
        moment().format(_this.logTimeFormat),
        'connect with err from ws at ',
        _this.url,
        'content:',
        JSON.stringify(err)
      )

      _this.reConnect()
    }

    this.onOpen(cb)
    this.onClose()
    this.onMessage()
    this.onError()

    return this.socket
  }

  onOpen(cb) {
    const _this = this
    _this.socket.onopen = () => {
      console.log(moment().format(_this.logTimeFormat), 'opened connection to ws at', _this.url)

      if (isFunction(cb)) {
        _this.waitConnectionReady(() => {
          cb(_this.socket)
        })
      }

      _this.ping()
    }
  }

  onClose() {
    const _this = this
    this.socket.onclose = () => {
      console.log(moment().format(_this.logTimeFormat), 'closed connection to ws at', _this.url)

      _this.connectionReadyLogged = false
      if (!_this.normalClose) {
        // 非正常关闭时自动重连.
        _this.reConnect()
      }
    }
  }

  onMessage() {
    const _this = this
    this.socket.onmessage = evt => {
      this.pingTimeout && clearTimeout(this.pingTimeout)

      console.log(
        moment().format(_this.logTimeFormat),
        'recieve message from ws at',
        _this.url,
        'content:',
        JSON.stringify(evt.data)
      )

      this.msgCallback(JSON.parse(evt.data))
    }
  }

  onError() {
    const _this = this
    this.socket.onerror = err => {
      console.error(moment().format(_this.logTimeFormat), 'err from ws at', _this.url, 'content:', JSON.stringify(err))

      _this.connectionReadyLogged = false
      if (!_this.normalClose) {
        // 非正常关闭时自动重连.
        _this.reConnect()
      }
    }
  }

  sendMsg(message) {
    const _this = this
    _this.waitConnectionReady(() => {
      console.log(
        moment().format(_this.logTimeFormat),
        'send msg to ws at',
        _this.url,
        'content:',
        JSON.stringify(message)
      )

      _this.socket.send(JSON.stringify(message))
    })
  }

  waitConnectionReady(cb) {
    const _this = this
    if (_this.socket.readyState === 1) {
      if (!_this.connectionReadyLogged) {
        _this.connectionReadyLogged = true
        console.log(moment().format(_this.logTimeFormat), 'connection is ready for ws at', _this.url)
      }

      if (isFunction(cb)) {
        cb(_this.socket)
      }
    } else {
      setTimeout(() => {
        _this.waitConnectionReady(cb)
      }, 50)
    }
  }

  /**
   * 每隔一段时间发送一次心跳包.
   */
  ping() {
    const _this = this

    _this.pingTimeout && clearTimeout(_this.pingTimeout)
    _this.pingInterval = setInterval(() => {
      _this.sendMsg(_this.pingMsg)

      _this.pingTimeout = setTimeout(() => {
        console.log(moment().format(_this.logTimeFormat), 'not received pong msg, closing ws at', _this.url)
        _this.close(false)
      }, _this.pingTimeoutTime)
    }, _this.pingIntervalTime)
  }

  /**
   * 重新连接.
   */
  reConnect() {
    if (this.lockReconnect) {
      return
    }
    console.log(moment().format(this.logTimeFormat), 're-connecting to ws at', this.url)
    this.lockReconnect = true

    this.pingInterval && clearInterval(this.pingInterval)
    this.pingTimeout && clearTimeout(this.pingTimeout)
    this.reConnectTimeout && clearTimeout(this.reConnectTimeout)

    const _this = this
    _this.reConnectTimeout = setTimeout(() => {
      _this.initConnection(_this.initConnectionCB)
    }, 2000)
  }

  /**
   * 手动关闭链接.
   */
  close(normalClose = true) {
    this.normalClose = normalClose
    this.connectionReadyLogged = false

    this.pingInterval && clearInterval(this.pingInterval)
    this.pingTimeout && clearTimeout(this.pingTimeout)
    this.reConnectTimeout && clearTimeout(this.reConnectTimeout)

    this.socket.close()
  }
}

export default WebSocketClient
