<template>
  <div class="product-picker">
    <span
      class="picker-title"
      :class="labelClass"
    >{{ label }}</span>
    <search-picker
      ref="cascader"
      v-model="industry"
      size="mini"
      :data-type-options="dataTypeOptions"
      :default-data-type="dataType"
      :options="options"
      :single="single"
      :limit="limit"
      @dataTypeChange="dataTypeChange"
      @search="search"
    />
  </div>
</template>

<script>
// import LocalStorageCache from '@/core/cache/LocalStorageCache'
// import * as Constants from '@/core/Constants'
import SearchPicker from '@/core/components/SearchPicker'
import PinyinEngine from 'pinyin-engine'
import { isArray } from '@/core/utils/ObjectUtil'
import tobaList from './tobaList.json'
let pinyinEngine = null
// let tobaList = []
let filterList = []
export default {
  name: 'ProductPicker',
  components: { SearchPicker },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    // 只允许选择的层级
    onlyCheck: {
      type: [String, Array],
      default: () => ['INDUSTRY', 'BRAND', 'TOBACCO']
    },
    // 默认显示层级
    defaultDataType: {
      type: String,
      default: ''
    },
    // 单选
    single: {
      type: Boolean,
      default: false
    },
    // 选择框宽度
    width: {
      type: String,
      default: '200px'
    },
    label: {
      type: String,
      default: '选择卷烟：'
    },
    // 标签样式
    labelClass: {
      type: String
    },
    // 限制选择数量上限
    limit: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      //
      industry: [],
      options: [],
      dataType: ''
    }
  },
  computed: {
    dataTypeOptions () {
      const industryMap = {
        INDUSTRY: {
          value: 'INDUSTRY',
          label: '工业'
        },
        BRAND: {
          value: 'BRAND',
          label: '品牌'
        },
        TOBACCO: {
          value: 'TOBACCO',
          label: '规格'
        }
      }
      return this.onlyCheck.map(key => industryMap[key])
    }
  },
  watch: {
    industry () {
      this.$emit('input', this.industry)
    },
    value (val) {
      this.industry = val
    },
    dataType () {
      this.options = this.transformTreeNode(tobaList)
    },
    onlyCheck (val, oldVal) {
      const item = val[0] || { codes: [] }
      const oldItem = oldVal[0] || { codes: [] }
      if (item.type === oldItem.type || item.codes.join() === oldItem.codes.join()) {
        return
      }
      this.options = this.transformTreeNode(tobaList)
    },
    showLevel (val, oldVal) {
      const item = val[0] || { codes: [] }
      const oldItem = oldVal[0] || { codes: [] }
      if (item.type === oldItem.type || item.codes.join() === oldItem.codes.join()) {
        return
      }
      this.options = this.transformTreeNode(tobaList)
    }
  },
  created () {
    //
    this.dataType = this.defaultDataType || isArray(this.onlyCheck) ? this.onlyCheck[0] : this.onlyCheck
    // tobaList = this.getSortedTobaList()
    this.getSortedTobaList()
    this.options = this.transformTreeNode(tobaList)
    this.createPinyinEngine(tobaList)
  },
  methods: {
    // 获取排序后的数据
    getSortedTobaList () {
      // const tobaList = LocalStorageCache.get(Constants.CACHE_LIST_TOBACCO)
      tobaList.sort((a, b) => {
        if (a.industryOrder - b.industryOrder) {
          return a.industryOrder - b.industryOrder
        }
        if (a.brandOrder - b.brandOrder) {
          return a.brandOrder - b.brandOrder
        }
        return b.wholesalePrice - a.wholesalePrice
      })
      return tobaList
    },
    // 数组转树
    transformTreeNode (tobaList) {
      const tree = []
      const transform = { industry: {}, brand: {}, tobacco: {} }
      // 过滤条件整理
      const handleMap = {
        INDUSTRY: {
          show: ['INDUSTRY', 'BRAND', 'TOBACCO'].includes(this.dataType)
        },
        BRAND: {
          show: ['BRAND', 'TOBACCO'].includes(this.dataType)
        },
        TOBACCO: {
          show: ['TOBACCO'].includes(this.dataType)
        }
      }
      tobaList.forEach(element => {
        let _tree = tree
        let lastNode = {}
        if (handleMap.INDUSTRY.show) {
          if (transform.industry[element.industryCode] === undefined) {
            const node = { value: element.industryCode, label: element.industryName, children: [] }
            transform.industry[element.industryCode] = _tree.push(node) - 1
          }
          const industryNode = _tree[transform.industry[element.industryCode]]
          _tree = industryNode.children
          lastNode = industryNode
        }
        if (handleMap.BRAND.show) {
          if (transform.brand[element.brandCode] === undefined) {
            const node = { value: element.brandCode, label: element.brandName, children: [] }
            transform.brand[element.brandCode] = _tree.push(node) - 1
          }
          const brandNode = _tree[transform.brand[element.brandCode]]
          _tree = brandNode.children
          lastNode = brandNode
        }
        if (handleMap.TOBACCO.show) {
          _tree.push({ value: element.tobaCode, label: element.tobaName })
          lastNode = {}
        }
        delete lastNode.children
      })
      return tree
    },
    search (keyValue) {
      filterList = pinyinEngine.query(keyValue)
      this.options = this.transformTreeNode(filterList)
    },
    // 创建拼音引擎
    createPinyinEngine (tobaList) {
      pinyinEngine = new PinyinEngine(tobaList, [
        'industryCode', 'industryName',
        'brandCode', 'brandName',
        'tobaCode', 'tobaName'
      ])
    },
    dataTypeChange (dataType) {
      this.dataType = dataType
    }
  }
}
</script>
