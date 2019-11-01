import filter from 'lodash.filter'

import { filterDictOptionByVal } from '@/components/dict/JDictSelectUtil'

export default {
  data() {
    return {
      DICT_SHOW_COLORS: [
        { value: 'black', type: 'text', description: '黑色' },
        { value: 'grey', type: 'text', description: '灰色' },
        { value: 'pink', type: 'text', description: '粉红色' },
        { value: 'red', type: 'text', description: '红色' },
        { value: 'orange', type: 'text', description: '橘黄色' },
        { value: 'green', type: 'text', description: '绿色' },
        { value: 'cyan', type: 'text', description: '青绿色' },
        { value: 'blue', type: 'text', description: '蓝色' },
        { value: 'purple', type: 'text', description: '紫色' },

        { value: 'pink', type: 'tag', description: '粉红色' },
        { value: 'red', type: 'tag', description: '红色' },
        { value: 'orange', type: 'tag', description: '橘黄色' },
        { value: 'green', type: 'tag', description: '绿色' },
        { value: 'cyan', type: 'tag', description: '青绿色' },
        { value: 'blue', type: 'tag', description: '蓝色' },
        { value: 'purple', type: 'tag', description: '紫色' },

        { value: 'success', type: 'badge', description: '绿色' },
        { value: 'error', type: 'badge', description: '红色' },
        { value: 'default', type: 'badge', description: '灰色' },
        { value: 'processing', type: 'badge', description: '蓝色' },
        { value: 'warning', type: 'badge', description: '橘黄色' }
      ],
      DICT_SHOW_TYPES: [
        {
          value: 'text',
          description: '文本',
          render: ({ itemText, showColor }) => (!showColor ? itemText : <font color={showColor}>{itemText}</font>)
        },
        {
          value: 'tag',
          description: '标签',
          render: ({ itemText, showColor }) => {
            return <a-tag color={showColor}>{itemText}</a-tag>
          }
        },
        {
          value: 'badge',
          description: '徽标',
          render: ({ itemText, showColor }) => {
            return <a-badge status={showColor} item={itemText} />
          }
        }
      ]
    }
  },
  methods: {
    DICT_SHOW_RENDER(dict_code, val) {
      const { itemText, showType, showColor } = filterDictOptionByVal(this.dictCodeOptionMap[dict_code], val)

      return filter(this.DICT_SHOW_TYPES, { value: showType || 'text' })[0].render({
        itemText,
        showColor
      })
    }
  }
}
