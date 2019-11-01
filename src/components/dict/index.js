import JDictSelectTagV from './JDictSelectTag.vue'
import JDictViewTagV from './JDictViewTag.vue'

export default {
  install: function(Vue) {
    Vue.component('JDictSelectTag', JDictSelectTagV)
    Vue.component('JDictViewTag', JDictViewTagV)
  }
}
