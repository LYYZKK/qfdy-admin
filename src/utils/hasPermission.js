/* eslint-disable no-unused-vars */
import store from '../store'

export default {
  install(Vue, options) {
    Vue.directive('has', {
      inserted: (el, binding, vnode) => {
        let permissionList = store.getters.globalPermissionList
        if (permissionList === null || permissionList === '' || permissionList === undefined) {
          el.parentNode.removeChild(el)
          return
        }

        let permissions = []
        for (var item of permissionList) {
          permissions.push(item.action)
        }
        if (!permissions.includes(binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })

    Vue.directive('hasRouter', {
      inserted: (el, binding, vnode) => {
        if (!store.getters.allRouterUrls.includes(binding.value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}
