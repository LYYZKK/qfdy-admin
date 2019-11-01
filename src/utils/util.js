import pick from 'lodash.pick'
import kebabCase from 'lodash.kebabcase'
import keys from 'lodash.keys'
import toString from 'lodash.tostring'
import moment from 'moment'

import store from '../store'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '我猜你可能累了']
  let index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  var regPos = /^\d+(\.\d+)?$/
  if (regPos.test(value)) {
    // 如果是数字
    let getDate = new Date(value)
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      S: getDate.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return fmt
  } else {
    // TODO
    value = value.trim()
    return value.substr(0, fmt.length)
  }
}

/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
  // 生成 最小值 到 最大值 区间的随机数
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  if (arguments.length === 1) {
    let [length] = arguments
    // 生成指定长度的随机数字，首位一定不是 0
    let nums = [...Array(length).keys()].map(i => (i > 0 ? random(0, 9) : random(1, 9)))
    return parseInt(nums.join(''))
  } else if (arguments.length >= 2) {
    let [min, max] = arguments
    return random(min, max)
  } else {
    return Number.NaN
  }
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * 下划线转驼峰
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string) {
  return string.replace(/_([a-z])/g, function(all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * 【从对象中copy指定属性到新属性并返回新对象】
 *
 * @param orignal_obj 源对象
 * @param old_keys 需要 copy 的属性
 * @param diff_old_new_keyMap 需要特殊转换名称的新旧属性关系, 格式：{ old_key: new_key }
 *
 * @return 替换属性名称后返回的新对象
 */
export function copy2NewKeyObject(orignal_obj = {}, old_keys = [], diff_old_new_keyMap = {}) {
  const new_obj = {}
  const diffOldKeys = keys(diff_old_new_keyMap)
  const originalObjKeys = keys(orignal_obj)

  if (old_keys.length > 0) {
    old_keys.forEach(old_key => {
      if (old_keys.includes(old_key)) {
        if (diffOldKeys.includes(old_key)) {
          new_obj[diff_old_new_keyMap[old_key]] = orignal_obj[old_key]
        } else if (originalObjKeys.includes(old_key)) {
          new_obj[old_key] = orignal_obj[old_key]
        }
      }
    })
  } else {
    for (let old_key in orignal_obj) {
      if (diffOldKeys.includes(old_key)) {
        new_obj[diff_old_new_keyMap[old_key]] = orignal_obj[old_key]
      } else if (originalObjKeys.includes(old_key)) {
        new_obj[old_key] = orignal_obj[old_key]
      }
    }
  }

  return new_obj
}

/**
 * 【从新对象中copy指定属性到旧对象】
 *
 * @param old_obj 旧对象
 * @param new_obj 新对象
 * @param keys 需要copy的属性列表, 默认为空表示全部copy
 * @param diff_old_new_keyMap 需要特殊转换名称的新旧属性关系, 格式：{ old_key: new_key }
 *
 * @return 替换属性名称后返回的新对象
 */
export function copy2OldObject(old_obj = {}, new_obj = {}, copy_Keys = [], diff_old_new_keyMap = {}) {
  const diffOldKeys = keys(diff_old_new_keyMap)
  const newObjKeys = keys(new_obj)

  if (copy_Keys.length > 0) {
    copy_Keys.forEach(key => {
      if (diffOldKeys.includes(key)) {
        old_obj[diff_old_new_keyMap[key]] = new_obj[key]
      } else if (newObjKeys.includes(key)) {
        old_obj[key] = new_obj[key]
      }
    })
  } else {
    for (let key in new_obj) {
      if (diffOldKeys.includes(key)) {
        old_obj[diff_old_new_keyMap[key]] = new_obj[key]
      } else if (newObjKeys.includes(key)) {
        old_obj[key] = new_obj[key]
      }
    }
  }

  return old_obj
}

// 解析树结构
export function list2Tree({ data = [], rootId, idFieldName = 'id', parentIdFielName = 'parentId' }) {
  const r = []
  const o = {}
  data.forEach(function(a) {
    if (o[a[idFieldName]] && o[a[idFieldName]].children) {
      a.children = o[a[idFieldName]] && o[a[idFieldName]].children
    }
    o[a[idFieldName]] = a
    if (a[parentIdFielName] === rootId || !a[parentIdFielName]) {
      r.push(a)
    } else {
      o[a[parentIdFielName]] = o[a[parentIdFielName]] || {}
      o[a[parentIdFielName]].children = o[a[parentIdFielName]].children || []
      o[a[parentIdFielName]].children.push(a)
    }
  })

  return r
}

/**
 * 生成 ant-design 树形结构专用数据.
 *
 * @param {*} data 树形 children 嵌套数组.
 * @param {*} titleField 显示为树形字典名字的字段名称.
 * @param {*} standardTree 是否标准树形结构 (说明: 一个节点只有一个上级节点为标准树形结构, 一个节点会存在于多个节点下为非标准树形结构).
 */
export function buildTreeDataForAntd({
  data = [],
  titleField = 'name',
  valueField = 'id',
  keyField = 'id',
  standardTree = true
}) {
  const ids = [],
    idMap = {},
    keyMap = {},
    valueMap = {}
  let idx = 0
  const buildTreeDataForAntd = items => {
    items.forEach(item => {
      idx++
      // 以下字段为 antd-tree-select 专门设置.
      item.id = toString(item.id)
      item.isLeaf = item.children && item.children.length > 0 ? false : true
      item.title = toString(item[titleField]) || ''
      item.value = standardTree ? item[valueField] : `${item[valueField]}-${idx}`
      item.key = standardTree ? item[keyField] : `${item[keyField]}-${idx}`

      ids.push(item.id)
      idMap[item.id] = item
      keyMap[item.key] = item
      valueMap[item.value] = item

      if (item.children && item.children.length > 0) {
        buildTreeDataForAntd(item.children)
      }
    })
  }
  buildTreeDataForAntd(data)
  return { ids, data, idMap, keyMap, valueMap }
}

const buildRouterForMenu = menu => {
  const menuRouter = { ...pick(menu, ['id', 'isRoute', 'redirect', 'menuType']) }

  if (menu.isRoute) {
    if (menu.component.indexOf('layouts') >= 0) {
      menuRouter.component = resolve => require([`@/components/${menu.component}.vue`], resolve)
    } else {
      menuRouter.component = resolve => require([`@/views/${menu.component}.vue`], resolve)
    }
    menuRouter.path = menu.url

    // 将有权访问的菜单访问路径存放到全局 store 中.
    if (menu.path) {
      store.dispatch('AddRouterUrls', menu.path)
    }

    menuRouter.name = kebabCase(menu.url)
    menuRouter.hidden = !!menu.hidden

    if (menu.alwaysShow) {
      menu.alwaysShow = true
      menu.redirect = menu.url
    }

    menuRouter.meta = {
      keepAlive: false,
      icon: menu.icon,
      title: menu.name
    }
  } else {
    menuRouter.action = menu.perms
  }

  return menuRouter
}

const fillRecursiveRoutersFromMenus = (menus, globalPermissions) => {
  const routerArr = [],
    permissionArr = []
  let menuRouter = {}
  let routes = {}
  menus.forEach(menu => {
    menuRouter = buildRouterForMenu(menu)

    /**
     * 菜单类型, 0: 一级菜单, 1: 子菜单, 2: 按钮/权限.
     */
    if (menuRouter.menuType === 2) {
      permissionArr.push(menuRouter)
      globalPermissions.push(menuRouter)
    } else {
      // 非按钮权限的 menu 才需要继续下一步子菜单处理.
      if (menu.children && menu.children.length > 0) {
        routes = fillRecursiveRoutersFromMenus(menu.children, globalPermissions)
      }

      if (routes.dynamicRouters && routes.dynamicRouters.length > 0) {
        menuRouter.children = routes.dynamicRouters
      }
      if (routes.permissions && routes.permissions.length > 0) {
        menuRouter.meta.permissionList = routes.permissions
      }

      if (menuRouter.isRoute) {
        routerArr.push(menuRouter)
      }
    }
  })

  return { dynamicRouters: routerArr, permissions: permissionArr }
}

export function getRecursiveRouterForMenuData({ data = [] }) {
  const globalPermissions = []
  const { dynamicRouters } = fillRecursiveRoutersFromMenus(data, globalPermissions)

  return {
    dynamicRouters,
    globalPermissions,
    constantRouters: [
      {
        path: '/',
        name: 'dashboard',
        component: resolve => require(['@/components/layouts/TabLayout'], resolve),
        meta: { title: '首页', icon: 'home' },
        redirect: '/dashboard/analysis',
        children: [...dynamicRouters]
      },
      {
        path: '*',
        redirect: '/404',
        hidden: true,
        component: resolve => require(['@/views/404.vue'], resolve)
      }
    ]
  }
}

// 获取一个时间的开始时间戳.
export function getStartTimestamp(timeStr, type) {
  const typeArray = ['hour', 'day', 'week', 'month', 'year']
  let startTime
  if (type && typeArray.includes(type)) {
    switch (type) {
      case 'hour':
        startTime = moment(timeStr, 'YYYY-MM-DD HH')
        break
      case 'day':
        startTime = moment(timeStr, 'YYYY-MM-DD')
        break
      case 'week':
        startTime = moment(timeStr, 'YYYY WW')
        break
      case 'month':
        startTime = moment(timeStr, 'YYYY-MM')
        break
      case 'year':
        startTime = moment(timeStr, 'YYYY')
        break
    }
  } else {
    return new Error(`type 只支持[${typeArray}]`)
  }
  return startTime.valueOf()
}

// 获取一个时间的结束时间戳.
export function getEndTimestamp(timeStr, type) {
  const typeArray = ['hour', 'day', 'week', 'month', 'year']
  let endTime
  if (type && typeArray.includes(type)) {
    switch (type) {
      case 'hour':
        endTime = moment(timeStr, 'YYYY-MM-DD HH')
          .add(1, 'hours')
          .subtract(1, 'ms')
        break
      case 'day':
        endTime = moment(timeStr, 'YYYY-MM-DD')
          .add(1, 'days')
          .subtract(1, 'ms')
        break
      case 'week':
        endTime = moment(timeStr, 'YYYY WW')
          .add(1, 'weeks')
          .subtract(1, 'ms')
        break
      case 'month':
        endTime = moment(timeStr, 'YYYY-MM')
          .add(1, 'months')
          .subtract(1, 'ms')
        break
      case 'year':
        endTime = moment(timeStr, 'YYYY')
          .add(1, 'years')
          .subtract(1, 'ms')
        break
    }
  } else {
    return new Error(`type 只支持[${typeArray}]`)
  }
  return endTime.valueOf()
}

export function getIDCardInfo(idcard) {
  const obj = {}

  const addstr = idcard.substring(6, 14)
  const applicantBirthDay =
    addstr.substring(0, 4) + '-' + addstr.substring(4, 6) + '-' + addstr.substring(6, addstr.length)
  obj['birthDay'] = applicantBirthDay

  const sexCode = idcard.substring(idcard.length - 2, idcard.length - 1)
  obj['sex'] = parseInt(sexCode) % 2 === 0 ? 'female' : 'male'

  return obj
}

export function diffTime({ startTime, endTime, type = 'seconds' }) {
  const start = moment(startTime, 'YYYY-MM-DD HH:mm:ss')
  const end = moment(endTime, 'YYYY-MM-DD HH:mm:ss')

  return end.diff(start, type)
}
