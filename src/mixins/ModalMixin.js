import pick from 'lodash.pick'
import { Promise } from 'bluebird'

import { request, request2 } from '@/api'

import CommonMixin from '@/mixins/CommonMixin'

export default {
  mixins: [CommonMixin],
  data() {
    return {
      visible: false,
      model: {},
      operateType: 'add',
      confirmLoading: false,
      form: this.$form.createForm(this),
      formFields: [],
      aliveFormDataKey: 'addFormData',
      drawerWidth: 700,
      defaultAddFormData: {},
      testingMode: false
    }
  },
  methods: {
    dealModelAfterGetById() {},
    getById(id) {
      const _this = this
      return new Promise(resolve => {
        const requestThen = res => {
          if (res.success) {
            _this.model = Object.assign({}, res.data)
          } else {
            _this.$message.warning(res.message)
          }
          _this.dealModelAfterGetById()
          resolve(res.success)
        }
        if (this.testingMode) {
          request2({ ...this.api.getById, urlReplacements: [{ substr: '{id}', replacement: id }] }).then(res => {
            requestThen(res)
          })
        } else {
          request({ ...this.api.getById, urlReplacements: [{ substr: '{id}', replacement: id }] }).then(res => {
            requestThen(res)
          })
        }
      })
    },
    beforeAdd() {},
    add() {
      this.resetScreenSize()
      this.model = this.getAliveData()[this.aliveFormDataKey] || this.defaultAddFormData
      const flag = this.beforeAdd()
      if (flag === false) {
        return false
      }
      this.setFormFieldsValue()
    },
    beforeEdit() {},
    setFormFieldsValue() {
      this.visible = true
      const _this = this
      this.$nextTick(() => {
        _this.form.setFieldsValue(pick(_this.model, ..._this.formFields))
      })
    },
    edit(record) {
      this.resetScreenSize()
      this.form.resetFields()
      this.model = Object.assign({}, record)

      const _this = this
      if (_this.operateType === 'edit') {
        _this.getById(record.id).then(success => {
          if (success) {
            const flag = _this.beforeEdit()
            if (flag === false) {
              return false
            }
            this.setFormFieldsValue()
          }
        })
      }
    },
    beforeShow() {},
    show(record) {
      this.resetScreenSize()
      const _this = this
      this.getById(record.id).then(success => {
        if (success) {
          const flag = this.beforeShow()
          if (flag === false) {
            return false
          }
          _this.$nextTick(() => {
            this.visible = true
          })
        }
      })
    },
    // eslint-disable-next-line no-unused-vars
    beforeHandleOkRequest(formData) {},
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let requestParam = this.model.id ? this.api.edit : this.api.add
          let formData = Object.assign(this.model, values)

          Object.keys(formData).forEach(k => {
            // 布尔类型自动转换为数字的 0 和 1.
            if (typeof formData[k] === 'boolean') {
              formData[k] = formData[k] ? 1 : 0
            }
          })

          formData = this.getFormData(formData)
          const urlReplacements = this.getUrlReplacements()

          const flag = this.beforeHandleOkRequest(formData)
          if (flag === false) {
            return false
          }

          const requestThen = res => {
            if (res.success) {
              _this.close(res.success)
              _this.$message.success(res.message)
              _this.$emit('ok')
            } else {
              _this.$message.warning(res.message)
            }
            this.afterHandleOkRequest(res)
          }

          this.confirmLoading = true
          if (this.testingMode) {
            console.log('into handleOk 6')
            request2({ ...requestParam, params: formData, urlReplacements })
              .then(res => {
                requestThen(res)
              })
              .finally(() => {
                _this.confirmLoading = false
              })
          } else {
            console.log('into handleOk 7')
            request({ ...requestParam, params: formData, urlReplacements })
              .then(res => {
                requestThen(res)
              })
              .finally(() => {
                _this.confirmLoading = false
              })
          }
        }
      })
    },
    /**
     * 发送请求之后的扩展回调函数.
     *
     * @param {*} res 发请求后的返回结果.
     */
    // eslint-disable-next-line no-unused-vars
    afterHandleOkRequest(res) {},
    getUrlReplacements() {
      return [{ substr: '{id}', replacement: this.model.id }]
    },
    getFormData(formData) {
      return formData
    },
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < this.drawerWidth) {
        this.modalWidth = screenWidth
      } else {
        this.modalWidth = this.drawerWidth
      }
    },
    handleCancel() {
      this.close()
    },
    beforeClose() {},
    close(success) {
      const flag = this.beforeClose()
      if (flag === false) {
        return false
      }
      this.$emit('close')
      this.visible = false

      if (this.operateType === 'add') {
        if (success) {
          // TODO 删除已经提交成功的 alivedata.
        } else {
          this.$emit('saveAliveData', {
            key: this.aliveFormDataKey,
            val: Object.assign(this.model, this.form.getFieldsValue())
          })
        }
      }
    }
  }
}
