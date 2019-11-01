<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :class="[['show'].includes(operateType) ? 'view-form' : null]">
        <a-row :gutter="16">
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="姓名" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入姓名"
                v-decorator="['name', validatorRules.name]"
              />
              <template v-else>{{ model.name }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="关键词" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入关键词"
                v-decorator="['keyWord', {}]"
              />
              <template v-else>{{ model.keyWord }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="打卡时间" hasFeedback>
              <j-date
                v-if="['add', 'edit'].includes(operateType)"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="['punchTime', {}]"
              />
              <template v-else>{{ model.punchTime }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="sex">
              <j-dict-select-tag
                v-if="['add', 'edit'].includes(operateType)"
                v-decorator="['sex', validatorRules.sex]"
                :value="model.sex"
                :triggerChange="true"
                placeholder="请选择性别"
                dictCode="sex"
                type="radio"
              />
              <j-dict-view-tag v-else v-model="model.sex" dictCode="sex" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="年龄" hasFeedback>
              <a-input-number
                v-if="['add', 'edit'].includes(operateType)"
                :min="1"
                :max="100"
                v-decorator="['age', {}]"
              />
              <template v-else>{{ model.age }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="生日" hasFeedback>
              <j-date
                v-if="['add', 'edit'].includes(operateType)"
                v-decorator="['birthday', validatorRules.birthday]"
              />
              <template v-else>{{ model.birthday }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="邮箱" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入邮箱"
                v-decorator="['email', validatorRules.email]"
              />
              <template v-else>{{ model.email }}</template>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" v-bind="formColResponsiveCfg">
            <a-form-item v-bind="formItemResponsiveCfg" label="个人简介" hasFeedback>
              <a-input
                v-if="['add', 'edit'].includes(operateType)"
                placeholder="请输入个人简介"
                v-decorator="['content', {}]"
              />
              <template v-else>{{ model.content }}</template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-popconfirm
        v-if="['add', 'edit'].includes(operateType)"
        title="确定取消吗?"
        @confirm="() => handleCancel()"
      >
        <a-button>取消</a-button>
      </a-popconfirm>
      <a-button @click="handleCancel" v-else>关闭</a-button>

      <a-button
        class="m-l-8"
        @click="handleOk"
        v-if="['add', 'edit'].includes(operateType)"
        type="primary"
      >确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin'

import { Modal, Spin, Form, Row, Col, Input, InputNumber, Button, Popconfirm } from 'ant-design-vue'

import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import JDate from '@/components/jeecg/JDate.vue'

export default {
  name: 'OneModal',
  mixins: [ModalMixin],
  components: {
    AModal: Modal,
    ASpin: Spin,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    AInputNumber: InputNumber,
    AButton: Button,
    APopconfirm: Popconfirm,
    JDictSelectTag,
    JDictViewTag,
    JDate
  },
  data() {
    return {
      title: '操作',
      operateType: 'add',
      formColResponsiveCfg: {
        xs: 24,
        sm: 12
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
          md: { span: 6 },
          lg: { span: 5 },
          xl: { span: 5 },
          xxl: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
          md: { span: 16 },
          lg: { span: 17 },
          xl: { span: 17 },
          xxl: { span: 17 }
        }
      },
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入姓名' }] },
        sex: { rules: [{ required: true, message: '请选择性别' }] },
        email: { rules: [{ required: true, type: 'email', message: '请输入正确的邮箱' }] },
        birthday: { rules: [{ required: true, message: '请选择出生日期' }] }
      },
      api: {
        add: {
          url: '/test/jeecgDemo/add',
          method: 'post'
        },
        edit: {
          url: '/test/jeecgDemo/edit',
          method: 'put'
        },
        getById: {
          url: '/test/jeecgDemo/queryById',
          method: 'get'
        }
      },
      formFields: ['name', 'keyWord', 'sex', 'age', 'email', 'content', 'punchTime', 'birthday']
    }
  },
  methods: {
    /**
     * 点击确认按钮向后台传输的表单数据处理.
     *
     * 注：此方法返回的数据会直接传向后台.
     */
    getFormData(formData) {
      Object.keys(formData).forEach(k => {
        if (typeof formData[k] === 'string') {
          formData[k] = formData[k].trim()
        }
      })
      return formData
    }
  }
}
</script>

<style scoped>
</style>
