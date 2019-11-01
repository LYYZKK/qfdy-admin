<template>
  <div class="form-dialog-content-header">
    <a-row type="flex" justify="end">
      <a-col class="color-blue" @click="preview">
        <a-icon type="eye" class="icon-logo" />预览
      </a-col>
      <a-col class="color-blue" @click="saveFormData" v-if="hasData && !isModify">
        <a-icon type="save" class="icon-logo" />保存
      </a-col>
      <a-col class="color-blue" @click="updateFormData" v-if="hasData && isModify">
        <a-icon type="save" class="icon-logo" />修改并保存
      </a-col>
      <a-popconfirm
        title="关闭表单设计器？"
        @confirm="closeToParent"
        @cancel="cancel"
        okText="是"
        cancelText="否"
      >
        <a-col class="color-red">
          <a-icon type="close-circle" class="icon-logo" />关闭
        </a-col>
      </a-popconfirm>
    </a-row>
  </div>
</template>
<script>
import { Row, Col, Icon, Popconfirm } from 'ant-design-vue'
export default {
  name: 'Buttons',
  data() {
    return {}
  },
  props: {
    hasData: {
      type: Boolean,
      default() {
        return false
      }
    },
    isModify: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeToParent() {
      this.$emit('closeBtn')
    },
    saveFormData() {
      console.log('保存')
      this.$emit('saveBtn')
    },
    preview() {
      console.log('预览')
      this.$emit('previewBtn')
    },
    // 修改
    updateFormData() {
      console.log('修改')
      this.$emit('updateBtn')
    },
    cancel() {
      console.log('取消')
    }
  },
  components: {
    ARow: Row,
    ACol: Col,
    AIcon: Icon,
    APopconfirm: Popconfirm
  }
}
</script>

<style lang="less" scoped>
.form-dialog-content-header {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  line-height: 40px;
  color: #000;
  border-bottom: 1px solid #ccc;
  text-align: right;
  padding: 0 20px;
  background: #fff;
  .color-blue {
    color: #409eff;
    cursor: pointer;
    text-align: right;
  }
  .color-red {
    color: red;
    cursor: pointer;
  }
  .icon-logo {
    font-size: 14px;
    margin: 0 5px 0 20px;
    cursor: pointer;
  }
}
</style>

