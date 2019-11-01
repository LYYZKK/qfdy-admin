<template>
  <div>
    <template v-if="badLink === false">
      <FormTemplate
        ref="formTemplate"
        :formDataTemplate="formDataTemplate"
        :formIsEdit="true"
        :addressisEdit="true"
        :formResive="formObject"
        :constantRouter="true"
        @change="reset(formDataTemplate)"
      ></FormTemplate>
      <a-button type="primary" @click="addCustomer" block="true" size="large">提交</a-button>
    </template>
    <Result v-if="badLink === true" :isSuccess="false" title="访问失败" description="很抱歉，您访问的链接已失效。" />
  </div>
</template>
<script>
import { Decrypt } from '@/utils/crypto.js'
import Result from '@/views/result/Result.vue'
import { Button, Card, Modal } from 'ant-design-vue'
import FormTemplate from './modules/designer-template'
import { internalRequest } from '@/api'
import qs from 'qs'
export default {
  data() {
    return {
      formDataTemplate: {
        name: '',
        status: 0,
        type: '',
        description: '',
        formClass: '',
        formStyle: '',
        layoutType: 0,
        formProperties: []
      },
      formObject: {},
      link: {},
      badLink: null,
      userInfo: {
        pcId: '',
        customer: {
          name: '',
          sex: '',
          idNo: '',
          contacts: []
        }
      },
      api: {
        addAccess: {
          url: '/contact/pclink/visitsTime/{promoteCode}',
          method: 'patch'
        },
        addCustomer: {
          url: '/customer/customers/customer-task',
          method: 'post'
        },
        // 校验渠道Id是否存在
        checkPcId: {
          url: '/contact/promotion-channel/{id}',
          method: 'get'
        }
      }
    }
  },
  methods: {
    // 新增客户
    addCustomer() {
      this.$refs.formTemplate.form.validateFields(err => {
        if (!err) {
          const info = this.$refs.formTemplate.form.getFieldsValue()
          this.userInfo.customer.name = info.formDataTemplate.formProperties[0].defaultValue
          this.userInfo.customer.sex = info.formDataTemplate.formProperties[1].defaultValue
          this.userInfo.customer.idNo = info.formDataTemplate.formProperties[2].defaultValue
          this.userInfo.customer.contacts = [
            {
              contactType: 0,
              contactValue: info.formDataTemplate.formProperties[3].defaultValue,
              isUsually: 1
            }
          ]
          this.userInfo.pcId = this.link.pcId
          let params = this.userInfo

          internalRequest({ ...this.api.addCustomer, params }).then(res => {
            if (res.success) {
              this.$message.success('提交成功')
              this.init()
            } else {
              this.$message.success('提交失败')
            }
          })
        }
      })
    },
    // 进入页面
    addAccess() {
      internalRequest({
        ...this.api.addAccess,
        urlReplacements: [{ substr: '{promoteCode}', replacement: this.link.promoteCode + '?pcId=' + this.link.pcId }]
      })
      // 判断pcId是否有效
      internalRequest({
        ...this.api.checkPcId,
        urlReplacements: [{ substr: '{id}', replacement: this.link.pcId }]
      }).then(res => {
        if (res.data === null) {
          this.badLink = true
        } else {
          if (res.data.campaignId !== 0) {
            this.badLink = false
          } else {
            this.badLink = true
          }
        }
      })
    },
    // 解密
    Decrypt() {
      let a = qs.parse(Decrypt(this.$route.query.param))
      this.link.id = a.formId
      this.link.pcId = a.pcId
      this.link.promoteCode = a.promoteCode
    },
    // 初始化
    init() {
      this.Decrypt()
      this.formObject.id = this.link.id
      this.formObject.time = new Date().getTime()
      this.$nextTick(() => {
        this.$refs.formTemplate.refresh()
      })
    }
  },
  mounted() {
    this.init()
    this.addAccess()
  },
  components: {
    AButton: Button,
    ACard: Card,
    FormTemplate,
    Result,
    AModal: Modal
  }
}
</script>

<style>
.body-info {
  height: 100%;
  overflow: auto;
}
</style>
