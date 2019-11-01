const tab = {
  state: {
    pageList: [],
    linkList: [],
    activePage: '',
    activeRouter: null
  },
  mutations: {
    INIT_TABS: (state, { indexPagePath, route }) => {
      state.pageList = []
      state.linkList = []
      state.activePage = ''

      if (route.path != indexPagePath) {
        state.pageList.push({
          name: 'dashboard-analysis',
          path: indexPagePath,
          fullPath: indexPagePath,
          meta: {
            icon: 'dashboard',
            title: '首页'
          }
        })
        state.linkList.push(indexPagePath)
      }
      state.pageList.push(route)
      state.linkList.push(route.fullPath)
      state.activePage = route.fullPath
    },
    CHANGE_ROUTE: (state, { newRoute, multipage }) => {
      state.activePage = newRoute.fullPath
      if (!multipage) {
        state.linkList = [newRoute.fullPath]
        state.pageList = [Object.assign({}, newRoute)]
      } else if (state.linkList.indexOf(newRoute.fullPath) < 0) {
        state.linkList.push(newRoute.fullPath)
        state.pageList.push(Object.assign({}, newRoute))
      } else if (state.linkList.indexOf(newRoute.fullPath) >= 0) {
        let oldIndex = state.linkList.indexOf(newRoute.fullPath)
        let oldPositionRoute = state.pageList[oldIndex]
        state.pageList.splice(oldIndex, 1, Object.assign({}, newRoute, { meta: oldPositionRoute.meta }))
      }
    },
    SWITCH_MULTIPAGE: (state, { route }) => {
      state.linkList = [route.fullPath]
      state.pageList = [route]
    },
    ACTIVE_TAB: (state, { path }) => {
      let index = state.linkList.lastIndexOf(path)
      state.activeRouter = state.pageList[index]
    },
    CLOSE_TAB: (state, { path }) => {
      state.pageList = state.pageList.filter(item => item.fullPath !== path)
      let index = state.linkList.indexOf(path)
      state.linkList = state.linkList.filter(item => item !== path)
      index = index >= state.linkList.length ? state.linkList.length - 1 : index
      state.activePage = state.linkList[index]
    },
    CLOSE_OTHER_TABS: (state, { path, indexPagePath }) => {
      let index = state.linkList.indexOf(path)
      if (path == indexPagePath) {
        state.linkList = state.linkList.slice(index, index + 1)
        state.pageList = state.pageList.slice(index, index + 1)
        state.activePage = state.linkList[0]
      } else {
        let indexContent = state.pageList.slice(0, 1)[0]
        state.linkList = state.linkList.slice(index, index + 1)
        state.pageList = state.pageList.slice(index, index + 1)
        state.linkList.unshift(indexPagePath)
        state.pageList.unshift(indexContent)
        state.activePage = this.linkList[1]
      }
    },
    CLOSE_LEFT_TABS: (state, { path, indexPagePath }) => {
      let tempList = [...state.pageList]
      let indexContent = tempList.slice(0, 1)[0]
      let index = state.linkList.indexOf(path)
      state.linkList = state.linkList.slice(index)
      state.pageList = state.pageList.slice(index)
      state.linkList.unshift(indexPagePath)
      state.pageList.unshift(indexContent)
      if (state.linkList.indexOf(state.activePage) < 0) {
        state.activePage = state.linkList[0]
      }
    },
    CLOSE_RIGHT_TABS: (state, { path }) => {
      let index = state.linkList.indexOf(path)
      state.linkList = state.linkList.slice(0, index + 1)
      state.pageList = state.pageList.slice(0, index + 1)
      if (state.linkList.indexOf(state.activePage < 0)) {
        state.activePage = state.linkList[state.linkList.length - 1]
      }
    },
    RENDER_TABS_FOR_DYNAMIC_ROUTERS: (state, { path, title }) => {
      let index = state.linkList.indexOf(path)
      if (index >= 0) {
        let currRouter = state.pageList[index]
        let meta = Object.assign({}, currRouter.meta, { title })
        state.pageList.splice(index, 1, Object.assign({}, currRouter, { meta }))
      }
    }
  },
  actions: {
    InitTabs({ commit }, { indexPagePath, route }) {
      commit('INIT_TABS', { indexPagePath, route })
    },
    ChangeRoute({ commit }, { newRoute, multipage }) {
      commit('CHANGE_ROUTE', { newRoute, multipage })
    },
    SwitchMultipage({ commit }, { route }) {
      commit('SWITCH_MULTIPAGE', { route })
    },
    ActiveTab({ commit }, { path }) {
      commit('ACTIVE_TAB', { path })
    },
    CloseTab({ commit }, { path }) {
      commit('CLOSE_TAB', { path })
    },
    CloseAndActiveOtherTab({ commit, state }, { path }) {
      commit('CLOSE_TAB', { path })
      commit('ACTIVE_TAB', { path: state.activePage })
    },
    CloseOtherTabs({ commit }, { path, indexPagePath }) {
      commit('CLOSE_OTHER_TABS', { path, indexPagePath })
    },
    CloseLeftTabs({ commit }, { path, indexPagePath }) {
      commit('CLOSE_LEFT_TABS', { path, indexPagePath })
    },
    CloseRightTabs({ commit }, { path }) {
      commit('CLOSE_RIGHT_TABS', { path })
    },
    RenderTabsForDynamicRouters({ commit }, { path, title }) {
      commit('RENDER_TABS_FOR_DYNAMIC_ROUTERS', { path, title })
    }
  }
}

export default tab
