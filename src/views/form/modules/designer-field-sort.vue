<template>
  <div class="filed">
    <div class="filed-title">基础字段</div>
    <a-row class="filed-main">
      <draggable
        :list="fieldNames"
        :options="{group:{name:groupName,pull:'clone'},filter:'.undraggable',sort:false}"
        :clone="cloneDog"
      >
        <a-col class="filed-item" v-for="(item,index) in fieldNames" :key="index" :span="10">
          <a-icon :type="item.iconType" />
          {{ item.name }}
        </a-col>
      </draggable>
    </a-row>
  </div>
</template>
<script>
import { Row, Col, Icon } from 'ant-design-vue'
import draggable from 'vuedraggable'
export default {
  data() {
    return {
      show: false,
      fieldNames: [
        {
          iconType: 'file',
          name: '单行文本',
          type: 'text'
        },
        {
          iconType: 'file-text',
          name: '多行文本',
          type: 'textarea'
        },
        {
          iconType: 'calculator',
          name: '数字',
          type: 'number'
        },
        {
          iconType: 'check-circle',
          name: '单选',
          type: 'radio'
        },
        {
          iconType: 'check-square',
          name: '多选',
          type: 'checkbox'
        },
        {
          iconType: 'select',
          name: '下拉框',
          type: 'select'
        },
        {
          iconType: 'profile',
          name: '多选下拉框',
          type: 'multipleSelect'
        },
        {
          iconType: 'calendar',
          name: '日期时间',
          type: 'dateTime'
        },
        {
          iconType: 'schedule',
          name: '日期',
          type: 'date'
        },
        {
          iconType: 'clock-circle',
          name: '时间',
          type: 'time'
        },
        {
          iconType: 'form',
          name: '富文本',
          type: 'editor'
        },
        {
          iconType: 'shop',
          name: '地址',
          type: 'address'
        },
        {
          iconType: 'picture',
          name: '图片',
          type: 'img'
        }
      ]
    }
  },
  props: {
    groupName: {
      type: String,
      default() {
        return ''
      }
    }
  },
  methods: {
    cloneDog(val) {
      this.$emit('cloneDom', val)
    },
    end(ev) {
      if (ev.oldIndex === 2) {
        this.show = true
      }
    }
  },
  components: {
    draggable,
    ARow: Row,
    ACol: Col,
    AIcon: Icon
  }
}
</script>

<style lang="less" scoped>
.undraggable {
  color: red;
}
.filed {
  padding: 0 10px;
}
.filed-title {
  margin-top: 10px;
  color: #000;
}

.filed-main {
  box-sizing: border-box;
  .filed-item {
    width: 120px;
    background: #f4f6fc;
    padding: 5px 10px;
    margin: 5px;
    font-size: 12px;
    cursor: move;
    border: 1px dashed #f4f6fc;
    &:hover {
      border: 1px dashed rgb(60, 159, 245);
      color: rgb(60, 159, 245);
    }
  }
  .filed-item:nth-child(odd) {
    margin-right: 10px;
  }
  .list-complete-item.sortable-chosen {
    background: #4ab7bd;
  }

  .list-complete-item.sortable-ghost {
    background: #30b08f;
  }
  .ghostClass {
    border: 1px dashed #4ab7bd;
  }
}
</style>


