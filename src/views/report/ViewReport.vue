<template>
  <div class="report">
    <a-card :bordered="false" class="m-b-10">
      <h3>访问量统计</h3>
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col v-bind="formColResponsiveCfg">
              <a-form-item label="时间类型">
                <j-dict-select-tag
                  v-model="queryParam.type"
                  placeholder="请选择时间类型"
                  dictCode="time-type"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10" v-if="queryParam.type==='1'||queryParam.type==='2'">
              <a-form-item label="开始时间">
                <a-range-picker
                  :disabledDate="disabledDate"
                  :showTime="{
                    format: 'HH',
                    hideDisabledOptions: true,
                    defaultValue: [moment('00', 'HH'), moment('23', 'HH')]
                  }"
                  format="YYYY-MM-DD HH"
                  style="width:300px;"
                  @change="timeChnage"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10" v-if="queryParam.type==='3'">
              <a-form-item label="开始时间">
                <a-range-picker
                  :placeholder="['开始月份', '结束月份']"
                  format="YYYY-MM"
                  :value="value"
                  :mode="mode"
                  @panelChange="handlePanelChange"
                  @change="handleChange"
                />
              </a-form-item>
            </a-col>
            <a-form-item>
              <span class="table-page-search-submitButtons">
                <a-col v-bind="formColResponsiveCfg">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
                </a-col>
              </span>
            </a-form-item>
          </a-row>
        </a-form>
      </div>
      <view-report-chart v-model="dataSource" v-if="dataSource.length!==0"></view-report-chart>
      <div>
        <a-alert type="info" class="table-alert">
          <span slot="message">
            <span>
              已选择
              <a class="numbers">{{ selectedRowKeys.length }}</a>&nbsp;项
              <a class="clear" @click="onClearSelected">清空</a>
            </span>

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
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="text, record">
            <a-button type="link" icon="eye" @click="handleShow(record)">查看</a-button>

            <a-divider type="vertical" />
            <a-button type="link" icon="edit" @click="handleEdit(record)">编辑</a-button>

            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多
                <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a-button>删除</a-button>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </a-table>
      </div>
    </a-card>
    <!-- <a-card :bordered="false"> -->
    <!-- table区域-begin -->

    <!-- </a-card> -->
  </div>
</template>

<script>
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import ViewReportChart from '@/views/dashboard/components/ViewReportChart'
import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
import moment from 'moment'
import {
  Alert,
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Upload,
  Dropdown,
  Menu,
  Divider,
  Popover,
  Checkbox,
  Table,
  Popconfirm,
  Tag,
  DatePicker
} from 'ant-design-vue'

export default {
  mixins: [KeepAliveMixin, ListMixin, DictMixin],
  components: {
    AAlert: Alert,
    ACard: Card,
    AForm: Form,
    ARow: Row,
    ACol: Col,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    AIcon: Icon,
    AUpload: Upload,
    ADivider: Divider,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    APopover: Popover,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    ATable: Table,
    APopconfirm: Popconfirm,
    ATag: Tag,
    ViewReportChart,
    JDictSelectTag,
    ARangePicker: DatePicker.RangePicker
  },
  data() {
    return {
      value: [],
      mode: ['month', 'month'],
      formatTime: [],
      queryParam: {
        type: '1',
        start: moment(new Date(new Date(new Date().toLocaleDateString()))).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      },
      queryType: {
        name: 'like',
        sex: 'eq'
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
          title: '访问时间',
          align: 'center',
          dataIndex: 'time'
        },
        {
          title: '首页访问量',
          align: 'center',
          dataIndex: 'indexViewNum'
        },
        {
          title: '预购访问量',
          align: 'center',
          dataIndex: 'preViewNum'
        },
        {
          title: '现货访问量',
          align: 'center',
          dataIndex: 'spotViewNum'
        }
      ],
      url: {
        list: '/view/reports'
      },
      testingMode: false
    }
  },
  methods: {
    moment,
    onetomany() {
      this.$refs.oneToNTabsModal.add()
      this.$refs.oneToNTabsModal.operateType = 'add'
      this.$refs.oneToNTabsModal.title = '新增'
    },
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },

    disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      }
    },
    handleChange(value) {
      this.value = value
    },
    timeChnage(val) {
      this.queryParam.start = moment(val[0]).format('YYYY-MM-DD HH:mm:ss')
      this.queryParam.end = moment(val[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    handlePanelChange(value, mode) {
      this.value = value
      this.queryParam.start = moment(value[0]).format('YYYY-MM-01 00:00:00')
      this.queryParam.end = moment(value[1]).format('YYYY-MM-30 23:59:59')
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    }
  }
}
</script>
<style scoped>
</style>


