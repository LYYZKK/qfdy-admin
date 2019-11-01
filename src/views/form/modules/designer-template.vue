<template>
  <a-row class="form-dialog-content-main">
    <a-form
      :layout="formLayout"
      class="list-group-item"
      :form="form"
      :class="!formIsEdit ? 'view-form' : null"
    >
      <draggable
        :disabled="!isDesigner"
        class="dragArea"
        :list="formDataTemplate.formProperties"
        :options="{group:groupName2,sort:true,scroll:true,fallbackClass:'.ghostClass'}"
        @moved="draggleEnd"
      >
        <a-col
          :span="element.span"
          class="form-item"
          v-for="(element,index) in formDataTemplate.formProperties"
          :key="index"
          @click="isDesigner?changeStyle(element,index):''"
          :class="isDesigner?(index===watchIndex?'active':'hover'):''"
        >
          <div class="icons" v-if="iconShow">
            <a-avatar class="icon-copy" @click.stop="addOne(element)">
              <a-icon type="copy" />
            </a-avatar>
            <a-avatar class="icon-delete">
              <a-popconfirm
                title="确定删除当前项?"
                @confirm="deleteOne(index)"
                okText="确定"
                cancelText="取消"
              >
                <a-icon type="delete" />
              </a-popconfirm>
            </a-avatar>
          </div>
          <a-form-item
            :label-col="element.labelCol"
            :wrapper-col="element.wrapperCol"
            :required="element.isRequired===1?true:false"
          >
            <template v-if="element.elementType!=='img'">
              <span slot="label">
                <span>{{ element.label }}</span>
                <span
                  v-if="element && element.name !== '' && element.name !== null"
                  class="colorFont"
                >（{{ element.name }}）</span>
                <a-tooltip :title="element.tip" v-if="element.tip!==''&&element.tip!==null">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
            </template>

            <!-- 查看详情开始 -->
            <!-- 单行多行数字 -->
            <span
              v-if="!formIsEdit&&(element.elementType==='text'||element.elementType==='textarea'||element.elementType==='number')"
            >{{ element.defaultValue }}</span>
            <!-- 单选 下拉框 -->
            <span
              v-if="!formIsEdit&&(element.elementType==='radio'||element.elementType==='select')"
            >{{ element.defaultValue!==''?element.optionalData[element.defaultValue].name:'' }}</span>
            <!-- 多选 多选下拉框-->
            <template
              v-if="!formIsEdit&&(element.elementType==='checkbox'||element.elementType==='multipleSelect')"
            >
              <span
                v-for="(item,i) in element.defaultValue"
                :key="i"
              >{{ element.optionalData[element.defaultValue[i]].name }}</span>
            </template>
            <!-- 时间部分 -->
            <span
              v-if="!formIsEdit&&(element.elementType==='dateTime'||element.elementType==='date'||element.elementType==='time')"
            >{{ new Date(element.defaultValue).toLocaleString() }}</span>
            <!-- 编辑器 -->
            <span v-if="!formIsEdit&&element.elementType==='editor'" v-html="element.defaultValue"></span>
            <img
              v-if="!formIsEdit&&element.elementType === 'img'"
              :src="element.defaultValue"
              :alt="element.placeholder"
              :title="element.description"
              :width="element.elementStyle.width"
              :height="element.elementStyle.height"
            />
            <!-- 查看详情结束 -->
            <!-- v-model="element.defaultValue" -->
            <!-- isRequired   regex regexMsg -->
            <a-input
              v-decorator="[
                'formDataTemplate.formProperties['+index+'].defaultValue',
                { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
              ]"
              v-if="formIsEdit&&(element.elementType==='text'||element.elementType==='textarea'||element.elementType==='number')"
              :type="element.elementType"
              :placeholder="element.placeholder"
              :disabled="disabled"
              :minValue="element.minValue"
              :maxValue="element.maxValue"
            ></a-input>
            <a-radio-group
              v-decorator="[
                'formDataTemplate.formProperties['+index+'].defaultValue',
                { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
              ]"
              v-if="formIsEdit&&element.elementType==='radio'"
              :disabled="disabled"
            >
              <a-radio
                v-for="(radioItem,radioIndex) in element.optionalData"
                :key="radioIndex"
                :value="radioIndex"
                :disabled="disabled"
              >{{ radioItem.name }}</a-radio>
            </a-radio-group>
            <a-checkbox-group
              v-decorator="[
                'formDataTemplate.formProperties['+index+'].defaultValue',
                { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
              ]"
              v-if="formIsEdit&&element.elementType==='checkbox'"
              :disabled="disabled"
            >
              <a-checkbox
                v-for="(checkboxItem,checkboxIndex) in element.optionalData"
                :key="checkboxIndex"
                :value="checkboxIndex"
                class="checkboxItem"
                :disabled="disabled"
              >{{ checkboxItem.name }}</a-checkbox>
            </a-checkbox-group>

            <a-select
              v-if="formIsEdit&&(element.elementType==='select'||element.elementType==='multipleSelect')"
              :disabled="disabled"
              :mode="element.elementType==='multipleSelect'?'multiple':''"
              v-decorator="[
                'formDataTemplate.formProperties['+index+'].defaultValue',
                { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
              ]"
            >
              <a-select-option
                v-for="(selectItem,selectIndex) in element.optionalData"
                :key="selectIndex"
                :disabled="disabled"
              >{{ selectItem.name }}</a-select-option>
            </a-select>
            <a-date-picker
              :disabled="disabled"
              :placeholder="element.placeholder"
              v-if="formIsEdit&&element.elementType==='dateTime'"
              :format="element.formatValue"
              v-decorator="[
                'formDataTemplate.formProperties['+index+'].defaultValue',
                { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
              ]"
            />
            <template v-if="element.elementType==='date'">
              <a-date-picker
                :disabled="disabled"
                :placeholder="element.placeholder"
                v-if="formIsEdit&&(element.formatValue==='YYYY-MM-DD'||element.formatValue==='YYYY年')"
                :format="element.formatValue"
                v-decorator="[
                  'formDataTemplate.formProperties['+index+'].defaultValue',
                  { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
                ]"
              />
              <a-week-picker
                :disabled="disabled"
                :placeholder="element.placeholder"
                v-if="formIsEdit&&element.formatValue==='week'"
                v-decorator="[
                  'formDataTemplate.formProperties['+index+'].defaultValue',
                  { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
                ]"
              />
              <a-month-picker
                :disabled="disabled"
                :placeholder="element.placeholder"
                v-if="formIsEdit&&element.formatValue==='YYYY年MM月'"
                :format="element.formatValue"
                v-decorator="[
                  'formDataTemplate.formProperties['+index+'].defaultValue',
                  { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
                ]"
              />
            </template>
            <a-time-picker
              :disabled="disabled"
              :placeholder="element.placeholder"
              :format="element.formatValue"
              v-if="formIsEdit&&element.elementType==='time'"
              v-decorator="[
                'formDataTemplate.formProperties['+index+'].defaultValue',
                { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
              ]"
            />
            <j-editor
              v-if="formIsEdit&&element.elementType==='editor'&&!disabled"
              v-decorator="[
                'formDataTemplate.formProperties['+index+'].defaultValue',
                { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
              ]"
            ></j-editor>
            <span
              v-html="element.defaultValue"
              v-if="formIsEdit&&element.elementType==='editor'&&disabled"
            ></span>

            <JAddress
              v-if="element.elementType==='address'"
              :level="2"
              :isEdit="addressisEdit"
              v-decorator="[
                'formDataTemplate.formProperties['+index+'].defaultValue',
                { rules: element.regex !== '' ? [{required: element.isRequired === 1, message: requiredMsg}].concat([{pattern: element.regex, message: element.regexMsg}]) : [{required: element.isRequired === 1, message: requiredMsg}], validateTrigger: ['change', 'blur']}
              ]"
              @change="resetData(element)"
            ></JAddress>
            <img
              :src="element.defaultValue"
              :alt="element.placeholder"
              :title="element.description"
              v-if="formIsEdit&&element.elementType === 'img'"
              :width="element.elementStyle.width"
              :height="element.elementStyle.height"
            />
          </a-form-item>
        </a-col>
      </draggable>
    </a-form>
  </a-row>
