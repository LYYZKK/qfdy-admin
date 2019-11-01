<template>
  <div>
    <a-form layout="vertical" v-if="hasData" :form="form">
      <a-form-item label="字段名称" v-if="filedProperty.elementType !== 'img'">
        <a-input v-model="filedProperty.label" />
      </a-form-item>
      <a-form-item label="字段英文名" v-if="filedProperty.elementType!=='img'">
        <a-input v-model="filedProperty.name" />
      </a-form-item>
      <a-form-item label="图片路径" v-if="filedProperty.elementType=='img'">
        <a-input v-model="filedProperty.defaultValue"></a-input>
      </a-form-item>
      <a-form-item label="描述">
        <a-textarea v-model="filedProperty.tip" />
      </a-form-item>
      <a-form-item label="默认值类型" v-if="filedProperty.elementType!=='img'">
        <a-select v-model="filedProperty.defaultValueType">
          <a-select-option :value="1">字符串</a-select-option>
          <a-select-option :value="2">脚本</a-select-option>
        </a-select>
      </a-form-item>
      <!-- 单选下拉 -->
      <a-form-item
        label="选项"
        v-if="filedProperty.elementType==='radio'||filedProperty.elementType==='select'"
      >
        <a-radio-group v-model="filedProperty.defaultValue">
          <a-radio
            v-for="(radioItem,radioIndex) in filedProperty.optionalData"
            :key="radioIndex"
            :value="radioIndex"
            class="radioItem"
          >
            <a-input v-model="radioItem.name" />

            <a-popconfirm
              title="删除该选项？"
              @confirm="deleteRadio(filedProperty.optionalData,radioIndex)"
              okText="确认"
              cancelText="取消"
            >
              <a-icon type="delete" v-if="filedProperty.optionalData.length>1" />
            </a-popconfirm>
          </a-radio>
        </a-radio-group>
        <a-button @click="addRadio(filedProperty.optionalData)">添加选项</a-button>
      </a-form-item>
      <!-- 多选多级下拉 -->
      <a-form-item
        label="选项"
        v-if="filedProperty.elementType==='checkbox'||filedProperty.elementType==='multipleSelect'"
      >
        <a-checkbox-group v-model="filedProperty.defaultValue">
          <a-checkbox
            v-for="(checkboxItem,checkboxIndex) in filedProperty.optionalData"
            :key="checkboxIndex"
            :value="checkboxIndex"
            class="checkboxItem"
          >
            <a-input v-model="checkboxItem.name" />

            <a-popconfirm
              title="删除该选项？"
              @confirm="deleteRadio(filedProperty.optionalData,checkboxIndex)"
              okText="确认"
              cancelText="取消"
            >
              <a-icon type="delete" v-if="filedProperty.optionalData.length>1" />
            </a-popconfirm>
          </a-checkbox>
        </a-checkbox-group>
        <a-button @click="addRadio(filedProperty.optionalData)">添加选项</a-button>
      </a-form-item>
      <!-- 时间格式 -->
      <a-form-item
        label="时间格式"
        v-if="filedProperty.elementType==='dateTime'||filedProperty.elementType==='date'||filedProperty.elementType==='time'"
      >
        <a-select
          defaultValue="YYYY.MM.DD HH:mm:ss"
          v-if="filedProperty.elementType==='dateTime'"
          v-model="filedProperty.formatValue"
        >
          <a-select-option value="YYYY.MM.DD HH:mm:ss">YYYY.MM.DD HH:mm:ss</a-select-option>
          <a-select-option value="YYYY-MM-DD HH:mm a">YYYY-MM-dd HH:mm a</a-select-option>
          <a-select-option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</a-select-option>
          <a-select-option value="YYYY/MM/DD HH:mm a">YYYY/MM/DD HH:mm a</a-select-option>
          <a-select-option value="YYYY/MM/DD HH:mm:ss">YYYY/MM/DD HH:mm:ss</a-select-option>
          <a-select-option value="YYYY年MM月DD日 HH时mm分 a">YYYY年MM月DD日 HH时mm分 a</a-select-option>
          <a-select-option value="YYYY年MM月DD日 HH时mm分ss秒">YYYY年MM月DD日 HH时mm分ss秒</a-select-option>
        </a-select>
        <a-select
          defaultValue="YYYY-MM-DD"
          v-if="filedProperty.elementType==='date'"
          v-model="filedProperty.formatValue"
        >
          <a-select-option value="YYYY年">年</a-select-option>
          <a-select-option value="YYYY年MM月">月</a-select-option>
          <a-select-option value="week">周</a-select-option>
          <a-select-option value="YYYY-MM-DD">日</a-select-option>
        </a-select>

        <a-select
          defaultValue="HH时"
          v-if="filedProperty.elementType==='time'"
          v-model="filedProperty.formatValue"
        >
          <a-select-option value="HH时">HH:--:--</a-select-option>
          <a-select-option value="mm分">--:mm:--</a-select-option>
          <a-select-option value="ss秒">--:--:ss</a-select-option>
          <a-select-option value="HH:mm:ss">HH:mm:ss</a-select-option>
        </a-select>
      </a-form-item>
      <!-- 默认值 -->
      <a-form-item
        label="默认值"
        v-if="filedProperty.elementType==='text'||filedProperty.elementType==='textarea'||filedProperty.elementType==='number'"
      >
        <a-input :type="filedProperty.elementType" v-model="filedProperty.defaultValue" />
      </a-form-item>
      <a-form-item label="默认值" v-if="filedProperty.elementType==='editor'">
        <j-editor v-model="filedProperty.defaultValue"></j-editor>
      </a-form-item>
      <a-form-item label="默认值" v-if="filedProperty.elementType==='address'">
        <JAddress :level="2" :isEdit="true" v-model="filedProperty.defaultValue"></JAddress>
      </a-form-item>

      <!-- 默认占位符 -->
      <a-form-item
        label="默认占位符"
        v-if="filedProperty.elementType!=='radio'||filedProperty.elementType!=='checkbox'||filedProperty.elementType!=='select'||filedProperty.elementType==='address'||filedProperty.elementType=='img'"
      >
        <a-input v-model="filedProperty.placeholder" />
      </a-form-item>
      <!-- 范围 -->
      <a-form-item label="范围" v-if="filedProperty.elementType!=='img'">
        <a-input-number :min="0" :defaultValue="0" v-model="filedProperty.minValue" />
        <a-input-number :min="0" :defaultValue="0" class="ml10" v-model="filedProperty.maxValue" />
      </a-form-item>
      <!-- 读写权限类型 -->
      <a-form-item label="读写权限类型" v-if="filedProperty.elementType!=='img'">
        <a-radio-group name="radioGroup2" v-model="filedProperty.rwType">
          <a-radio :value="0">勾选</a-radio>
          <a-radio :value="1">脚本</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 读写权限设置 -->
      <a-form-item label="读写权限设置" v-if="filedProperty.elementType!=='img'">
        <a-checkbox-group
          @change="onChange"
          v-if="filedProperty.rwType===0"
          v-model="filedProperty.readWhite"
        >
          <a-row>
            <a-col :span="12">
              <a-checkbox value="1">可读</a-checkbox>
            </a-col>
            <a-col :span="12">
              <a-checkbox value="2">可写</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <a-textarea v-else v-model="filedProperty.rw"></a-textarea>
      </a-form-item>
      <!--  是否必填-->
      <a-form-item label="是否必填" v-if="filedProperty.elementType!=='img'">
        <a-radio-group v-model="filedProperty.isRequired" :defaultValue="0">
          <a-radio :value="0">非必填</a-radio>
          <a-radio :value="1">必填</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 正则 -->
      <a-form-item label="正则" v-if="filedProperty.elementType!=='img'">
        <a-input v-model="filedProperty.regex" />
        <span class="red">注意：请书写标准的正则表达式</span>
      </a-form-item>
      <!-- 正则提示语 -->
      <a-form-item label="正则提示语" v-if="filedProperty.elementType!=='img'">
        <a-input v-model="filedProperty.regexMsg" />
      </a-form-item>
      <!-- 栅格占位数 -->
      <a-form-item label="栅格占位数">
        <template v-if="formProperty.layoutType===1">
          <div class="m-b-5">
            <span class="tr">span：</span>
            <a-input-number :min="0" :max="24" v-model="filedProperty.span" />
          </div>
          <div class="m-t-5">
            <a-divider orientation="left">xs</a-divider>
            <div class="m-b-5">
              <span class="tr">labelCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.labelCol.xs.span" />
            </div>
            <div class="m-b-5">
              <span class="tr">wrapperCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.wrapperCol.xs.span" />
            </div>
          </div>
          <div class="m-t-5">
            <a-divider orientation="left">sm</a-divider>
            <div class="m-b-5">
              <span class="tr">labelCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.labelCol.sm.span" />
            </div>
            <div class="m-b-5">
              <span class="tr">wrapperCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.wrapperCol.sm.span" />
            </div>
          </div>
          <div class="m-t-5">
            <a-divider orientation="left">md</a-divider>
            <div class="m-b-5">
              <span class="tr">labelCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.labelCol.md.span" />
            </div>
            <div class="m-b-5">
              <span class="tr">wrapperCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.wrapperCol.md.span" />
            </div>
          </div>
          <div class="m-t-5">
            <a-divider orientation="left">lg</a-divider>
            <div class="m-b-5">
              <span class="tr">labelCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.labelCol.lg.span" />
            </div>
            <div class="m-b-5">
              <span class="tr">wrapperCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.wrapperCol.lg.span" />
            </div>
          </div>
          <div class="m-t-5">
            <a-divider orientation="left">xl</a-divider>
            <div class="m-b-5">
              <span class="tr">labelCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.labelCol.xl.span" />
            </div>
            <div class="m-b-5">
              <span class="tr">wrapperCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.wrapperCol.xl.span" />
            </div>
          </div>
          <div class="m-t-5">
            <a-divider orientation="left">xxl</a-divider>
            <div class="m-b-5">
              <span class="tr">labelCol：</span>
              <a-input-number :min="0" :max="24" v-model="filedProperty.labelCol.xxl.span" />
            </div>
            <div class="m-b-5">
              <span class="tr">wrapperCol：</span>
              <a-input-number
                @change="changeSpan"
                :min="0"
                :max="24"
                v-model="filedProperty.wrapperCol.xxl.span"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <div>
            <span class="tr">labelCol：</span>
            <a-input-number :min="0" :max="24" v-model="filedProperty.labelCol.span" />
          </div>
          <div class="m-t-5">
            <span class="tr">wrapperCol：</span>
            <a-input-number :min="0" :max="24" v-model="filedProperty.wrapperCol.span" />
          </div>
          <div class="m-t-5">
            <span class="tr">span：</span>
            <a-input-number :min="0" :max="24" v-model="filedProperty.span" />
          </div>
        </template>
      </a-form-item>
      <!-- 属性值排序 -->
      <!-- 图片宽度 -->
      <a-form-item label="图片宽度" v-if="filedProperty.elementType==='img'">
        <a-input-number
          v-model="filedProperty.elementStyle.width"
          :min="1"
          :max="100"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
        ></a-input-number>
      </a-form-item>
      <!-- 图片高度 -->
      <a-form-item label="图片高度" v-if="filedProperty.elementType==='img'">
        <a-input-number
          v-model="filedProperty.elementStyle.height"
          :min="1"
          :max="100"
          :formatter="value => `${value}%`"
          :parser="value => value.replace('%', '')"
        ></a-input-number>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  InputNumber,
  Icon,
  Row,
  Col,
  Popconfirm,
  Divider
} from 'ant-design-vue'
import JAddress from '@/components/jeecg/JAddress'
import JEditor from '@/components/jeecg/JEditor'
export default {
  name: 'FiledProperty',
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  props: {
    // 表单有数据就显示无数据不显示
    hasData: {
      type: Boolean,
      default() {
        return false
      }
    },
    formProperty: {
      type: Object,
      default() {
        return {}
      }
    },
    filedProperty: {
      type: Object,
      default() {
        return {}
      }
    },
    labelCol: {
      type: Object,
      default() {
        return {}
      }
    },
    wrapperCol: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    // 添加选项
    addRadio(item) {
      item.push({ name: '选项' })
    },
    // 删除选项
    deleteRadio(item, index) {
      item.splice(index, 1)
    },
    onChange() {
      let len = this.filedProperty.readWhite.length
      if (len === 2) {
        this.filedProperty.rw = 3
      } else if (len === 1) {
        if (this.filedProperty.readWhite[0] === '1') {
          this.filedProperty.rw = 1
        } else {
          this.filedProperty.rw = 2
        }
      } else {
        this.filedProperty.rw = 0
      }
    },
    changeSpan() {
      this.filedProperty.labelCol = this.labelCol
      this.filedProperty.wrapperCol = this.wrapperCol
    }
  },
  mounted() {},
  components: {
    JAddress,
    JEditor,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ATextarea: Input.TextArea,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    AButton: Button,
    AInputNumber: InputNumber,
    AIcon: Icon,
    ARow: Row,
    ACol: Col,
    APopconfirm: Popconfirm,
    ADivider: Divider
  }
}
</script>
<style lang="less" scoped>
::v-deep .area-select .area-selected-trigger {
  margin-top: 0;
}
::v-deep .area-select-wrap .area-select {
  margin-left: 0;
  vertical-align: middle;
  line-height: 32px;
  width: 100%;
}
::v-deep .ant-tabs-nav {
  display: block;
}
.ml10 {
  margin-left: 10px;
}
.tr {
  display: inline-block;
  width: 85px;
  text-align: right;
}
.radioItem {
  position: relative;
  margin: 5px 0;
  .anticon {
    position: absolute;
    right: -50px;
    top: 10px;
  }
}
.checkboxItem {
  margin: 5px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  .anticon {
    position: absolute;
    right: -20px;
    top: 10px;
  }
}
.red {
  color: red;
  font-size: 12px;
}
</style>


