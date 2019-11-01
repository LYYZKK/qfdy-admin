import Vue from 'vue'

// 转为各模块按需引入.
// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.less'
// Vue.use(Antd)

import { message, notification, Modal } from 'ant-design-vue'
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VueAreaLinkage from 'vue-area-linkage'
Vue.use(VueAreaLinkage)

import config from '@/defaultSettings'
import Storage from 'vue-ls'
Vue.use(Storage, config.localstorageOptions)
