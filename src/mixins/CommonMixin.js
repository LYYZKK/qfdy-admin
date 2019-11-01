import toNumber from 'lodash.tonumber'
import toString from 'lodash.tostring'
import isNAN from 'lodash.isnan'
import moment from 'moment'
import { mapGetters } from 'vuex'

import store from '../store'
import config from '@/defaultSettings'

export default {
  data() {
    return {
      viewHeight: 'auto'
    }
  },
  methods: {
    ...mapGetters(['getAliveDataByKey']),
    toNumber(x) {
      return isNAN(toNumber(x)) ? 0 : toNumber(x)
    },
    toString(x) {
      return toString(x)
    },
    formatDateTime(x, format = 'YYYY-MM-DD HH:mm:ss') {
      return moment(x).format(format)
    },
    hasPermission(permission) {
      const permissionList = store.getters.globalPermissionList || []
      for (let item of permissionList) {
        if (permission === item.action) {
          return true
        }
      }
      return false
    },
    hasRouter(router) {
      return store.getters.allRouterUrls.includes(router)
    },
    getAliveData() {
      return (
        this.$store.getters.getAliveDataByKey(
          config.sessionStorageKeyPrefix + this.$route.name + config.keepAliveSuffix
        ) || {}
      )
    },
    fullHeight() {
      return document.documentElement.clientHeight
    },
    /**
     * 根据窗口大小自动计算内容显示区高度.
     *
     * 59: navbar
     * 52: tabs
     * 12: margin-top
     * 12: margin-botton
     * 48: fotter
     */
    getViewHeight() {
      let fullHeight = document.documentElement.clientHeight
      let routerViewHeight = fullHeight - 59 - 52 - 12 - 12

      if (this.hasPermission('cti-bar')) {
        routerViewHeight -= 48
      }

      this.viewHeight = routerViewHeight
    }
  },
  mounted() {
    this.getViewHeight()
    window.onresize = () => {
      this.getViewHeight()
    }
  }
}
