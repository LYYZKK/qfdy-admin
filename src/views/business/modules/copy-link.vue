<template>
  <a-drawer
    :width="768"
    :title="copyLink.title"
    placement="right"
    :visible="copyLink.visible"
    @close="() => this.copyLink.visible = false"
  >
    <a-row id="copy-link">
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="promotionUrl" slot-scope="record">
          <j-ellipsis :value="record" :length="100" />
        </div>
        <span slot="action" slot-scope="record">
          <a-button type="link" @click="handleCopy(record.promotionUrl)">复制</a-button>
        </span>
      </a-table>
      <a-row class="footer-btn-container">
        <a-button @click="handleCloseSelf">关闭</a-button>
      </a-row>
    </a-row>
  </a-drawer>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import { Row, Col, Button, Divider, Drawer, Form, Input, notification, Table } from 'ant-design-vue'
import { request } from '@/api'
import JEllipsis from '@/components/jeecg/JEllipsis'

export default {
  name: 'CopyLink',
  mixins: [mixinDevice, KeepAliveMixin],
  components: {
    JEllipsis,
    ARow: Row,
    ACol: Col,
    AButton: Button,
    ADivider: Divider,
    ADrawer: Drawer,
    AForm: Form,
    AFormItem: Form.Item,
    ATextarea: Input.TextArea,
    ATable: Table
  },
  data() {
    return {
      copyLink: {
        title: '复制链接',
        visible: false
      },
      disabledChangeNum: false,
      value: null,
      form: this.$form.createForm(this),
      validatorRules: {
        seat: { rules: [{ required: true, message: '请输入选择坐席组' }] }
      },
      loading: false,
      columns: [
        {
          title: '推广代号',
          align: 'center',
          dataIndex: 'promoteCode',
          key: 'promoteCode',
          width: 100
        },
        {
          title: '链接',
          align: 'center',
          dataIndex: 'promotionUrl',
          key: 'promotionUrl',
          scopedSlots: { customRender: 'promotionUrl' }
        },
        {
          align: 'center',
          dataIndex: '',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100', '200', '500'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      params: {
        pageNo: 1,
        pageSize: 10
      },
      api: {
        getLink: {
          url: '/contact/pclink'
        }
      },
      copy: null,
      paId: null
    }
  },
  methods: {
    handleTempChange(val) {
      console.log('选择了' + val)
    },
    getLink(page) {
      // 加载数据 若传入参数1则加载第一页的内容
      if (page === 1) {
        this.ipagination.current = 1
        this.params.pageNo = 1
        this.params.pageSize = 10
        this.params.conditions = JSON.stringify([{ field: 'pcId', rule: 'eq', val: this.pcId }])
      }
      this.loading = true
      request({ ...this.api.getLink, params: this.params }).then(res => {
        if (res.success) {
          this.dataSource = res.data
          this.ipagination.total = res.page.totalCount
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.params.pageNo = pagination.current
      this.params.pageSize = pagination.pageSize
      this.getLink()
    },
    openSelf(pcId) {
      this.copyLink.visible = true
      this.pcId = pcId
      this.getLink(1)
    },
    handleCloseSelf() {
      this.copyLink.visible = false
    },
    handleCopy(link) {
      this.$copyText(link).then(
        function(e) {
          notification.success({
            message: '复制成功',
            description: '复制内容：' + link
          })
          console.log(e)
        },
        function(e) {
          notification['error']({
            message: '复制失败，请重试'
          })
          console.log(e)
        }
      )
    }
  },
  beforeMount() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#copy-link {
  background: #fff;
  padding: 10px;
  .ant-divider-horizontal {
    margin: 5px 0 !important;
  }
  .ant-form-item {
    margin-bottom: 10px;
  }
  .footer-btn-container {
    text-align: right;
    .ant-btn {
      margin: 0 3px;
    }
  }
  .extend-form {
    .ant-form-item {
      width: 100%;
    }
    ::v-deep .ant-form-item-control-wrapper {
      width: 100%;
      .ant-select {
        width: 70%;
      }
    }
  }
}
</style>
