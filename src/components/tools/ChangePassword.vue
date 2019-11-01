<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="旧密码">
          <a-input
            type="password"
            placeholder="请输入旧密码"
            v-decorator="[ 'password', validatorRules.password]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新密码">
          <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
            <template slot="content">
              <div class="w-240">
                <div :class="['password-level', passwordLevelClass]">
                  强度：
                  <span>{{ passwordLevelName }}</span>
                </div>
                <a-progress
                  :percent="state.percent"
                  :showInfo="false"
                  :strokeColor="passwordLevelColor "
                />
                <div class="m-t-10">
                  <div>请至少输入 8 个字符。</div>
                  <div>请不要使用容易被猜到的密码。</div>
                </div>
              </div>
            </template>

            <a-input
              type="password"
              v-decorator="[ 'newPassword', validatorRules.newPassword]"
              @click="handlePasswordInputClick"
              autocomplete="false"
              placeholder="请输入新密码，至少8位，区分大小写"
            ></a-input>
          </a-popover>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="确认新密码">
          <a-input
            type="password"
            @blur="handleConfirmBlur"
            placeholder="请确认新密码"
            v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { request } from '@/api'
import { mixinDevice } from '@/utils/mixin.js'
import { mapGetters } from 'vuex'

import { Modal, Spin, Form, Input, Popover, Progress } from 'ant-design-vue'

const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}

export default {
  name: 'ChangePassword',
  components: {
    AModal: Modal,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    APopover: Popover,
    AProgress: Progress
  },
  mixins: [mixinDevice],
  data() {
    return {
      title: '修改密码',
      modalWidth: 600,
      visible: false,
      confirmLoading: false,
      validatorRules: {
        password: {
          rules: [
            {
              required: true,
              message: '请输入旧密码!'
            }
          ]
        },
        newPassword: {
          rules: [
            {
              required: true,
              message: '请输入新密码!'
            },
            {
              validator: this.handlePasswordLevel
            }
          ],
          validateTrigger: ['change', 'blur']
        },
        confirmpassword: {
          rules: [
            {
              required: true,
              message: '请确认新密码!'
            },
            {
              validator: this.compareToFirstPassword
            }
          ]
        }
      },
      confirmDirty: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      form: this.$form.createForm(this),
      api: {
        changePassword: {
          url: 'user/users/change-password',
          method: 'patch'
        }
      },
      username: ''
    }
  },
  computed: {
    passwordLevelClass() {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName() {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor() {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    show(uname) {
      if (!uname) {
        this.$message.warning('当前系统无登陆用户!')
        return
      } else {
        this.username = uname
        this.form.resetFields()
        this.visible = true
      }
    },
    handleCancel() {
      this.state.passwordLevelChecked = false
      this.close()
    },
    close() {
      this.$emit('close')
      this.state.passwordLevelChecked = false
      this.visible = false
      this.selectedRole = []
    },
    handleOk() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          _this.confirmLoading = true
          request({
            ...this.api.changePassword,
            params: {
              ...values,
              id: this.userInfo().id
            }
          })
            .then(res => {
              if (res.success) {
                _this.$message.success(res.message)
                _this.close()
              } else {
                _this.$message.warning(res.message)
              }
            })
            .finally(() => {
              _this.confirmLoading = false
            })
        }
      })
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    handlePasswordLevel(rule, value, callback) {
      let level = 0
      let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/
      if (!reg.test(value)) {
        callback(new Error('密码由至少8位数字、大小写字母和特殊符号组成!'))
      }
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },

    handlePasswordInputClick() {
      if (!this.isMobile()) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    }
  }
}
</script>

<style lang="scss" scoped>
.password-level {
  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }
}
</style>

