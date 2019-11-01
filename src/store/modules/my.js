const my = {
  state: {
    callChatOpened: false,
    callChatStatus: 'close',
    customerId: null,
    customerInfo: {},
    taskData: {},
    activeTaskTabIndex: null,
    firstCallComplete: false,
    appointmentComplete: false
  },
  mutations: {
    SET_CALLCHATSTATUS(state, val) {
      state.callChatOpened = val
      if (val) {
        state.callChatStatus = 'open'
      } else {
        state.callChatStatus = 'close'
      }
    },
    SET_CUSTOMERID(state, val) {
      state.customerId = val
    },
    SET_CUSTOMER_INFO(state, val) {
      state.customerInfo = val
    },
    SET_TASK_DATA(state, val) {
      state.taskData = val
    },
    SET_ACTIVE_TASK_TAB_INDEX(state, val) {
      state.activeTaskTabIndex = val
    },
    SET_FIRST_CALL_COMPLETE(state) {
      state.firstCallComplete = !state.firstCallComplete
    },
    SET_APPOINTMENT_COMPLETE(state) {
      state.appointmentComplete = !state.appointmentComplete
    }
  },
  actions: {
    setCallChatStatus: ({ commit }, val) => {
      commit('SET_CALLCHATSTATUS', val)
    },
    setCustomerId({ commit }, val) {
      commit('SET_CUSTOMERID', val)
    },
    setCustomerInfo({ commit }, val) {
      commit('SET_CUSTOMER_INFO', val)
    },
    setTaskData({ commit }, val) {
      commit('SET_TASK_DATA', val)
    },
    setActiveTaskTabIndex({ commit }, val) {
      commit('SET_ACTIVE_TASK_TAB_INDEX', val)
    },
    backToContactTask({ commit }, val) {
      if (val === '1') {
        commit('SET_FIRST_CALL_COMPLETE', '')
      } else if (val === '2') {
        commit('SET_APPOINTMENT_COMPLETE', '')
      }
      commit('SET_TASK_DATA', {})
    }
  }
}

export default my
