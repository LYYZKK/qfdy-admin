import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { Modal, notification } from 'ant-design-vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import constantConfig from '@/config/constant.config'

let token_expired_error_showed = false

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 10000 // 请求超时时间
})

const service2 = axios.create({
  baseURL: '/api2', // api base_url
  timeout: 10000 // 请求超时时间
})

const internalService = axios.create({
  baseURL: '/api', // api base_url
  timeout: 10000 // 请求超时时间
})

const err = error => {
  if (error.message.indexOf('timeout') !== -1) {
    notification.error({
      message: '系统提示',
      description: '网络超时'
    })
  } else if (error.response) {
    let data = error.response.data

    switch (data.code) {
      case 400:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
      case 401:
        if (!token_expired_error_showed) {
          token_expired_error_showed = true

          Modal.error({
            title: '登录已过期',
            content: data.message,
            okText: '重新登录',
            mask: false,
            onOk: () => {
              token_expired_error_showed = false
              if (Vue.ls.get(ACCESS_TOKEN)) {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  if (!['/', '/user/login'].includes(window.location.pathname)) {
                    window.location.reload()
                  }
                })
              }
            }
          })
        }
        break
      case 403:
        notification.error({
          message: '系统提示',
          description: '拒绝访问',
          duration: 4
        })
        break
      case 404:
        notification.error({
          message: '系统提示',
          description: '很抱歉，资源未找到!',
          duration: 4
        })
        break
      case 500:
        notification.error({
          message: '系统提示',
          description: '系统错误',
          duration: 4
        })
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }

  return Promise.reject(error)
}

const injectServiceInterceptors = (service, isInternal = false) => {
  // request interceptor
  service.interceptors.request.use(
    config => {
      if (isInternal) {
        config.headers[ACCESS_TOKEN] = constantConfig.INTERNAL_TOKEN // 内部请求为保安全, 使用内置 token.
      } else {
        const token = Vue.ls.get(ACCESS_TOKEN)
        if (token) {
          config.headers[ACCESS_TOKEN] = token
        }
      }

      if (config.method == 'get') {
        config.params = {
          _t: Date.parse(new Date()) / 1000,
          ...config.params
        }
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(response => {
    if (!isInternal && response.headers[ACCESS_TOKEN]) {
      Vue.ls.set(ACCESS_TOKEN, response.headers[ACCESS_TOKEN], 7 * 24 * 60 * 60 * 1000)
      store.commit('SET_TOKEN', response.headers[ACCESS_TOKEN])
    }

    return response.data
  }, err)
}

injectServiceInterceptors(service)
injectServiceInterceptors(service2)
injectServiceInterceptors(internalService, true)

export { service as axios, service2 as axios2, internalService as internalAxios }
