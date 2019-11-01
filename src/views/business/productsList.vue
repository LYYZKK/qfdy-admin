<template>
  <a-layout>
    <a-layout-sider theme="light" class="layout-sider">
      <a-tree v-model="checkedKeys" @select="onSelect" :treeData="treeData" />
    </a-layout-sider>
    <a-layout-content>
      <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="16">
              <a-col v-bind="formColResponsiveCfg">
                <a-form-item label="名称">
                  <a-input placeholder="请输入名称查询" v-model="queryParam.name"></a-input>
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

        <!-- 操作按钮区域 -->
        <div class="table-operator" v-if="!isDrawer">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-button
            @click="batchDel"
            v-if="selectedRowKeys.length > 0"
            ghost
            type="primary"
            icon="delete"
          >批量删除</a-button>
        </div>

        <!-- table区域-begin -->
        <div>
          <a-alert type="info" class="table-alert m-b-15">
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
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <products-modal ref="modalForm" @ok="modalFormOk" @saveAliveData="saveAliveData"></products-modal>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<script>
import {
  Layout,
  Alert,
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Dropdown,
  Menu,
  Divider,
  Popover,
  Checkbox,
  Table,
  Popconfirm,
  Tag,
  Tree
} from 'ant-design-vue'

import CommonMixin from '@/mixins/CommonMixin'
import { mixinDevice } from '@/utils/mixin.js'
import DictMixin from '@/mixins/DictMixin'
import ListMixin from '@/mixins/ListMixin'
import KeepAliveMixin from '@/mixins/KeepAliveMixin'
import { request } from '@/api'
import { buildTreeDataForAntd } from '@/utils/util'
import ProductsModal from './modules/productsModal'
import { mapActions } from 'vuex'
export default {
  name: 'ProductsList',
  mixins: [KeepAliveMixin, mixinDevice, CommonMixin, ListMixin, DictMixin],
  components: {
    ALayout: Layout,
    ALayoutSider: Layout.Sider,
    ALayoutContent: Layout.Content,
    AAlert: Alert,
    ACard: Card,
    AForm: Form,
    ARow: Row,
    ACol: Col,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    AIcon: Icon,
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
    ATree: Tree,
    ProductsModal
  },
  beforeMount() {
    this.getTreeTypes()
    this.showType()
  },
  props: {
    isDrawer: {
      type: Boolean
    }
  },
  data() {
    return {
      autoExpandParent: true,
      checkedKeys: [], // 选中的树节点
      selectedKeys: [],
      treeData: [],
      description: '商品管理页面',
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
          customRender: (t, r, index) => {
            return parseInt(index) + 1
          }
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '商品类型',
          align: 'center',
          dataIndex: 'typeName'
        },
        {
          title: '单价(元)',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '描述',
          align: 'center',
          dataIndex: 'description'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   scopedSlots: {
        //     customRender: 'action'
        //   }
        // }
      ],
      defColumnsAction: [
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      url: {
        list: '/order/products',
        deleteBatch: '/order/products/{ids}'
      },
      api: {
        treeTypes: {
          url: '/order/products/types/trees',
          method: 'get'
        }
      }
    }
  },
  methods: {
    ...mapActions(['setProductId']),
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys
      this.queryParam.typeId = this.selectedKeys[0]
      this.searchQuery()
    },
    getTreeTypes() {
      request({ ...this.api.treeTypes }).then(res => {
        if (res.success && res.data) {
          this.treeData = buildTreeDataForAntd({ data: res.data }).data
        }
      })
    },
    beforeAdd() {
      this.$refs.modalForm.productProperties = []
    },
    // 当作为抽屉模态框时的内容处理
    showType() {
      if (!this.isDrawer) {
        this.defColumns = this.defColumns.concat(this.defColumnsAction)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-layout-sider {
  border-right: 1px solid #e8e8e8;
}
.spaceone {
  width: 5px;
}
.ant-layout-content {
  color: #fff;
}
</style>
