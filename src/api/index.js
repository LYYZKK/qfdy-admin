import replace from 'lodash.replace'

import { axios, axios2, internalAxios } from './axios'

export function request({ url, method = 'get', params = {}, urlReplacements = [] }) {
  let reqUrl = url
  urlReplacements.forEach(replacement => {
    reqUrl = replace(reqUrl, replacement.substr, replacement.replacement)
  })
  if (['post', 'patch', 'put'].includes(method)) {
    return axios({
      url: reqUrl,
      data: params,
      method
    })
  } else if (['get', 'delete'].includes(method)) {
    return axios({
      url: reqUrl,
      params,
      method
    })
  }
}

export function request2({ url, method = 'get', params = {}, urlReplacements = [] }) {
  let reqUrl = url
  urlReplacements.forEach(replacement => {
    reqUrl = replace(reqUrl, replacement.substr, replacement.replacement)
  })
  if (['post', 'patch', 'put'].includes(method)) {
    return axios2({
      url: reqUrl,
      data: params,
      method
    })
  } else if (['get', 'delete'].includes(method)) {
    return axios2({
      url: reqUrl,
      params,
      method
    })
  }
}

export function internalRequest({ url, method = 'get', params = {}, urlReplacements = [] }) {
  let reqUrl = url
  urlReplacements.forEach(replacement => {
    reqUrl = replace(reqUrl, replacement.substr, replacement.replacement)
  })
  if (['post', 'patch', 'put'].includes(method)) {
    return internalAxios({
      url: reqUrl,
      data: params,
      method
    })
  } else if (['get', 'delete'].includes(method)) {
    return internalAxios({
      url: reqUrl,
      params,
      method
    })
  }
}
