<template>
  <div class="user-wrapper" :class="theme">
    <!-- <span class="action" title="在线客服" @click="onlineChat">
      <a-icon type="customer-service" />
    </span>-->
    <span class="action action-setting-drawer" title="系统设置" @click="showSettingDrawer">
      <a-icon type="setting" />
    </span>
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="getAvatar()" />
        <span v-if="isDesktop()">欢迎您，{{ nickname() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!-- <a-menu-item key="0">
          <router-link :to="{ name: 'account-center' }">
            <a-icon type="user" />
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link :to="{ name: 'account-settings-base' }">
            <a-icon type="setting" />
            <span>账户设置</span>
          </router-link>
        </a-menu-item>-->
        <a-menu-item key="2" @click="changePassword">
          <a-icon type="lock" />
          <span>修改密码</span>
        </a-menu-item>
        <!-- <a-menu-item key="2" disabled>
          <a-icon type="setting"/>
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>-->
      </a-menu>
    </a-dropdown>
    <span class="action">
      <a class="logout_title" href="javascript:;" @click="handleLogout">
        <a-icon type="logout" />
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>
    <change-password ref="changePassword"></change-password>
    <setting-drawer ref="settingDrawer"></setting-drawer>
  </div>
</template>

<script>
import ChangePassword from './ChangePassword'
import { mapActions, mapGetters } from 'vuex'
import { mixinDevice } from '@/utils/mixin.js'

import SettingDrawer from '@/components/setting/SettingDrawer'
import { Icon, Dropdown, Avatar, Menu } from 'ant-design-vue'

export default {
  name: 'UserMenu',
  mixins: [mixinDevice],
  components: {
    ChangePassword,
    SettingDrawer,
    AIcon: Icon,
    ADropdown: Dropdown,
    AAvatar: Avatar,
    AMenu: Menu,
    AMenuItem: Menu.Item
  },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    getAvatar() {
      return ''
      // return process.env.BASE_URL + '/' + this.avatar()
    },
    showSettingDrawer() {
      this.$refs.settingDrawer.showDrawer()
    },
    handleLogout() {
      const _this = this

      this.$confirm({
        title: '请确认',
        content: '确定退出登录吗 ?',
        onOk() {
          return _this
            .Logout()
            .then(() => {
              window.location.href = '/'
            })
            .catch(err => {
              _this.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    },
    changePassword() {
      let username = this.userInfo().username
      this.$refs.changePassword.show(username)
    },
    onlineChat() {
      let baseUrl = window.location.origin
      window.open(baseUrl + '/webchat')
    }
  }
}
</script>

<style scoped>
.logout_title {
  color: inherit;
  text-decoration: none;
}
.action-setting-drawer {
  font-size: 16px;
}
</style>
