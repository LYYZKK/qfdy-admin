/**
 * 字典 util
 * author: scott
 * date: 20190109
 */
import toString from 'lodash.tostring'

import { request } from '@/api'

const api = {
  getDictItems: {
    url: '/system/dicts/{dictCode}/items/enable',
    method: 'get'
  },
  getDictsByCode: {
    url: '/system/dicts',
    method: 'get'
  }
}

// 字典标签专用 (通过code获取有效字典项)
const getEnableDictItemsByDictCode = (code, params) => {
  return request({
    ...api.getDictItems,
    params,
    urlReplacements: [{ substr: '{dictCode}', replacement: code }]
  })
}

const getDictByCode = code => {
  return request({
    ...api.getDictsByCode,
    params: {
      conditions: JSON.stringify([{ field: 'code', rule: 'eq', val: code }])
    }
  })
}

export { getEnableDictItemsByDictCode, getDictByCode }

/**
 * 获取字典数组
 * @param dictCode 字典Code
 * @return List<Map>
 */
export async function initDictOptions(dictCode) {
  if (!dictCode) {
    return '字典Code不能为空!'
  }
  // 获取字典数组
  let res = await getEnableDictItemsByDictCode(dictCode)
  return res
}

/**
 * 根据字典值获取字典对象
 * @param dictOptions  字典数组
 * @param val  字典值
 * @return String
 */
export function filterDictOptionByVal(dictOptions, val) {
  let re = {}
  dictOptions.forEach(option => {
    if (toString(val) === toString(option.itemVal)) {
      re = option
      return
    }
  })

  return re
}
