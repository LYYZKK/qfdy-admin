<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enquireScreen from '@/utils/device'

import { LocaleProvider } from 'ant-design-vue'

export default {
  components: {
    ALocaleProvider: LocaleProvider
  },
  data() {
    return {
      locale: zhCN
    }
  },
  created() {
    const _this = this
    enquireScreen(deviceType => {
      if (deviceType === 0) {
        // tablet
        _this.$store.dispatch('ToggleDevice', 'mobile')
        _this.$store.dispatch('ToggleTablet', true)
        _this.$store.dispatch('setSidebar', false)
      } else if (deviceType === 1) {
        // mobile
        _this.$store.dispatch('ToggleDevice', 'mobile')
        _this.$store.dispatch('ToggleTablet', false)
        _this.$store.dispatch('setSidebar', false)
      } else {
        _this.$store.dispatch('ToggleDevice', 'desktop')
        _this.$store.dispatch('ToggleTablet', false)
        _this.$store.dispatch('setSidebar', true)
      }
    })
  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
