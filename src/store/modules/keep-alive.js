export default {
  state: {},
  mutations: {
    RESTORE_ALIVE_DATA: (state, { key }) => {
      state[key] = JSON.parse(sessionStorage.getItem(key))
    },
    SAVE_ALIVE_DATA: (state, { key, aliveData }) => {
      state[key] = aliveData
      sessionStorage.setItem(key, JSON.stringify(aliveData))
    }
  },
  actions: {
    restoreAliveData: ({ commit }, { key }) => {
      commit('RESTORE_ALIVE_DATA', { key })
    },
    saveAliveData: ({ commit }, { key, aliveData }) => {
      commit('SAVE_ALIVE_DATA', { key, aliveData })
    }
  }
}
