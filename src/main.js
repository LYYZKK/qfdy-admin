import Vue from 'vue'
import App from './App.vue'

import bootstrap from './core/bootstrap'
import './core/use'

import '@/utils/filter' // base filter
import '@/permission' // permission control

import hasPermission from '@/utils/hasPermission'
Vue.use(hasPermission)
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
Vue.use(VuePlyr)
// 手机调试时可放开移动控制台
// import Vconsole from 'vconsole'
// if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
//   let vConsole = new Vconsole()
//   Vue.use(vConsole)
// }
Vue.config.productionTip = false

Vue.config.optionMergeStrategies.created = (parentVal, childVal) => {
  return childVal ? [childVal] : parentVal ? (Array.isArray(parentVal) ? parentVal : [parentVal]) : [() => {}]
}

// 解决 IOS 设备软键盘关闭后元素没有归位的问题.
if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
  window.addEventListener('focusout', () => {
    window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    // 软键盘收起的事件处理, 某些设备会有延迟, 再处理一次.
    setTimeout(() => {
      window.scrollTo(0, document.documentElement.scrollTop || document.body.scrollTop)
    }, 100)
  })
}
import router from './router'
import store from './store'

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
