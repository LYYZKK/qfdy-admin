import { constantRouters } from '@/config/router.config'

const permission = {
  state: {
    routers: constantRouters,
    allRouterUrls: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routes) => {
      state.routers = constantRouters.concat(routes)
      state.addRouters = routes
    },
    ADD_ROUTER_URLS: (state, routePath) => {
      state.allRouterUrls.push(routePath)
    }
  },
  actions: {
    // 动态添加主界面路由，需要缓存
    UpdateAppRouter({ commit }, routes) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', routes)
        resolve()
      })
    },
    AddRouterUrls({ commit }, routePath) {
      commit('ADD_ROUTER_URLS', routePath)
    }
  }
}

export default permission
