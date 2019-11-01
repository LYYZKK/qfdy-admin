<template>
  <a-card :bordered="false" id="record-manage-customer">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col v-bind="formColResponsiveCfg">
            <a-form-item label="客户姓名">
              <a-input placeholder="请输入客户姓名查询" v-model="queryParam.customerName"></a-input>
            </a-form-item>
          </a-col>

          <span class="table-page-search-submitButtons">
            <a-col v-bind="formColResponsiveCfg">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
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
        rowKey="customerId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        @expand="handleExpanded"
      >
        <div slot="expandedRowRender" slot-scope="expandedRowRender,index">
          <a-row class="expandedRow">
            <my-steps
              :ref="'mySteps'+index"
              :getByCustomerId="url.list"
              :getTimesById="api.getTimesById.url"
              :stepSize="5"
              :customerId="expandedRowRender.customerId"
              :userId="userInfo().id"
            />
          </a-row>
        </div>
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import mySteps from '../../components/call/my-steps'
import JRangeDate from '@/components/jeecg/JRangeDate.vue'
import { mapGetters } from 'vuex'
import {
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
  Divider,
  Select
} from 'ant-design-vue'

export default {
  name: 'RecordManageCustomer',
  mixins: [KeepAliveMixin, ListMixin],
  components: {
    JRangeDate,
    mySteps,
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
      filters: [{ field: 'createBy', rule: 'eq', val: this.userInfo().id }],
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

      defColumns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => {
            // expand事件无法获取index，增加index属性以判断更新哪行的接触历史数据
            this.dataSource[index]['index'] = index
            return parseInt(index) + 1
          }
        },
        {
          title: '客户姓名',
          align: 'center',
          dataIndex: 'customerName'
        },
        {
          title: '接触次数',
          align: 'center',
          dataIndex: 'totalCount'
        }
      ],
      url: {
        list: '/contact/records/customer-statistics/customer'
      },
      api: {
        getTimesById: {
          url: '/contact/phone-records'
        }
      }
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    handleExpanded(expanded, row) {
      if (expanded) {
        this.$nextTick(() => {
          this.$refs['mySteps' + row.index].getRecordsByCustomerId({ customerId: row.customerId })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#record-manage-customer {
  // 公共的类权值不足
  .full-width {
    width: 100% !important;
  }
}
</style>
