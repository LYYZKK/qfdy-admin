import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import tab from './modules/tab'
import user from './modules/user'
import keepAlive from './modules/keep-alive'
import permission from './modules/permission'
import my from './modules/my'
import cti from './modules/cti'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    tab,
    user,
    permission,
    keepAlive,
    my,
    cti
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
