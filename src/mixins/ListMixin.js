/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * data -> url 定义参考:
 *
 * {
 *    list: 查询列表,
 *    deleteBatch: 批量删除与删除单条记录
 * }
 */
import keys from 'lodash.keys'
import toString from 'lodash.tostring'
import { Promise } from 'bluebird'
import Vue from 'vue'

import { filterObj } from '@/utils/util'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'

import { request, request2 } from '@/api'

export default {
  data() {
    const tokenHeader = {}
    tokenHeader[ACCESS_TOKEN] = Vue.ls.get(ACCESS_TOKEN)
    return {
      operatingRecord: {},
      // token header
      tokenHeader,
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      queryParamWithQueryType: [],
      /* 查询条件类型 */
      queryType: {},
      queryTypeAlias: {
        // 全模糊.
        like(fieldName, val) {
          return { field: fieldName, rule: 'like', val }
        },
        // 左模糊.
        l_like(fieldName, val) {
          return { field: fieldName, rule: 'l_like', val }
        },
        // 右模糊.
        r_like(fieldName, val) {
          return { field: fieldName, rule: 'r_like', val }
        },
        // 大于.
        gt(fieldName, val) {
          return { field: fieldName, rule: 'gt', val }
        },
        // 大于等于.
        ge(fieldName, val) {
          return { field: fieldName, rule: 'ge', val }
        },
        // 等于.
        eq(fieldName, val) {
          return { field: fieldName, rule: 'eq', val }
        },
        // 小于.
        lt(fieldName, val) {
          return { field: fieldName, rule: 'lt', val }
        },
        // 小于等于.
        le(fieldName, val) {
          return { field: fieldName, rule: 'le', val }
        },
        // 不等于.
        ne(fieldName, val) {
          return { field: fieldName, rule: 'ne', val }
        },
        // 包含, 传值方式为逗号分隔字符串.
        in(fieldName, val) {
          return { field: fieldName, rule: 'in', val }
        }
      },
      /**
       * 默认筛选参数.
       *
       * 以下示例的意思是各模块配置默认查询条件 (不渲染在查询框中), 以下条件会生成查询 sql 为 name = '张三' and age >= 1 and age < 10.
       *
       * e.g: [
       *    { field: 'name', rule: 'eq', val: '张三' },
       *    { field: 'age', rule: 'gte', val: '1' },
       *    { field: 'age', rule: 'lt', val: '10' }
       *  ]
       */
      filters: [],
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100', '200', '500'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        sortColumn: 'updateAt',
        sortOrder: 'desc'
      },
      defaultParam: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys */
      selectedRowKeys: [],
      /* table选中records */
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      settingColumns: [],
      columns: [],
      dictCodes: [],
      dictCodeOptionMap: {},
      dictCodeMap: {},
      listUrlReplacements: [],
      defaultQueryFields: [],
      testingMode: false
    }
  },
  created() {
    const dictPromises = this.initDictConfig()
    Promise.all(dictPromises).then(() => {
      if (this.defColumns && this.defColumns.length > 0) {
        this.initColumns()
      }
      this.loadData()
    })
  },
  methods: {
    initDictConfig() {
      const _this = this
      const promises = []
      this.dictCodes.forEach(dictCode => {
        promises.push(
          new Promise(resolve => {
            initDictOptions(dictCode).then(res => {
              if (res.success) {
                _this.dictCodeMap[dictCode] = res.data
                _this.dictCodeOptionMap[dictCode] = res.data
                resolve(true)
              }
            })
          })
        )
      })
      return promises
    },
    beforeList() {},
    refresh() {
      this.loadData()
    },
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }

      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1 && this.ipagination !== false) {
        this.ipagination.current = 1
      }

      let params = this.getQueryParams()

      const requestThen = res => {
        this.loading = false
        this.afterList(res)
        if (res.success) {
          this.dataSource = res.data
          if (res.page) {
            this.ipagination.total = res.page.totalCount
          } else {
            this.ipagination = false
          }
        } else {
          this.$message.warning(res.message)
        }
      }

      const flag = this.beforeList()
      if (flag === false) {
        return false
      }

      this.loading = true
      if (this.testingMode) {
        request2({ url: this.url.list, params, urlReplacements: this.listUrlReplacements }).then(res => {
          requestThen(res)
        })
      } else {
        request({ url: this.url.list, params, urlReplacements: this.listUrlReplacements }).then(res => {
          requestThen(res)
        })
      }
    },

    // eslint-disable-next-line no-unused-vars
    afterList(res) {},
    filterQueryParamsByQueryType() {
      // 每次查询前需清空.
      this.queryParamWithQueryType = []
      keys(this.queryParam).forEach(v => {
        if (toString(this.queryParam[v]) !== '') {
          if (this.queryParam[v] instanceof Array) {
            this.queryParamWithQueryType.push(
              this.queryTypeAlias[(this.queryType[v] && this.queryType[v][0]) || 'ge'](v, this.queryParam[v][0])
            )
            this.queryParamWithQueryType.push(
              this.queryTypeAlias[(this.queryType[v] && this.queryType[v][1]) || 'le'](v, this.queryParam[v][1])
            )
          } else {
            this.queryParamWithQueryType.push(this.queryTypeAlias[this.queryType[v] || 'eq'](v, this.queryParam[v]))
          }
        }
      })
      this.filters.forEach(filter => {
        if (filter.val && toString(filter.val) !== '') {
          this.queryParamWithQueryType.push(filter)
        }
      })
    },
    beforeGetQueryParams() {},
    getQueryParams() {
      this.beforeGetQueryParams()

      // 获取查询条件
      var param = {
        ...this.defaultParam,
        ...this.queryParam
      }
      // param.fields = this.getQueryFields()
      // this.filterQueryParamsByQueryType()
      // param.conditions = JSON.stringify(this.queryParamWithQueryType)
      // param.sorts = this.isorter.sortColumn
      //   ? JSON.stringify([{ field: this.isorter.sortColumn, direction: this.isorter.sortOrder }])
      //   : []
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize

      return filterObj(param)
    },
    getQueryFields() {
      // TODO 字段权限控制
      var str = 'id'
      this.columns.forEach(value => {
        // 去除掉空的排序、操作等字段.
        if (value.dataIndex && value.dataIndex != 'action') str += ',' + value.dataIndex
      })
      if (this.defaultQueryFields.length > 0) str += `,${this.defaultQueryFields.join(',')}`
      return str
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchQuery() {
      this.loadData(1)
    },
    searchReset() {
      for (let key in this.queryParam) {
        if (this.queryParam[key] instanceof Array) {
          this.queryParam[key] = []
        } else {
          this.queryParam[key] = null
        }
      }
      this.loadData(1)
    },
    batchDel() {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = this.selectedRowKeys.join(',')
        var _this = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk() {
            const requestThen = res => {
              if (res.success) {
                _this.$message.success(res.message)
                _this.loadData()
                _this.onClearSelected()
              } else {
                _this.$message.warning(res.message)
              }
            }
            if (_this.testingMode) {
              request2({
                url: _this.url.deleteBatch,
                method: 'delete',
                urlReplacements: [{ substr: '{ids}', replacement: ids }]
              }).then(res => {
                requestThen(res)
              })
            } else {
              request({
                url: _this.url.deleteBatch,
                method: 'delete',
                urlReplacements: [{ substr: '{ids}', replacement: ids }]
              }).then(res => {
                requestThen(res)
              })
            }
          }
        })
      }
    },
    handleDelete(id) {
      var _this = this
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      const requestThen = res => {
        if (res.success) {
          _this.$message.success(res.message)
          _this.loadData()
        } else {
          _this.$message.warning(res.message)
        }
      }

      if (_this.testingMode) {
        request2({
          url: _this.url.deleteBatch,
          method: 'delete',
          urlReplacements: [{ substr: '{ids}', replacement: id }]
        }).then(res => {
          requestThen(res)
        })
      } else {
        request({
          url: _this.url.deleteBatch,
          method: 'delete',
          urlReplacements: [{ substr: '{ids}', replacement: id }]
        }).then(res => {
          requestThen(res)
        })
      }
    },
    // eslint-disable-next-line no-unused-vars
    beforeShow(record) {},
    handleShow(record) {
      const flag = this.beforeShow(record)
      if (flag === false) {
        return false
      }
      this.$refs.modalForm.title = '查看'
      this.$refs.modalForm.operateType = 'show'
      this.$refs.modalForm.show(record)
    },
    // eslint-disable-next-line no-unused-vars
    beforeEdit(record) {},
    handleEdit(record) {
      const flag = this.beforeEdit(record)
      if (flag === false) {
        return false
      }
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.operateType = 'edit'
      this.$refs.modalForm.edit(record)
    },
    beforeAdd() {},
    handleAdd() {
      const flag = this.beforeAdd()
      if (flag === false) {
        return false
      }
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.operateType = 'add'
      this.$refs.modalForm.add()
    },
    handleTableChange(pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      // TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.sortColumn = sorter.field
        this.isorter.sortOrder = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
    },
    // 列设置更改事件
    onColSettingsChange(checkedValues) {
      var key = this.$route.name + ':colsettings'
      Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
      this.settingColumns = checkedValues
      const cols = this.defColumns.filter(item => {
        if (item.key == 'rowIndex' || item.dataIndex == 'action') {
          return true
        }
        if (this.settingColumns.includes(item.dataIndex)) {
          return true
        }
        return false
      })
      this.columns = cols
    },
    initColumns() {
      var key = this.$route.name + ':colsettings'
      let colSettings = Vue.ls.get(key)
      if (colSettings == null || colSettings == undefined) {
        let allSettingColumns = []
        // eslint-disable-next-line no-unused-vars
        this.defColumns.forEach((item, i, array) => {
          allSettingColumns.push(item.dataIndex)
        })
        this.settingColumns = allSettingColumns
        this.columns = this.defColumns
      } else {
        this.settingColumns = colSettings
        const cols = this.defColumns.filter(item => {
          if (item.key == 'rowIndex' || item.dataIndex == 'action') {
            return true
          }
          if (colSettings.includes(item.dataIndex)) {
            return true
          }
          return false
        })
        this.columns = cols
      }
    }
  }
}
