<template>
  <div class="customer-card" v-if="refreshed">
    <a-form class="customer" :form="form" :class="[!editMode ? 'view-form' : null]">
      <a-row :gutter="16">
        <a-card :bordered="false">
          <div slot="title">
            <span>基本信息</span>
            <a-button
              type="link"
              icon="sync"
              @click="getCustomer()"
              v-if="!editMode"
              class="m-l-5"
            >刷新</a-button>
          </div>
          <div slot="extra">
            <a-tooltip>
              <span slot="title">
                点击切换到
                <a-button v-if="editMode" type="link" icon="eye">查看</a-button>
                <a-button v-else-if="!editMode" type="link" icon="edit">编辑</a-button>模式
              </span>
              <a-switch checkedChildren="编辑" unCheckedChildren="查看" v-model="editMode" />
            </a-tooltip>
          </div>

          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名：">
              <a-input v-if="editMode" v-model="customer.name" @blur="save">{{ customer.name }}</a-input>
              <template v-else>{{ customer.name }}</template>
            </a-form-item>
          </a-col>
          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号：">
              <a-input v-if="editMode" v-model="customer.idNo" @blur="save">{{ customer.idNo }}</a-input>
              <template v-else>{{ customer.idNo }}</template>
            </a-form-item>
          </a-col>
          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别：">
              <j-dict-select-tag
                v-model="customer.sex"
                dictCode="sex"
                type="radio"
                v-if="editMode"
                @change="save"
                placeholder="请选择学历"
              />
              <j-dict-view-tag v-else v-model="customer.sex" dictCode="sex" />
            </a-form-item>
          </a-col>

          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="出生日期：">
              <j-date v-if="editMode" v-model="customer.birthday" @change="save" class="w-170" />
              <template
                v-else
              >{{ (!customer.birthday) ? '': new Date(customer.birthday).toLocaleDateString() }}</template>
            </a-form-item>
          </a-col>

          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身高(cm)：">
              <a-input-number v-if="editMode" v-model.number="customer.height" @blur="save"></a-input-number>
              <template v-else>{{ customer.height }}</template>
            </a-form-item>
          </a-col>

          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="体重(kg)：">
              <a-input-number v-if="editMode" v-model="customer.weight" @blur="save"></a-input-number>
              <template v-else>{{ customer.weight }}</template>
            </a-form-item>
          </a-col>

          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="籍贯：">
              <a-input v-if="editMode" @blur="save" v-model="customer.nativePlace"></a-input>
              <template v-else>{{ customer.nativePlace }}</template>
            </a-form-item>
          </a-col>

          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="民族：">
              <a-input v-if="editMode" v-model="customer.nation" @blur="save"></a-input>
              <template v-else>{{ customer.nation }}</template>
            </a-form-item>
          </a-col>
          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="婚配：">
              <j-dict-select-tag
                v-model="customer.isMarried"
                dictCode="married"
                type="radio"
                v-if="editMode"
                @change="save"
                placeholder="请选择学历"
              />
              <j-dict-view-tag v-else v-model="customer.isMarried" dictCode="married" />
            </a-form-item>
          </a-col>
          <a-col :span="twoOrThree">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="最高学历：">
              <j-dict-select-tag
                v-model="customer.highestEducation"
                dictCode="highest_education"
                v-if="editMode"
                @change="save"
                placeholder="请选择学历"
              />
              <j-dict-view-tag
                v-else
                v-model="customer.highestEducation"
                dictCode="highest_education"
              />
            </a-form-item>
          </a-col>
        </a-card>

        <a-card title="联系方式" :bordered="false">
          <a-col :span="24">
            <a-alert type="info" closable class="m-t-8" v-if="!editMode">
              <span slot="description">
                点击联系方式后面的
                <a-icon type="phone" class="call-btn m-l-3 m-r-3" />可以拨打该号码联系客户。
              </span>
            </a-alert>
            <a-form-item :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <div v-for="(item,index) in customer.contacts" :key="index">
                <template v-if="editMode">
                  <j-dict-select-tag
                    v-model="item.contactType"
                    placeholder="请选择联系方式类型"
                    dictCode="link_type"
                    class="w-100 m-r-10"
                    @change="isAdd ? '' : updateContact(customer.contacts[index])"
                    :disabled="item.id?true:false"
                  />
                  <a-input
                    @blur="isAdd ? submiteContact(customer.contacts[index]) : updateContact(customer.contacts[index])"
                    v-model="item.contactValue"
                    class="w-200 m-r-10"
                    :disabled="item.id?true:false"
                  />
                  <a-checkbox
                    v-model="item.isUsually"
                    @change="isAdd ? '' : updateContact(customer.contacts[index])"
                  >常用</a-checkbox>

                  <!-- <a-popconfirm
                    title="确定要删除?"
                    @confirm="deleteContact(customer.contacts,index)"
                    okText="确认"
                    cancelText="取消"
                  >
                    <a-button type="danger" shape="circle" icon="delete" size="small" />
                  </a-popconfirm>-->
                </template>
                <template v-else>
                  <j-dict-view-tag v-model="item.contactType" dictCode="link_type" />
                  <span class="m-r-10">{{ item.contactValue }}</span>
                  <a-tag color="blue" v-if="item.isUsually">常用</a-tag>

                  <a-popconfirm
                    title="确定拨打此号码联系客户吗?"
                    @confirm="() => handleOutCall({outCallNumber: item.contactValue, customerId: item.customerId, taskId: taskData.taskId})"
                  >
                    <a-icon
                      type="phone"
                      v-if="item.contactType === '0' && !$store.state.cti.talkingStatusReasonCodes.includes($store.state.cti.reasoncode)"
                      class="call-btn"
                      title="拨打此电话"
                    />
                  </a-popconfirm>
                </template>
              </div>
              <a-button
                type="dashed"
                v-if="editMode"
                @click="addContact(customer.contacts.length)"
                class="w-300"
              >+ 添加联系方式</a-button>
            </a-form-item>
          </a-col>
        </a-card>

        <a-card title="联系地址" :bordered="false">
          <a-col v-if="customer.addresses.length === 0">
            <div class="m-t-10 m-b-10">暂无数据</div>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <div v-for="(item,index) in customer.addresses" :key="index">
                <template v-if="editMode">
                  <j-address
                    class="m-r-10"
                    :level="2"
                    v-model="item.code"
                    :isEdit="true"
                    :selectType="'cascader'"
                    @change="isAddressAdd ? '' : updateAddress(customer.addresses[index])"
                    :returnType="'text'"
                  />
                  <a-input
                    v-model="item.detail"
                    class="w-200 m-r-10"
                    @blur="isAddressAdd ? submiteAddress(customer.addresses[index]) : updateAddress(customer.addresses[index])"
                  ></a-input>
                  <a-checkbox
                    v-model="item.isDefault"
                    @change="isAddressAdd ? '' : updateAddress(customer.addresses[index])"
                  >常用</a-checkbox>
                  <a-popconfirm
                    title="确定要删除?"
                    @confirm="deleteAddress(customer.addresses,index)"
                    okText="确认"
                    cancelText="取消"
                  >
                    <a-button type="danger" shape="circle" icon="delete" size="small" />
                  </a-popconfirm>
                </template>
                <template v-else>
                  <j-address
                    class="m-r-10"
                    :level="2"
                    v-model="item.code"
                    :value="item.code"
                    :isEdit="false"
                    :selectType="'cascader'"
                    :returnType="'text'"
                  />
                  <span class="m-r-10">{{ item.detail }}</span>
                  <a-tag color="blue" v-if="item.isDefault">常用</a-tag>
                </template>
              </div>
              <a-button
                type="dashed"
                v-if="editMode"
                @click="addAddress(customer.addresses.length)"
                class="w-300"
              >+ 添加联系地址</a-button>
            </a-form-item>
          </a-col>
        </a-card>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import {
  Form,
  Row,
  Col,
  Input,
  Switch,
  Radio,
  InputNumber,
  DatePicker,
  Select,
  Tag,
  Checkbox,
  Button,
  Popconfirm,
  Card,
  Icon,
  Alert,
  Tooltip,
  Empty
} from 'ant-design-vue'
import JAddress from '@/components/jeecg/JAddress.vue'
import JDate from '@/components/jeecg/JDate.vue'
import moment from 'moment'
import { mixin, mixinDevice } from '@/utils/mixin.js'
import CTIMixin from '@/mixins/CTIMixin'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import JDictViewTag from '@/components/dict/JDictViewTag.vue'
import { request } from '@/api'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CustomerCard',
  mixins: [mixin, mixinDevice, CTIMixin],
  data() {
    return {
      twoOrThree: 8,
      form: this.$form.createForm(this),
      editMode: false,
      contactMethodVisible: false,
      isAdd: false,
      isAddressAdd: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 8 },
        lg: { span: 7 },
        xl: { span: 7 },
        xxl: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
        lg: { span: 17 },
        xl: { span: 17 },
        xxl: { span: 17 }
      },
      // 配置api
      api: {
        // 获取客户基本信息
        getCustomerById: {
          url: '/customer/customers/{id}',
          method: 'get'
        },
        // 客户基本信息更新
        update: {
          url: '/customer/customers',
          method: 'patch'
        },
        // 客户联系信息新增
        addCustomerContact: {
          url: '/customer/contacts',
          method: 'post'
        },
        // 客户联系信息更新
        updateCustomerContact: {
          url: '/customer/contacts',
          method: 'patch'
        },
        deleteCustomerContact: {
          url: '/customer/contacts/{ids}',
          method: 'delete'
        },
        // 客户地址信息新增
        addCustomerAddress: {
          url: '/customer/addresses',
          method: 'post'
        },
        // 客户地址删除
        deleteCustomerAddress: {
          url: '/customer/addresses/{ids}',
          method: 'delete'
        },
        // 客户地址信息更新
        updateCustomerAddress: {
          url: '/customer/addresses',
          method: 'patch'
        }
      },
      customer: {
        contacts: [],
        addresses: []
      },
      customerId: null,
      refreshed: true
    }
  },

  methods: {
    ...mapActions(['setCustomerInfo']),
    moment,
    handleOutCall({ outCallNumber, customerId, taskId }) {
      if (!this.$store.state.cti.logined) {
        this.$message.warning('请登录软话机')
        return false
      } else if (!(this.$store.state.cti.reasoncode.lastIndexOf('13') > -1)) {
        this.$message.warning('请切换到示忙状态')
        return false
      }
      this.outCall({ outCallNumber, customerId, taskId })
    },
    changeFormLayout(val) {
      if (val === 'open') {
        this.twoOrThree = 12
      } else {
        this.twoOrThree = 8
      }
    },

    // 通过id获取呼入客户信息
    getCustomer() {
      // 基本信息
      request({
        ...this.api.getCustomerById,
        urlReplacements: [{ substr: '{id}', replacement: this.customerId }]
      }).then(res => {
        if (res.success) {
          // 数据请求后渲染处理
          this.formatDataBeforeRender(res.data)
        } else {
          this.$message.error('暂无数据')
        }
      })
    },

    // 新增联系方式
    addContact() {
      this.isAdd = true
      this.customer.contacts.push({
        contactValue: '',
        contactType: '',
        isUsually: false,
        customerId: this.customerId
      })
    },
    submiteContact(val) {
      if (this.isAdd) {
        if (val.contactType !== '' && val.contactValue !== '') {
          val.isUsually = val.isUsually ? 1 : 0
          let params = val
          request({ ...this.api.addCustomerContact, params }).then(res => {
            if (res.success) {
              this.getCustomer()
              this.isAdd = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请完善联系信息')
        }
      }
    },
    // 联系信息修改
    updateContact(val) {
      if (!this.isAdd) {
        if (val.contactType !== '' && val.contactValue !== '') {
          val.isUsually = val ? 1 : 0
          let params = val
          request({ ...this.api.updateCustomerContact, params }).then(res => {
            if (res.success) {
              this.getCustomer()
            } else {
              this.message.error(res.message)
            }
          })
        } else {
          this.$message.error('请完善联系信息')
        }
      }
    },
    // 添加地址新增
    addAddress() {
      this.isAddressAdd = true
      this.customer.addresses.push({
        code: [],
        province: '',
        district: '',
        city: '',
        detail: '',
        isDefault: false,
        customerId: this.customerId
      })
    },
    submiteAddress(val) {
      if (this.isAddressAdd) {
        if (val.code !== '' && val.detail !== '') {
          val.province = val.code[0]
          val.district = val.code[1]
          val.city = val.code[2]
          delete val.code
          val.isDefault = val.isDefault ? 1 : 0
          let params = val
          request({ ...this.api.addCustomerAddress, params }).then(res => {
            if (res.success) {
              this.getCustomer()
              this.isAddressAdd = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('请完善地址信息')
        }
      }
    },
    // 客户地址信息修改
    updateAddress(val) {
      if (!this.isAddressAdd) {
        if (val.code !== '' && val.detail !== '') {
          val.province = val.code[0]
          val.district = val.code[1]
          val.city = val.code[2]
          val.isDefault = val.isDefault ? 1 : 0
          delete val.code
          let params = val
          request({ ...this.api.updateCustomerAddress, params }).then(res => {
            if (res.success) {
              this.getCustomer()
            } else {
              this.message.error(res.message)
            }
          })
        } else {
          this.$message.error('请完善地址信息')
        }
      }
    },
    // 删除客户联系方式
    deleteContact(val, index) {
      let deleteId = val[index].id
      request({
        ...this.api.deleteCustomerContact,
        urlReplacements: [{ substr: '{ids}', replacement: deleteId }]
      }).then(res => {
        if (res.success) {
          this.getCustomer()
        } else {
          this.message.error(res.message)
        }
      })
    },
    // 删除客户地址
    deleteAddress(val, index) {
      let deleteId = val[index].id
      request({
        ...this.api.deleteCustomerAddress,
        urlReplacements: [{ substr: '{ids}', replacement: deleteId }]
      }).then(res => {
        if (res.success) {
          this.getCustomer()
        } else {
          this.message.error(res.message)
        }
      })
    },
    // 基础信息实时保存
    save() {
      this.formatDataBeforSubmit()
      let params = this.customer
      request({ ...this.api.update, params }).then(res => {
        if (res.success) {
          this.getCustomer()
          this.$message.success('已保存')
        } else {
          this.message.error(res.message)
        }
      })
    },
    // 渲染时数据格式处理
    formatDataBeforeRender(val) {
      val.addresses.forEach(item => {
        item.code = [item.province, item.district, item.city]
        item.isDefault = item.isDefault === 1
      })
      val.contacts.forEach(item => {
        item.isUsually = item.isUsually === 1
      })

      this.customer = val
      this.setCustomerInfo(val)
      if (!this.editMode) {
        this.refreshed = false
        this.$nextTick(() => {
          this.refreshed = true
        })
      }
    },
    // 提交时数据前格式处理
    formatDataBeforSubmit() {
      this.customer.addresses.forEach(item => {
        item.province = item.code[0]
        item.district = item.code[1]
        item.city = item.code[2]
        item.isDefault = item.isDefault ? 1 : 0
        delete item.code
      })
      this.customer.contacts.forEach(item => {
        item.isUsually = item.isUsually ? 1 : 0
      })
    }
  },

  components: {
    JAddress,
    JDate,
    JDictSelectTag,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ASwitch: Switch,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    AInputNumber: InputNumber,
    ADatePicker: DatePicker,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATag: Tag,
    ACheckbox: Checkbox,
    AButton: Button,
    APopconfirm: Popconfirm,
    ACard: Card,
    AIcon: Icon,
    AAlert: Alert,
    ATooltip: Tooltip,
    AEmpty: Empty,
    JDictViewTag
  },
  props: {
    id: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapState({
      callChatStatus: state => state.my.callChatStatus,
      taskData: state => state.my.taskData.data
    })
  },
  beforeMount() {
    this.changeFormLayout(this.callChatStatus)
    // 浅克隆
    for (let key in this.taskData) {
      if (key === 'customerId') {
        this.customerId = this.taskData[key]
      }
    }
    this.getCustomer()
  },
  watch: {
    callChatStatus(val) {
      this.changeFormLayout(val)
    }
  }
}
</script>

<style lang='scss' scoped>
.customer-card {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  .call-btn {
    cursor: pointer;
    color: #1890ff;
    &:hover {
      opacity: 0.7;
    }
  }
  ::v-deep .area-cascader-wrap {
    display: inline-block;
  }

  ::v-deep .ant-alert-with-description {
    padding: 5px 10px !important;

    .ant-alert-icon {
      top: 6px !important;
      left: 10px !important;
    }

    .ant-alert-close-icon {
      top: 6px !important;
    }
  }
}
</style>
