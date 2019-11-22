<template>
  <a-card :bordered="false">
    <!-- 抽屉 -->
    <a-drawer title="字典列表" :width="screenWidth" @close="onClose" :visible="visible">
      <!-- 抽屉内容的border -->
      <a-card>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="8">
              <a-col v-bind="formColResponsiveCfg">
                <a-form-item v-bind="formItemResponsiveCfg" label="字典项文本">
                  <a-input placeholder="请输入字典项文本" v-model="queryParam.itemText"></a-input>
                </a-form-item>
              </a-col>
              <a-col v-bind="formColResponsiveCfg">
                <span class="table-page-search-submitButtons f-l">
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <a-button type="primary" @click="searchReset" class="m-l-8" icon="reload">重置</a-button>
                </span>
              </a-col>
            </a-row>
            <a-row>
              <a-col v-bind="formColResponsiveCfg">
                <a-button class="m-b-10" type="primary" @click="handleAdd" icon="plus">添加</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-alert type="info" class="table-alert">
            <span slot="message">
              <span class="f-r">
                <a-button type="link" icon="sync" @click="refresh()">刷新</a-button>
              </span>
            </span>
          </a-alert>

          <a-table
            ref="table"
            rowKey="id"
            size="middle"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="text, record">
              <a-button type="link" icon="edit" @click="handleEdit(record)">编辑</a-button>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a-button type="link" icon="delete">删除</a-button>
              </a-popconfirm>
            </span>
            <span slot="itemTextLink" slot-scope="text, record">
              <a-button type="link" @click="handleShow(record)">{{ text }}</a-button>
            </span>
          </a-table>
        </div>
      </a-card>
    </a-drawer>

    <dict-item-modal ref="modalForm" @ok="modalFormOk" @saveAliveData="saveAliveData"></dict-item-modal>
  </a-card>
</template>

<script>
import filter from 'lodash.filter'

import DictItemModal from './modules/DictItemModal'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import DictMixin from '@/mixins/DictMixin'
import {
  Card,
  Drawer,
  Form,
  Col,
  Row,
  Input,
  Select,
  Button,
  Table,
  Divider,
  Popconfirm,
  Tag,
  Alert,
  Badge
} from 'ant-design-vue'
export default {
  name: 'DictItemList',
  mixins: [KeepAliveMixin, ListMixin, DictMixin],
  components: {
    DictItemModal,
    ACard: Card,
    ADrawer: Drawer,
    AForm: Form,
    AFormItem: Form.Item,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option,
    AButton: Button,
    ATable: Table,
    ADivider: Divider,
    APopconfirm: Popconfirm,
    ATag: Tag,
    AAlert: Alert,
    ABadge: Badge
  },
  data() {
    return {
      columns: [
        {
          title: '字典项文本',
          align: 'center',
          dataIndex: 'itemText',
          scopedSlots: { customRender: 'itemTextLink' }
        },
        {
          title: '字典项值',
          align: 'center',
          dataIndex: 'itemVal'
        },
        {
          title: '排序值',
          align: 'center',
          dataIndex: 'itemSort'
        },
        {
          title: '展示方式',
          align: 'center',
          dataIndex: 'showType',
          customRender: (text, record) => {
            return text ? filter(this.DICT_SHOW_TYPES, { value: text })[0].render(record) : ''
          }
        },
        {
          title: '展示颜色',
          align: 'center',
          dataIndex: 'showColor',
          customRender: (text, record) => {
            if (['text', 'tag'].includes(record.showType)) {
              return text ? <a-tag color={text}> {text} </a-tag> : ''
            } else if (['badge'].includes(record.showType)) {
              return text ? <a-badge status={text}> {text} </a-badge> : ''
            } else {
              text ? <a-tag color={text}> {text} </a-tag> : ''
            }
          }
        },
        {
          title: '启用状态',
          align: 'center',
          dataIndex: 'enabled',
          customRender: text => {
            return !text || this.toString(text) === '0' ? (
              <a-tag color="orange">禁用</a-tag>
            ) : (
              <a-tag color="green">启用</a-tag>
            )
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      title: '操作',
      visible: false,
      screenWidth: 800,
      model: {},
      dictId: '',
      status: 1,
      formColResponsiveCfg: {
        xs: 24,
        sm: 12
      },
      formItemResponsiveCfg: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      url: {
        list: '/system/dicts/{id}/items',
        deleteBatch: '/system/dict-items/{ids}'
      },
      isorter: {
        sortColumn: 'itemSort',
        sortOrder: 'asc'
      }
    }
  },
  beforeMount() {
    // 当页面初始化时,根据屏幕大小来给抽屉设置宽度
    this.resetScreenSize()
    const _this = this
    window.onresize = () => {
      _this.resetScreenSize()
    }
  },
  methods: {
    beforeList() {
      if (!this.dictId) {
        return false
      }
      this.listUrlReplacements = [
        {
          substr: '{id}',
          replacement: this.dictId
        }
      ]
    },
    showDrawer(record) {
      if (record.id) {
        this.dict = record
        this.dictId = record.id
        this.visible = true
        this.loadData()
      }
    },
    beforeAdd() {
      this.$refs.modalForm.dict = this.dict
      this.$refs.modalForm.dictId = this.dictId
    },
    beforeEdit() {
      this.$refs.modalForm.dict = this.dict
      this.$refs.modalForm.dictId = this.dictId
    },
    beforeShow() {
      this.$refs.modalForm.dict = this.dict
      this.$refs.modalForm.dictId = this.dictId
    },
    onClose() {
      this.visible = false
      this.dataSource = []
    },
    // 抽屉的宽度随着屏幕大小来改变
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 800) {
        this.screenWidth = screenWidth
      } else {
        this.screenWidth = 800
      }
    }
  }
}
</script>
<style scoped>
</style>
