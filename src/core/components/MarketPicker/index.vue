<template>
  <div class="market-picker">
    <span
      class="picker-title"
      :class="labelClass"
    >{{ label }}</span>
    <search-picker
      ref="cascader"
      v-model="business"
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
import areaList from './areaList.json'
let pinyinEngine = null
let filterList = []
export default {
  name: 'MarketPicker',
  components: { SearchPicker },
  props: {
    // 例：[{type:'PROVINCE',codes:['XXXXX']},{type:'CITY',codes:['XXXXX']}]
    value: {
      type: Array,
      default: () => []
    },
    // 显示层级
    showLevel: {
      type: Array,
      default: () => ['AREA', 'PROVINCE', 'CITY', 'COUNTY']
    },
    // 只允许选择的层级
    onlyCheck: {
      type: [String, Array],
      default: () => ['AREA', 'PROVINCE', 'CITY', 'COUNTY']
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
      default: '商业公司：'
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
      business: [],
      options: [],
      dataType: ''
    }
  },
  computed: {
    dataTypeOptions () {
      const areaMap = {
        AREA: {
          value: 'AREA',
          label: '区域'
        },
        PROVINCE: {
          value: 'PROVINCE',
          label: '省份'
        },
        CITY: {
          value: 'CITY',
          label: '地市'
        },
        COUNTY: {
          value: 'COUNTY',
          label: '区县'
        }
      }
      return this.onlyCheck.map(key => areaMap[key])
    }
  },
  watch: {
    business () {
      this.$emit('input', this.business)
    },
    value (val) {
      this.business = val
    },
    dataType () {
      this.options = this.transformTreeNode(areaList)
    },
    onlyCheck (val, oldVal) {
      const item = val[0] || { codes: [] }
      const oldItem = oldVal[0] || { codes: [] }
      if (item.type === oldItem.type || item.codes.join() === oldItem.codes.join()) {
        return
      }
      this.options = this.transformTreeNode(areaList)
    },
    showLevel (val, oldVal) {
      const item = val[0] || { codes: [] }
      const oldItem = oldVal[0] || { codes: [] }
      if (item.type === oldItem.type || item.codes.join() === oldItem.codes.join()) {
        return
      }
      this.options = this.transformTreeNode(areaList)
    }
  },
  created () {
    //

    this.dataType = this.defaultDataType || isArray(this.onlyCheck) ? this.onlyCheck[0] : this.onlyCheck
    // areaList = this.getSortedAreaList()
    this.getSortedAreaList()
    this.options = this.transformTreeNode(areaList)
    this.createPinyinEngine(areaList)
  },
  methods: {
    getSortedAreaList () {
      // const areaList = LocalStorageCache.get(Constants.CACHE_LIST_COUNTY)
      areaList.sort((a, b) => {
        const aOrder = a.areaOrder + a.provOrder + a.cityOrder + a.countyOrder
        const bOrder = b.areaOrder + b.provOrder + b.cityOrder + b.countyOrder
        return aOrder - bOrder
      })
      return areaList
    },
    // 可查询数据组织成树
    transformTreeNode (areaList) {
      const tree = []
      const transform = { area: {}, prov: {}, city: {} }
      // 过滤条件整理
      const handleMap = {
        AREA: {
          show: this.showLevel.includes('AREA')
        },
        PROVINCE: {
          show: this.showLevel.includes('PROVINCE') && ['PROVINCE', 'CITY', 'COUNTY'].includes(this.dataType)
        },
        CITY: {
          show: this.showLevel.includes('CITY') && ['CITY', 'COUNTY'].includes(this.dataType)
        },
        COUNTY: {
          show: this.showLevel.includes('COUNTY') && ['COUNTY'].includes(this.dataType)
        }
      }
      // 数组转树
      areaList.forEach(element => {
        let _tree = tree
        let lastNode = {}
        if (handleMap.AREA.show) {
          if (transform.area[element.areaCode] === undefined) {
            const node = { value: element.areaCode, label: element.areaName, children: [] }
            transform.area[element.areaCode] = _tree.push(node) - 1
          }
          const areaNode = _tree[transform.area[element.areaCode]]
          _tree = areaNode.children
          lastNode = areaNode
        }
        if (handleMap.PROVINCE.show) {
          if (transform.prov[element.provCode] === undefined) {
            const node = { value: element.provCode, label: element.provName, children: [] }
            transform.prov[element.provCode] = _tree.push(node) - 1
          }
          const provNode = _tree[transform.prov[element.provCode]]
          _tree = provNode.children
          lastNode = provNode
        }
        if (handleMap.CITY.show) {
          if (transform.city[element.cityCode] === undefined) {
            const node = { value: element.cityCode, label: element.cityName, children: [] }
            transform.city[element.cityCode] = _tree.push(node) - 1
          }
          const cityNode = _tree[transform.city[element.cityCode]]
          _tree = cityNode.children
          lastNode = cityNode
        }
        if (handleMap.COUNTY.show) {
          _tree.push({ value: element.countyCode, label: element.countyName })
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
    createPinyinEngine (areaList) {
      pinyinEngine = new PinyinEngine(areaList, [
        'areaCode', 'areaName',
        'provCode', 'provName',
        'cityCode', 'cityName',
        'countyCode', 'countyName'
      ])
    },
    dataTypeChange (dataType) {
      this.dataType = dataType
    }
  }
}
</script>
