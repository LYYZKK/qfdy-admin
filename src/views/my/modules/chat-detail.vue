<template>
  <div class="left">
    <!-- 聊天详情 -->
    <div class="detail">
      <a-row v-for="(item,index) in chatData" :key="index">
        <a-col :span="24" style class="time">{{ new Date().toLocaleTimeString() }}</a-col>
        <a-col :span="24" class="receive margin_10" v-if="item.receive">
          <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          <span class="message">
            <span class="triangle"></span>
            {{ item.receive }}
          </span>
        </a-col>
        <a-col :span="24" class="send" v-if="item.send">
          <span class="message">
            <span class="triangle"></span>
            {{ item.send }}
          </span>
          <a-avatar icon="user" />
        </a-col>
      </a-row>
    </div>
    <!-- 编辑聊天内容 -->
    <a-row class="edite">
      <a-col class="emoj">
        <a-upload
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        >
          <a-icon type="smile" />
        </a-upload>
        <a-upload
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        >
          <a-icon type="picture" />
        </a-upload>
        <a-upload
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        >
          <a-icon type="folder-open" />
        </a-upload>
      </a-col>
      <a-col>
        <a-textarea :rows="1" v-model="singleData.send" @keyup.13="send" />
      </a-col>
      <a-col class="edite_btn">
        <a-popconfirm title="结束当前会话服务?" okText="确认" cancelText="取消">
          <a-button type="primary" class="over">结束服务</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="send" :disabled="singleData.send===''">发送</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { Row, Col, Avatar, Upload, Icon, Input, Popconfirm, Button } from 'ant-design-vue'
export default {
  name: 'ChatDetail',
  components: {
    AButton: Button,
    APopconfirm: Popconfirm,
    ATextarea: Input.TextArea,
    AIcon: Icon,
    AUpload: Upload,
    ARow: Row,
    ACol: Col,
    AAvatar: Avatar
  },
  data() {
    return {
      chatData: [{ receive: '你好，欢迎咨询相关业务。如遇客服繁忙，请留下联系方式，稍后将通过电话联系您' }],
      singleData: {
        send: ''
      }
    }
  },
  methods: {
    send() {
      if (this.singleData.send !== '') {
        this.chatData.push(this.singleData)
        this.singleData = { send: '' }
        setTimeout(() => {
          this.scrollContainer = document.querySelector('.detail')
          const el = this.scrollContainer
          el.scrollTop = el.scrollHeight - el.clientHeight
        }, 100)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.detail {
  height: 100%;
  padding: 10px;
  overflow: auto;
  padding-bottom: 120px;
  .time {
    text-align: center;
    margin-top: 10px;
  }
  .receive {
    display: flex;
    margin-top: 10px;
    .message {
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.1);
      display: inline-block;
      padding: 10px;
      max-width: 60%;
      margin: 0 10px;
      position: relative;
      .triangle {
        position: absolute;
        top: 5px;
        left: -20px;
        width: 20px;
        height: 20px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent rgba(0, 0, 0, 0.1) transparent transparent;
      }
    }
  }

  .send {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    .message {
      border-radius: 5px;
      background: #60de23;
      display: inline-block;
      padding: 10px;
      max-width: 60%;
      margin: 0 15px;
      position: relative;
      .triangle {
        position: absolute;
        top: 5px;
        right: -20px;
        width: 20px;
        height: 20px;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent transparent #60de23;
      }
    }
  }
}
.edite {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border-top: 1px solid #eee;
  .emoj {
    display: flex;
    font-size: 20px;
    .anticon {
      margin: 5px;
      cursor: pointer;
    }
  }
  textarea.ant-input {
    border-radius: 0;
    background-color: #fff;
    border: none;
    outline: none;
    &:focus {
      box-shadow: none;
    }
  }
  textarea {
    resize: none;
  }
  .edite_btn {
    display: flex;
    justify-content: flex-end;
    margin: 10px;
    .over {
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>


