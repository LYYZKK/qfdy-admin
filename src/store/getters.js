import Vue from 'vue'
import { USER_INFO } from '@/store/mutation-types'
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => {
    state.user.avatar = Vue.ls.get(USER_INFO).avatar
    return state.user.avatar
  },
  username: state => {
    state.user.username = Vue.ls.get(USER_INFO).username
    return state.user.username
  },
  nickname: state => {
    state.user.realname = Vue.ls.get(USER_INFO).realname
    return state.user.realname
  },
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  globalPermissionList: state => state.user.globalPermissionList,
  userInfo: state => {
    state.user.userInfo = Vue.ls.get(USER_INFO)
    return state.user.userInfo
  },
  softPhoneNo: state => state.user.softPhoneNo,
  addRouters: state => state.permission.addRouters,
  allRouterUrls: state => state.permission.allRouterUrls,
  getAliveDataByKey: state => key => state.keepAlive[key],
  getCurrentCustomerId: state => state.my.customerId,
  getRealNameById: state => state.user.allUsers
}

export default getters