</template>
<script>
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  Avatar,
  Icon,
  InputNumber,
  Tooltip,
  TimePicker,
  DatePicker,
  Popconfirm
} from 'ant-design-vue'
import draggable from 'vuedraggable'
import JEditor from '@/components/jeecg/JEditor'
import JDate from '@/components/jeecg/JDate'
import JAddress from '@/components/jeecg/JAddress'
import moment from 'moment'
import layoutImg from '@/assets/form-designer-layout.png'
import { request, internalRequest } from '@/api'
export default {
  name: 'Template',
  data() {
    return {
      watchIndex: this.watchIndex,
      layoutImg: layoutImg,
      // 修改时删除
      deleteFormData: [],
      form: this.$form.createForm(this),
      validateStatus: '',
      helpMessage: '',
      requiredMsg: '必填字段, 请填写',
      api: {
        deleteOne: {
          url: '/system/forms/{ids}'
        },
        getFormById: {
          url: '/system/forms/{id}',
          method: 'get'
        }
      }
    }
  },
  props: {
    formDataTemplate: {
      type: Object,
      default() {
        return {}
      }
    },
    // 表单ID
    formResive: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否在表单设计器操作
    isDesigner: {
      type: Boolean,
      default() {
        return false
      }
    },

    formLayout: {
      type: String,
      default() {
        return 'horizontal'
      }
    },
    // 表单是否可编辑，与disabled结合使用
    formIsEdit: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 针对地质组件的判断
    addressisEdit: {
      type: Boolean,
      default: false
    },
    // 复制删除的显示隐藏
    iconShow: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 拖拽配置
    groupName2: {
      type: String,
      default() {
        return ''
      }
    },
    // 是否外部引用模板
    constantRouter: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    changTime() {
      return this.formResive.time
    }
  },
  watch: {
    watchIndex(val) {
      this.watchIndex = val
    },
    changTime() {
      this.renderFormData(this.formResive.id)
    }
  },
  methods: {
    changeStyle(element, index) {
      this.watchIndex = index
      this.$emit('changeData', element, index)
    },
    addOne(element) {
      this.formDataTemplate.formProperties.push({
        name: '',
        defaultValueType: element.defaultValueType,
        formatValue: element.formatValue,
        isRequired: element.isRequired,
        maxValue: element.maxValue,
        minValue: element.minValue,
        placeholder: element.placeholder,
        sortNo: element.sortNo,
        regexMsg: element.regexMsg,
        regex: element.regex,
        tip: element.tip,
        rw: element.rw,
        readWhite: element.readWhite,
        rwType: element.rwType,
        styleValue: element.styleValue,
        validateScript: element.validateScript,
        label: element.label,
        elementType: element.elementType,
        defaultValue: element.defaultValue,
        optionalData: element.optionalData,
        labelCol: element.labelCol,
        wrapperCol: element.wrapperCol,
        elementClass: element.elementClass,
        elementStyle: element.elementStyle,
        span: element.span
      })
    },
    deleteOne(index) {
      this.$emit('deletOneFormProperties', index)
    },
    moment,
    addCollection(evt) {
      this.$emit('addFormItem', evt)
    },
    draggleEnd(evt) {
      this.watchIndex = evt.newIndex
      this.$emit('draggleEnded', evt)
    },
    formatData(array) {
      let newArray = []
      array.forEach(item => {
        newArray.push(item.name)
      })
      return newArray
    },
    reset(element) {
      this.$set(element, element.defaultValue)
      console.log(element.defaultValue)
    },
    // 地址数组数据重新加载
    resetData(element) {
      this.$set(element, element.defaultValue)
    },
    // 通过外部传进来的formId渲染表单数据
    renderFormData(formId) {
      this.formDataTemplate.formProperties = []
      if (this.constantRouter) {
        internalRequest({ ...this.api.getFormById, urlReplacements: [{ substr: '{id}', replacement: formId }] }).then(
          res => {
            if (res.success) {
              this.filterData(res.data)
              this.$forceUpdate()
            }
          }
        )
      } else {
        request({ ...this.api.getFormById, urlReplacements: [{ substr: '{id}', replacement: formId }] }).then(res => {
          if (res.success) {
            this.filterData(res.data)
            this.$forceUpdate()
          }
        })
      }
    },
    // 数据提交前格式化
    beforeSubmitFormat() {
      this.formDataTemplate.formProperties.forEach((item, index) => {
        item.sortNo = index
        if (item.rw instanceof Array) {
          if (item.rw.length === 2) {
            item.rw = 3
          } else if (item.rw.length === 1) {
            if (item.rw[0] === '1') {
              item.rw = 1
            } else {
              item.rw = 2
            }
          } else {
            item.rw = 0
          }
        }
        if (
          item.elementType === 'radio' ||
          item.elementType === 'checkbox' ||
          item.elementType === 'select' ||
          item.elementType === 'multipleSelect' ||
          item.elementType === 'address'
        ) {
          item.defaultValue = JSON.stringify(item.defaultValue)
          item.optionalData = JSON.stringify(item.optionalData)
        }
        if (item.elementType === 'img') {
          item.elementStyle = JSON.stringify(item.elementStyle)
        }
        item.labelCol = JSON.stringify(item.labelCol)
        item.wrapperCol = JSON.stringify(item.wrapperCol)
        delete item.readWhite
      })
    },
    // 渲染数据时过滤
    filterData(res) {
      this.formDataTemplate.name = res.name
      this.formDataTemplate.status = res.status
      this.formDataTemplate.type = res.type
      this.formDataTemplate.description = res.description
      this.formDataTemplate.formStyle = res.formStyle
      this.formDataTemplate.layoutType = res.layoutType
      this.formDataTemplate.id = res.id
      this.formDataTemplate.filedProperties = []
      res.formProperties.forEach(item => {
        item.readWhite = []
        item.rw =
          item.rw === 0
            ? (item.readWhite = [])
            : item.rw === 1
            ? (item.readWhite = ['1'])
            : item.rw === 2
            ? (item.readWhite = ['2'])
            : (item.readWhite = ['1', '2'])

        if (
          item.elementType === 'multipleSelect' ||
          item.elementType === 'checkbox' ||
          item.elementType === 'radio' ||
          item.elementType === 'select' ||
          item.elementType === 'address'
        ) {
          item.defaultValue = JSON.parse(item.defaultValue)
          item.optionalData = JSON.parse(item.optionalData)
        }
        if (item.elementType === 'img') {
          item.elementStyle = JSON.parse(item.elementStyle)
        }
        item.labelCol = JSON.parse(item.labelCol)
        item.wrapperCol = JSON.parse(item.wrapperCol)
      })
      this.formDataTemplate.formProperties = res.formProperties
    },
    refresh() {
      if (this.formResive.id) {
        this.renderFormData(this.formResive.id)
      } else {
        this.formDataTemplate.formProperties = this.formDataTemplate.formProperties
      }
    }
  },
  components: {
    ARow: Row,
    ACol: Col,
    draggable,
    JEditor,
    JDate,
    JAddress,
    AForm: Form,
    AFormItem: Form.Item,
    ATextarea: Input.TextArea,
    AInput: Input,
    AInputNumber: InputNumber,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    AButton: Button,
    AAvatar: Avatar,
    AIcon: Icon,
    ATooltip: Tooltip,
    ATimePicker: TimePicker,
    ADatePicker: DatePicker,
    AMonthPicker: DatePicker.MonthPicker,
    AWeekPicker: DatePicker.WeekPicker,
    APopconfirm: Popconfirm
  },
  mounted() {
    this.refresh()
  }
}
</script>
<style lang="less" scoped>
// 地址组件样式
::v-deep .area-select .area-selected-trigger {
  margin-top: 0;
}
::v-deep .area-select-wrap .area-select {
  margin-left: 0;
  vertical-align: middle;
  line-height: 32px;
}
.form-dialog-content-main {
  width: 100%;
  height: 100%;
  padding: 40px 0;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  .colorFont {
    color: #0b0a0aa3;
    font-weight: normal;
  }
  .editTitle {
    border: none;
    outline: none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    width: 200px;
    margin: 0 auto;
  }
  .text-center {
    text-align: center;
  }
  .list-group-item {
    height: 100%;
    width: 100%;
    .layoutImg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: block;
      margin: 0 auto;
    }
  }
  .dragArea {
    height: 100%;
    width: 100%;
  }
  .form-item {
    padding: 10px;
    position: relative;
    ::v-deep .ant-form-item {
      margin-bottom: 0;
    }
    .icons {
      width: 100%;
      text-align: right;
      position: absolute;
      bottom: -10px;
      right: 10px;
      display: none;
      z-index: 1;
      .icon-copy {
        color: #409eff;
        border-color: #b3d8ff;
        background: #ecf5ff;
        margin-right: 10px;
        cursor: pointer;
        &:hover {
          background: #409eff;
          border-color: #409eff;
          color: #fff;
        }
      }
      .icon-delete {
        color: #f56c6c;
        background: #fef0f0;
        border-color: #fbc4c4;
        cursor: pointer;
        &:hover {
          background: #f56c6c;
          border-color: #f56c6c;
          color: #fff;
        }
      }
    }
    &.active {
      background: #89bef7;
      border-left: 5px solid #409eff;
      .icons {
        display: block;
      }
    }
  }
}
</style>


