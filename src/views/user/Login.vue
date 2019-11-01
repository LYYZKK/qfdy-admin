<template>
  <a-row type="flex" justify="center" align="top">
    <a-col v-bind="formColResponsiveCfg">
      <a-form :form="form" class="user-layout-login m-t-60">
        <a-form-item hasFeedback>
          <a-input
            size="large"
            v-decorator="['username',validatorRules.username,{ validator: this.checkIsUsernameOrEmail }]"
            type="text"
            placeholder="请输入用户名"
          >
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>

        <a-form-item hasFeedback>
          <a-input
            v-decorator="['password',validatorRules.password]"
            size="large"
            type="password"
            autocomplete="false"
            placeholder="请输入密码"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>

        <a-form-item class="m-t-24">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="loginBtnLoading"
            @click.stop.prevent="handleSubmit"
            :disabled="loginBtnLoading"
          >登录</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'

import { mixinDevice } from '@/utils/mixin.js'

import JGraphicCode from '@/components/jeecg/JGraphicCode'

import { timeFix } from '@/utils/util'
import { isUsernameOrEmail } from '@/utils/validate'

import { ACCESS_TOKEN } from '@/store/mutation-types'

import { Modal, Row, Col, Tabs, Form, Select, Tooltip, Icon, Input, Avatar, Button, Checkbox } from 'ant-design-vue'

export default {
  components: {
    JGraphicCode,
    AModal: Modal,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AForm: Form,
    AFormItem: Form.Item,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATooltip: Tooltip,
    AIcon: Icon,
    AInput: Input,
    AAvatar: Avatar,
    AButton: Button,
    ARow: Row,
    ACol: Col,
    ACheckbox: Checkbox
  },
  mixins: [mixinDevice],
  data() {
    return {
      formColResponsiveCfg: {
        xs: 22,
        sm: 14,
        md: 12
      },
      loginBtnLoading: false,
      // login type: 0 email, 1 username, 2 telephone.
      loginType: 0,
      form: this.$form.createForm(this),
      validatorRules: {
        username: { rules: [{ required: true, message: '请输入用户名!', validator: 'click' }] },
        password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] }
      }
    }
  },
  created() {
    this.formColResponsiveCfg.lg = this.isDesktop() ? 24 : 12
    Vue.ls.remove(ACCESS_TOKEN)
    this.getRouterData()
  },
  watch: {
    device() {
      this.formColResponsiveCfg.lg = this.isDesktop() ? 24 : 12
      this.$forceUpdate()
    }
  },
  methods: {
    ...mapActions(['Login']),
    checkIsUsernameOrEmail(rule, value, callback) {
      if (isUsernameOrEmail(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    handleSubmit() {
      const _this = this

      this.form.validateFields(['username', 'password', 'inputCode'], { force: true }, (err, values) => {
        if (!err) {
          _this.loginBtnLoading = true

          _this
            .Login({
              params: {
                username: values.username,
                password: values.password
              }
            })
            .then(res => {
              if (res.success) {
                _this.loginSuccess()
              } else {
                _this.$notification.error({
                  message: '登录失败',
                  description: res.message,
                  duration: 4
                })
              }
            })
            .finally(() => {
              _this.loginBtnLoading = false
            })
        }
      })
    },
    loginSuccess() {
      this.$router.push({ name: 'dashboard' })
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
      })
    },
    getRouterData() {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          username: this.$route.params.username
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
<style>
.valid-error .ant-select-selection__placeholder {
  color: #f5222d;
}
</style>
