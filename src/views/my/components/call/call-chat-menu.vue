<template>
  <div>
    <div class="menu-title">
      <b>会话</b>
      <a-icon
        class="call-section-trigger"
        type="menu-unfold"
        title="展开聊天区"
        @click.native="openChatSection"
        v-if="showMenuTrigger || (device !== 'mobile' && !$store.state.my.callChatOpened)"
      ></a-icon>
    </div>
    <a-menu mode="inline" theme="light" :defaultSelectedKeys="[0]" @click="menuHandleClick">
      <!-- <a-menu-item v-for="(item,index) in menuItems" :key="index" :flag="item.type">
        <a-row :class="item.type">
          <a-avatar class="avatar phone" :size="40">
            <a-icon :type="item.type" theme="filled" />
          </a-avatar>
          <div class="content-container">
            <div v-if="item.type==='wechat'">{{ item.name }}</div>
            <div v-if="item.type==='phone'">{{ item.phoneNumber }}</div>
            <div class="fz-12">{{ item.content }}</div>
          </div>
          <div class="count-and-time">
            <div>{{ item.time }}</div>
            <a-badge v-if="item.type==='wechat'" count="25" />
            <div v-if="item.type==='phone'" class="phone-status">通话</div>
          </div>
        </a-row>
      </a-menu-item>-->
      <a-menu-item v-for="(item,index) in menuItems" :key="index" flag="phone">
        <a-row class="phone">
          <a-avatar class="avatar phone" :size="40">
            <a-icon type="phone" theme="filled" />
          </a-avatar>
          <div class="content-container">
            <div>{{ item.customer.name }}</div>
            <!-- <div v-if="item.type==='wechat'">{{ item.name }}</div> -->
            <!-- <div v-if="item.type==='phone'">{{ item.phoneNumber }}</div> -->
            <!-- <div class="fz-12">{{ item.content }}</div> -->
          </div>
          <!-- <div class="count-and-time"> -->
          <!-- <div>{{ item.time }}</div> -->
          <!-- <a-badge v-if="item.type==='wechat'" count="25" /> -->
          <!-- <div v-if="item.type==='phone'" class="phone-status">通话</div> -->
          <!-- </div> -->
        </a-row>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { triggerWindowResizeEvent } from '@/utils/util'
import { Icon, Menu, Badge, Row, Avatar } from 'ant-design-vue'
import { mapState } from 'vuex'
export default {
  components: {
    AIcon: Icon,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ARow: Row,
    AAvatar: Avatar,
    ABadge: Badge
  },
  name: 'CallChatMenu',
  mixins: [mixinDevice],
  props: {
    showMenuTrigger: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      taskData: state => state.my.taskData
    })
  },
  data() {
    return {
      menuItems: [
        // { type: 'wechat', content: '一般咨询', name: '微信名称', time: '9:30' },
        // { type: 'phone', content: '一般咨询', phoneNumber: '13611111234', time: '9:30' }
      ]
    }
  },
  methods: {
    menuHandleClick(obj) {
      this.$emit('contentType', obj.item.$attrs.flag)
    },
    openChatSection() {
      this.$store.dispatch('setCallChatStatus', true)
      triggerWindowResizeEvent()
    }
  },
  beforeMount() {
    this.$set(this.menuItems, this.menuItems.length, this.taskData.data)
    // this.$emit('contentType', this.menuItems[0].type)
    this.$emit('contentType', 'phone')
  }
}
</script>

<style lang='scss' scoped>
.fr {
  float: right !important;
}
.fl {
  float: left !important;
}
.inline-block {
  display: inline-block;
}
.menu-title {
  height: 40px;
  padding-left: 15px;
  background: #fff;
  .call-section-trigger {
    float: right;
    font-size: 20px;
    margin-top: 10px;
    margin-right: 5px;
    cursor: pointer;
    &:hover {
      color: #57afff;
    }
  }
  b {
    line-height: 40px;
  }
}
.ant-menu-inline {
  border-right: none;
}
.ant-menu-item {
  margin: 0;
  padding: 5px 5px !important;
  height: 50px;
  line-height: normal;
  box-sizing: border-box;
  width: 100%;
  .ant-row {
    height: 100%;
    .avatar {
      float: left;
      ::v-deep i {
        margin-right: 0;
        font-size: 20px;
      }
    }
    &.wechat {
      .avatar {
        background: #68d48b;
      }
    }
    &.phone {
      .avatar {
        background: #6ac5e0;
      }
    }
    .phone-status {
      color: #8ebf64;
    }
    div.content-container {
      float: left;
      margin-left: 5px;
      width: 100px;
      div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    div.count-and-time {
      float: right;
      width: 40px;
    }
  }
  .ant-badge {
    z-index: 1;
  }
}
</style>
