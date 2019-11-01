import JAddress from './JAddress.vue'
import JDate from './JDate.vue'
import JCodeEditor from './JCodeEditor.vue'
import JEditor from './JEditor.vue'
import JEllipsis from './JEllipsis.vue'

let install = function(Vue) {
  Vue.component('JAddress', JAddress)
  Vue.component('JDate', JDate)
  Vue.component('JCodeEditor', JCodeEditor)
  Vue.component('JEditor', JEditor)
  Vue.component('JEllipsis', JEllipsis)
}
export default { install }
