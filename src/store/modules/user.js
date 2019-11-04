import Vue from 'vue'
import { ACCESS_TOKEN, USER_NAME, USER_INFO } from '@/store/mutation-types'
import { welcome, getRecursiveRouterForMenuData } from '@/utils/util'
import { notification } from 'ant-design-vue'
import constantConfig from '@/config/constant.config'
import { request } from '@/api'

const api = {
  login: {
    url: '/auth/login',
    method: 'post'
  },
  getPermissionsByUserId: {
    url: '/users/{userId}/permissions',
    method: 'get'
  },
  logout: {
    url: '/auth/logout',
    method: 'get'
  },
  getAllUsers: {
    url: '/user/users'
  }
}

const user = {
  state: {
    token: '',
    username: '',
    realname: '',
    welcome: '',
    avatar: '',
    permissionList: [], // 所拥有的菜单及下属权限.
    globalPermissionList: [], // 所拥有的按钮权限 (全局和所有菜单下的).
    userInfo: {},
    allUsers: {},
    softPhoneNo: null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_NAME: (state, { username, realname, welcome }) => {
      state.username = username
      state.realname = realname
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_GLOBAL_PERMISSIONLIST: (state, globalPermissionList) => {
      state.globalPermissionList = globalPermissionList
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_ALL_USERS: (state, allUsers) => {
      state.allUsers = allUsers
    },
    SET_SOFT_PHONE_NO: (state, softPhoneNoData = []) => {
      if (softPhoneNoData.length > 0) {
        state.softPhoneNo = softPhoneNoData[0]['fieldValue']
      }
    }
  },

  actions: {
    // 登录
    Login({ commit }, loginInfo) {
      return new Promise((resolve, reject) => {
        request({
          ...api.login,
          ...loginInfo
        })
          .then(res => {
            if (res.success) {
              const userInfo = res.data

              Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
              Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)

              commit('SET_USER_INFO', userInfo)
              commit('SET_USER_NAME', { username: userInfo.username, realname: userInfo.realname, welcome: welcome() })
              commit('SET_AVATAR', userInfo.avatar)

              resolve(res)
            } else {
              notification.error({ message: '系统提示', description: res.message, duration: 4 })
              reject(res)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    GetPermissionListForUser({ commit }) {
      return new Promise((resolve, reject) => {
        const userId = Vue.ls.get(USER_INFO).id
        request({
          ...api.getPermissionsByUserId,
          urlReplacements: [{ substr: '{userId}', replacement: userId }]
        })
          .then(res => {
            if (res.success) {
              const routes = getRecursiveRouterForMenuData(res)

              if (routes.dynamicRouters && routes.dynamicRouters.length > 0) {
                commit('SET_PERMISSIONLIST', routes.dynamicRouters)
              } else {
                reject('GetPermissionListForUser: permissions must be a non-null array !')
              }

              // 全局存储功能权限信息.
              if (routes.globalPermissions && routes.globalPermissions.length > 0) {
                commit('SET_GLOBAL_PERMISSIONLIST', routes.globalPermissions)
              }

              resolve(routes)

              request({ ...api.getAllUsers, params: { pageSize: constantConfig.MAX_PAGE_SIZE } }).then(res => {
                if (res.success) {
                  const allUsers = {}
                  for (let i = 0; i < res.data.length; i++) {
                    const item = res.data[i]
                    allUsers[item.id] = item.realname
                  }
                  commit('SET_ALL_USERS', allUsers)
                }
              })
            } else {
              notification.error({ message: '系统提示', description: res.message, duration: 4 })
              reject(res)
            }
          })
          .catch(error => {
            reject(error)
          })

        // 存储坐席用户的软话机号码数据.
        // request({
        //   ...api.getExtensionsByUserId,
        //   params: {
        //     userId
        //   }
        // }).then(res => {
        //   if (res.success) {
        //     commit('SET_SOFT_PHONE_NO', filter(res.data, { fieldCode: 'soft-phone-no' }))
        //   }
        // })
      })
    },

    // 登出
    Logout({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONLIST', [])
        Vue.ls.remove(ACCESS_TOKEN)

        request({
          ...api.logout
        })
          .then(() => {
            resolve()
          })
          .catch(() => {
            resolve()
          })
      })
    }
  }
}

export default user
