import { isNumber } from '@/utils/validate'

export default {
  data() {
    return {
      outCallPopFormVisiable: false,
      transferPopFormVisiable: false,
      transfer_form: this.$form.createForm(this),
      conferencePopFormVisiable: false,
      conference_form: this.$form.createForm(this),
      outcall_form: this.$form.createForm(this),
      model: {}
    }
  },
  methods: {
    loginCTI() {
      this.$store.dispatch('LoginCTI')
    },
    logoutCTI() {
      this.$store.dispatch('LogoutCTI')
    },
    statusMouseOver() {
      this.statusText = '切换状态'
    },
    statusMouseOut() {
      this.statusText = '空闲'
    },
    switchCTIStatus(status) {
      this.$store.dispatch('SetCTIStatus', status)
    },

    // 呼出.
    outCall({ outCallNumber, customerId, taskId }) {
      this.$store.dispatch('OutCall', { destDN: outCallNumber, customerId, taskId })
    },
    validateCallNumber(rule, value, callback) {
      if (value && !isNumber(value)) {
        callback('号码只能是数字')
      } else if (value === this.$store.state.cti.dn) {
        callback('不能呼叫当前登录的话机')
      } else {
        callback()
      }
    },
    showOutCallPopForm() {
      this.outcall_form.resetFields()
      this.outCallPopFormVisiable = true
    },
    hideOutCallPopForm() {
      this.outCallPopFormVisiable = false
    },
    confirmOutCall() {
      this.outcall_form.validateFields((err, values) => {
        if (!err) {
          this.outCall({ outCallNumber: values.outCallNumber, customerId: 1, taskId: 2 })
          this.hideOutCallPopForm()
          this.outcall_form.resetFields()
        }
      })
    },

    // 转接.
    StartTransfer({ transferNumber }) {
      this.$store.dispatch('StartTransfer', transferNumber)
    },
    CancleTransfer() {
      this.$store.dispatch('CancleTransfer')
    },
    completeTransfer() {
      this.$store.dispatch('CompleteTransfer')
    },
    validateTransferNumber(rule, value, callback) {
      if (value && !isNumber(value)) {
        callback('号码只能是数字')
      } else if (value === this.$store.state.cti.dn) {
        callback('不能转接到当前登录的话机')
      } else if (value === this.$store.state.cti.caller || value === this.$store.state.cti.callee) {
        callback('不能转接到当前正在通话中的话机')
      } else {
        callback()
      }
    },
    showTransferPopForm() {
      this.transfer_form.resetFields()
      this.transferPopFormVisiable = true
    },
    hideTransferPopForm() {
      this.transferPopFormVisiable = false
    },
    confirmTransfer() {
      this.transfer_form.validateFields((err, values) => {
        if (!err) {
          this.StartTransfer({ transferNumber: values.transferNumber })
          this.hideTransferPopForm()
          this.transfer_form.resetFields()
        }
      })
    },

    // 多方.
    StartConference({ conferenceNumber }) {
      this.$store.dispatch('StartConference', conferenceNumber)
    },
    CancleConference() {
      this.$store.dispatch('CancleConference')
    },
    completeConference() {
      this.$store.dispatch('CompleteConference')
    },
    validateConferenceNumber(rule, value, callback) {
      if (value && !isNumber(value)) {
        callback('号码只能是数字')
      } else if (value === this.$store.state.cti.dn) {
        callback('不能发起三方通话到当前登录的话机')
      } else if (value === this.$store.state.cti.caller || value === this.$store.state.cti.callee) {
        callback('不能发起三方通话到当前正在通话中的话机')
      } else {
        callback()
      }
    },
    showConferencePopForm() {
      this.conference_form.resetFields()
      this.conferencePopFormVisiable = true
    },
    hideConferencePopForm() {
      this.conferencePopFormVisiable = false
    },
    confirmConference() {
      this.conference_form.validateFields((err, values) => {
        if (!err) {
          this.StartConference({ conferenceNumber: values.conferenceNumber })
          this.hideConferencePopForm()
          this.outcall_form.resetFields()
        }
      })
    },

    answerCall() {
      this.$store.dispatch('Answer')
    },

    // 保持.
    holdCall() {
      this.$store.dispatch('HoldCall')
    },
    unHoldCall() {
      this.$store.dispatch('UnHoldCall')
    },

    hangup() {
      this.$store.dispatch('Hangup')
    },
    completeCall() {
      // 完成通话将话后状态改为: 示忙 - 联系客户.
      this.$store.dispatch('SetCTIStatus', this.$store.state.cti.ctiInternalStatusMap.busy_working)
      this.$store.dispatch('CompleteCall')
    }
  }
}
