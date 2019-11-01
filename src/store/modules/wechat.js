const wechat = {
  state: {
    socket_wechat: {},
    message: null
  },
  mutations: {
    OPEN_WECHAT_SOCKET(state) {
      state.socket_wechat = new WebSocket('ws://123.207.167.163:9010/ajaxchattest')
    },
    CLOSE_WECHAT_SOCKET(state) {
      state.socket_wechat.close()
    }
  },
  actions: {
    openWechatSocket: ({ commit }, val) => {
      commit('OPEN_WECHAT_SOCKET', val)
    },
    closeWechatSocket: ({ commit }, val) => {
      commit('CLOSE_WECHAT_SOCKET', val)
    }
  }
}

export default wechat
