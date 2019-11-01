<template>
  <a-card :bordered="false" id="record-manage-time">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="客户姓名">
              <a-input placeholder="请输入客户姓名" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>
          <!-- <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="接触方式">
              <a-select showSearch placeholder="请选择接触方式" v-model="queryParam.crType">
                <a-select-option :value="1">电话</a-select-option>
                <a-select-option :value="2">微信</a-select-option>
                <a-select-option :value="3">短信</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>-->
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="是否接触成功">
              <a-select showSearch placeholder="请选择是否接触成功" v-model="queryParam.contactStatus">
                <a-select-option :value="1">成功</a-select-option>
                <a-select-option :value="0">失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col v-bind="formColResponsiveCfg">
              <a-form-item label="接触时间">
                <j-Range-Date
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  v-model="createAt"
                  class="full-width"
                />
              </a-form-item>
            </a-col>
          </template>
          <span class="table-page-search-submitButtons">
            <a-col v-bind="formColResponsiveCfg">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
              <a @click="handleToggleSearch" class="search-toggler">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-alert type="info" class="table-alert">
        <span slot="message">
          <span class="f-r">
            <a-button type="link" icon="sync" @click="refresh()">刷新</a-button>
            <a-divider type="vertical" />
            <a-popover title="自定义列" trigger="click" placement="leftBottom">
              <template slot="content">
                <a-checkbox-group
                  @change="onColSettingsChange"
                  v-model="settingColumns"
                  :defaultValue="settingColumns"
                >
                  <a-row>
                    <template v-for="(item, idx) in defColumns">
                      <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                        <a-col :span="12" :key="idx">
                          <a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox>
                        </a-col>
                      </template>
                    </template>
                  </a-row>
                </a-checkbox-group>
              </template>
              <a-button type="link" icon="setting">自定义列</a-button>
            </a-popover>
          </span>
        </span>
      </a-alert>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="recordId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <div slot="crType" slot-scope="text">
          <a-icon
            class="icon-cr-type"
            theme="filled"
            :type="text === 1 ? 'phone' : text === 2 ? 'wechat' : 'mail'"
          />
        </div>
        <div slot="contactStatus" slot-scope="text">
          <a-tag
            :color="text === 1 ? 'green' : text === 0 ? 'red' : '' "
          >{{ text === 1 ? '成功' : text === 0 ? '失败' : '' }}</a-tag>
        </div>
        <div slot="summaryRemark" slot-scope="text">
          <j-ellipsis :value="text" :length="30" />
        </div>
        <span slot="action" slot-scope="text, record">
          <a-button type="link" icon="eye" @click="handleShowDetail(record)">查看</a-button>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->
    <step-modal ref="modalForm" />
  </a-card>
</template>

<script>
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import {
  Select,
  Alert,
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  Checkbox,
  Table,
  Popconfirm,
  Tag,
  Icon,
  Popover,
  Divider
} from 'ant-design-vue'
import JRangeDate from '@/components/jeecg/JRangeDate.vue'
import { mapGetters } from 'vuex'
import { request } from '@/api'
import { buildTreeDataForAntd } from '@/utils/util'
import JEllipsis from '@/components/jeecg/JEllipsis'
import stepModal from '../../components/call/my-step-modal.vue'

export default {
  name: 'RecordManageTime',
  mixins: [KeepAliveMixin, ListMixin],
  components: {
    stepModal,
    JEllipsis,
    JRangeDate,
    ADivider: Divider,
    AIcon: Icon,
    AAlert: Alert,
    ACard: Card,
    AForm: Form,
    ARow: Row,
    ACol: Col,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    ATable: Table,
    APopconfirm: Popconfirm,
    ATag: Tag,
    APopover: Popover,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  data() {
    return {
      queryType: {
        customerName: 'like'
      },
      formColResponsiveCfg: {
        xs: 24,
        sm: 12,
        md: 8,
        lg: 8,
        xl: 6,
        xxl: 6
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
          md: { span: 4 },
          lg: { span: 8 },
          xl: { span: 8 },
          xxl: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
          md: { span: 20 },
          lg: { span: 16 },
          xl: { span: 16 },
          xxl: { span: 18 }
        }
      },
      createAt: null,
      defaultQueryFields: ['recordId'],
      defColumns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => {
            return parseInt(index) + 1
          }
        },
        {
          title: '客户姓名',
          align: 'center',
          dataIndex: 'customerName',
          width: 300
        },
        {
          title: '接触方式',
          align: 'center',
          dataIndex: 'crType',
          width: 100,
          scopedSlots: {
            customRender: 'crType'
          }
        },
        {
          title: '是否接触成功',
          align: 'center',
          dataIndex: 'contactStatus',
          width: 150,
          scopedSlots: {
            customRender: 'contactStatus'
          }
        },
        {
          title: '接触时间',
          align: 'center',
          dataIndex: 'createAt',
          width: 200
        },
        {
          title: '小结',
          align: 'center',
          dataIndex: 'summaryItemId',
          customRender: summaryItemId => {
            return this.treeidMap[summaryItemId] ? this.treeidMap[summaryItemId].name : ''
          }
        },
        {
          title: '小结备注',
          align: 'center',
          dataIndex: 'summaryRemark',
          width: 500,
          scopedSlots: {
            customRender: 'summaryRemark'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      treeidMap: {},
      url: {
        list: '/contact/records/time-statistics'
      },
      api: {
        getSummeryTree: {
          url: '/contact/summary-items/list/tree'
        }
      }
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    getSummeryTree() {
      request({ ...this.api.getSummeryTree }).then(res => {
        if (res.success) {
          this.treeidMap = buildTreeDataForAntd({ data: res.data }).idMap
        }
      })
    },
    beforeGetQueryParams() {
      if (this.createAt) {
        this.filters = [
          { field: 'createBy', rule: 'eq', val: this.userInfo().id },
          { field: 'beginTime', rule: 'ge', val: this.createAt[0] },
          { field: 'endTime', rule: 'lt', val: this.createAt[1] }
        ]
      } else {
        this.filters = [{ field: 'createBy', rule: 'eq', val: this.userInfo().id }]
      }
    },
    handleShowDetail(record) {
      this.$refs.modalForm.title = '接触历史详情'
      this.$refs.modalForm.operateType =
        record.crType === 1 ? 'phone' : record.crType === 2 ? 'wechat' : record.crType === 3 ? 'mail' : ''
      this.$refs.modalForm.visible = true
      this.$refs.modalForm.handleShowDetail(record)
    },
    searchReset() {
      this.queryParam = {}
      this.createAt = []
      this.loadData(1)
    }
  },
  beforeMount() {
    this.getSummeryTree()
  }
}
</script>
<style lang="scss" scoped>
#record-manage-time {
  // 公共的类权值不足
  .full-width {
    width: 100% !important;
  }
  .icon-cr-type {
    color: #1890ff;
  }
}
</style>
