import config from '@/defaultSettings'

export default {
  methods: {
    saveAliveData({ key, val }) {
      const keepAliveDataSSKey = this.getKeepAliveDataSSKey()
      const aliveData = this.$store.state.keepAlive[keepAliveDataSSKey] || {}
      if (key) {
        aliveData[key] = val
      } else {
        this.needAliveDataKeys = this.needAliveDataKeys || ['queryParam']
        this.needAliveDataKeys.forEach(k => {
          if (k !== key) {
            aliveData[k] = this[k] || {}
          }
        })
      }

      this.$store.dispatch('saveAliveData', {
        key: keepAliveDataSSKey,
        aliveData
      })
    },
    getKeepAliveDataSSKey() {
      const keepAliveDataSSKey = config.sessionStorageKeyPrefix + this.$route.name + config.keepAliveSuffix
      this.keepAliveDataSSKey = keepAliveDataSSKey
      return keepAliveDataSSKey
    },
    restoreAliveData() {
      const keepAliveDataSSKey = this.getKeepAliveDataSSKey()
      this.$store.dispatch('restoreAliveData', { key: keepAliveDataSSKey })

      this.aliveData = this.$store.state.keepAlive[keepAliveDataSSKey] || {}

      this.needAliveDataKeys = this.needAliveDataKeys || ['queryParam']
      this.needAliveDataKeys.forEach(k => {
        this[k] = this.aliveData[k] || {}
      })
    }
  },
  created() {
    this.restoreAliveData()
  },
  beforeDestroy() {
    this.saveAliveData({})
  }
}
