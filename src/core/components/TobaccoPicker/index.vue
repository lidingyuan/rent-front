<template>
  <div class="tobacco-picker">
    <span
      class="picker-title"
      :class="labelClass"
    >{{ label }}</span>
    <el-button
      size="mini"
      @click="dialogIndustrySearch = true"
    >
      {{ showText }}
    </el-button>
    <el-button
      v-if="isPicked"
      type="primary"
      icon="el-icon-delete"
      plain
      size="mini"
      @click="reset"
    >
      清除
    </el-button>
    <el-dialog
      title="选择卷烟"
      :visible.sync="dialogIndustrySearch"
      width="550px"
      @close="setOption"
    >
      <div class="row">
        <span class="dialog-picker-title">工业品牌规格：</span>
        <product-picker
          v-model="industry"
          size="mini"
          :only-check="onlyCheck"
          :single="single"
          label=""
          :label-class="labelClass"
          :default-data-type="defaultDataType"
          style="display:inline-block;"
        />
      </div>
      <div class="row">
        <span class="dialog-picker-title">卷烟价类：</span>
        <el-checkbox-group
          v-model="range_type1"
          size="mini"
        >
          <el-checkbox
            v-for="item in rangeTypeOptions1"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="row">
        <span class="dialog-picker-title">零售价区间：</span>
        <el-select
          v-model="price_type"
          size="mini"
          multiple
          collapse-tags
          placeholder="请选择"
        >
          <el-option
            v-for="item in priceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="row">
        <span class="dialog-picker-title">双十五品牌：</span>
        <el-radio
          v-model="double_fifteen"
          :label="-1"
        >
          所有
        </el-radio>
        <el-radio
          v-model="double_fifteen"
          :label="1"
        >
          双十五品牌
        </el-radio>
        <el-radio
          v-model="double_fifteen"
          :label="0"
        >
          非双十五品牌
        </el-radio>
      </div>
      <div class="row">
        <span class="dialog-picker-title">重点品牌：</span>
        <el-radio
          v-model="important"
          :label="-1"
        >
          所有
        </el-radio>
        <el-radio
          v-model="important"
          :label="1"
        >
          重点品牌
        </el-radio>
        <el-radio
          v-model="important"
          :label="0"
        >
          非重点品牌
        </el-radio>
      </div>
      <div class="row">
        <span class="dialog-picker-title">鼓励品牌：</span>
        <el-radio
          v-model="encourage"
          :label="-1"
        >
          所有
        </el-radio>
        <el-radio
          v-model="encourage"
          :label="1"
        >
          鼓励品牌
        </el-radio>
        <el-radio
          v-model="encourage"
          :label="0"
        >
          非鼓励品牌
        </el-radio>
      </div>
      <div class="row">
        <span class="dialog-picker-title">卷烟大类：</span>
        <el-radio
          v-model="fcg"
          :label="-1"
        >
          所有
        </el-radio>
        <el-radio
          v-model="fcg"
          :label="0"
        >
          常规卷烟
        </el-radio>
        <el-radio
          v-model="fcg"
          :label="1"
        >
          非常规卷烟
        </el-radio>
      </div>
      <div class="row">
        <span class="dialog-picker-title">卷烟品类：</span>
        <el-checkbox-group
          v-model="range_type2"
          size="mini"
        >
          <el-checkbox
            v-for="item in rangeTypeOptions2"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="row">
        <span class="dialog-picker-title">焦油含量：</span>
        <el-input-number
          v-model="tarRange.min"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
        -
        <el-input-number
          v-model="tarRange.max"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
      </div>
      <div class="row">
        <span class="dialog-picker-title">中支烟：</span>
        <el-radio
          v-model="zz"
          :label="-1"
        >
          所有
        </el-radio>
        <el-radio
          v-model="zz"
          :label="1"
        >
          中支烟
        </el-radio>
        <el-radio
          v-model="zz"
          :label="0"
        >
          非中支烟
        </el-radio>
      </div>
      <div class="row">
        <span class="dialog-picker-title">短支烟：</span>
        <el-radio
          v-model="dz"
          :label="-1"
        >
          所有
        </el-radio>
        <el-radio
          v-model="dz"
          :label="1"
        >
          短支烟
        </el-radio>
        <el-radio
          v-model="dz"
          :label="0"
        >
          非短支烟
        </el-radio>
      </div>
      <div class="row">
        <span class="dialog-picker-title">细支烟：</span>
        <el-radio
          v-model="xz"
          :label="-1"
        >
          所有
        </el-radio>
        <el-radio
          v-model="xz"
          :label="1"
        >
          细支烟
        </el-radio>
        <el-radio
          v-model="xz"
          :label="0"
        >
          非细支烟
        </el-radio>
      </div>
      <div class="row">
        <span class="dialog-picker-title">爆珠烟：</span>
        <el-radio
          v-model="bz"
          :label="-1"
        >
          所有
        </el-radio>
        <el-radio
          v-model="bz"
          :label="1"
        >
          爆珠烟
        </el-radio>
        <el-radio
          v-model="bz"
          :label="0"
        >
          非爆珠烟
        </el-radio>
      </div>
      <div class="row">
        <span class="dialog-picker-title">卷烟条码：</span>
        <el-input
          v-model="tobaCode"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
      </div>
      <div class="row">
        <span class="dialog-picker-title">批发条价：</span>
        <el-input-number
          v-model="wholesalePriceRange.min"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
        -
        <el-input-number
          v-model="wholesalePriceRange.max"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
      </div>
      <div class="row">
        <span class="dialog-picker-title">零售条价：</span>
        <el-input-number
          v-model="retailPriceRange.min"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
        -
        <el-input-number
          v-model="retailPriceRange.max"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
      </div>
      <div class="row">
        <span class="dialog-picker-title">调拨条价：</span>
        <el-input-number
          v-model="allotPriceRange.min"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
        -
        <el-input-number
          v-model="allotPriceRange.max"
          size="mini"
          :style="{width:'150px'}"
          clearable
        />
      </div>
      <div style="text-align:right;">
        <el-button
          type="primary"
          size="mini"
          style="width:80px;"
          @click="setOption"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import LocalStorageCache from '@/core/cache/LocalStorageCache'
import ProductPicker from '@/core/components/ProductPicker'
// import * as Constants from '@/core/Constants'
import rangeList from './rangeList.json'
export default {
  name: 'TobaccoPicker',
  components: { ProductPicker },
  props: {
    value: {
      type: Object,
      default: () => { return {} }
    },
    // 只允许选择某一级
    onlyCheck: {
      type: [String, Array],
      default: () => ['INDUSTRY', 'BRAND', 'TOBACCO']
    },
    // 单选
    single: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '选择卷烟：'
    },
    // 标签样式
    labelClass: {
      type: String
    },
    // 默认显示层级
    defaultDataType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      //
      industry: [],
      names: [],
      double_fifteen: -1,
      important: -1,
      encourage: -1,
      fcg: -1,
      price_type: '',
      priceTypeOptions: [],
      range_type1: [],
      range_type2: [],
      rangeTypeOptions1: [
        { label: '一类', value: '01' },
        { label: '二类', value: '02' },
        { label: '三类', value: '03' },
        { label: '四类', value: '04' },
        { label: '五类', value: '05' }
      ],
      rangeTypeOptions2: [
        { label: '前三类', value: '123' },
        { label: '一二类', value: '12' },
        { label: '高价位', value: '011' },
        { label: '纯高端', value: '012' },
        { label: '普一类', value: '013' },
        { label: '高二类', value: '021' },
        { label: '低二类', value: '022' }
      ],
      option: {},
      tarRange: {
        min: null,
        max: null
      },
      wholesalePriceRange: {
        min: null,
        max: null
      },
      retailPriceRange: {
        min: null,
        max: null
      },
      allotPriceRange: {
        min: null,
        max: null
      },
      dialogIndustrySearch: false,
      tobaParam: {},
      tobaCode: '',
      zz: -1,
      xz: -1,
      dz: -1,
      bz: -1,
      isFirst: true
    }
  },
  computed: {
    isPicked () {
      if (this.option.productParam.length > 0 || Object.keys(this.option.tobaParam).length > 0) {
        return true
      }
      return false
    },
    showText () {
      if (this.isPicked) {
        return '已选卷烟'
      }
      return '选择卷烟'
    }
  },
  created () {
    //
    this.getRangeList()
    this.setData()
    this.setOption()
  },
  methods: {
    //
    getRangeList () {
      // const rangeList = LocalStorageCache.get(Constants.CACHE_LIST_TOBACCO_RANGE)
      this.priceTypeOptions = rangeList.filter(range => range.rangeType === '01').map(range => { return { label: range.name, value: range.code } })
    },
    setOption () {
      const tobaParam = {}
      if (this.double_fifteen !== -1) {
        if (!tobaParam.dynamicFlags) {
          tobaParam.dynamicFlags = []
        }
        tobaParam.dynamicFlags.push({ flag: 'DOUBLE_FIFTEEN', value: this.double_fifteen })
      }
      if (this.important !== -1) {
        if (!tobaParam.dynamicFlags) {
          tobaParam.dynamicFlags = []
        }
        tobaParam.dynamicFlags.push({ flag: 'IMPORTANT', value: this.important })
      }
      if (this.encourage !== -1) {
        if (!tobaParam.dynamicFlags) {
          tobaParam.dynamicFlags = []
        }
        tobaParam.dynamicFlags.push({ flag: 'ENCOURAGE', value: this.encourage })
      }
      if (this.fcg !== -1) {
        tobaParam.fcg = this.fcg
      }
      if (this.price_type) {
        if (!tobaParam.rangeCodes) {
          tobaParam.rangeCodes = []
        }
        tobaParam.rangeCodes.push(...this.price_type)
      }
      if (this.range_type1.length || this.range_type2.length) {
        if (!tobaParam.rangeCodes) {
          tobaParam.rangeCodes = []
        }
        tobaParam.rangeCodes.push(...this.range_type1)
        tobaParam.rangeCodes.push(...this.range_type2)
      }
      if (this.tarRange.min || this.tarRange.max) {
        tobaParam.tarRange = this.tarRange
      }
      if (this.wholesalePriceRange.min || this.wholesalePriceRange.max) {
        tobaParam.wholesalePriceRange = this.wholesalePriceRange
      }
      if (this.retailPriceRange.min || this.retailPriceRange.max) {
        tobaParam.retailPriceRange = this.retailPriceRange
      }
      if (this.allotPriceRange.min || this.allotPriceRange.max) {
        tobaParam.allotPriceRange = this.allotPriceRange
      }

      // 清除空rangeCodes
      if (tobaParam.rangeCodes && !tobaParam.rangeCodes.length) {
        delete tobaParam.rangeCodes
      }

      tobaParam.creativeFlags = []
      if (this.zz !== -1) {
        tobaParam.creativeFlags.push({ flag: 'ZZ', value: this.zz })
      }
      if (this.dz !== -1) {
        tobaParam.creativeFlags.push({ flag: 'DZ', value: this.dz })
      }
      if (this.xz !== -1) {
        tobaParam.creativeFlags.push({ flag: 'XZ', value: this.xz })
      }
      if (this.bz !== -1) {
        tobaParam.creativeFlags.push({ flag: 'BZ', value: this.bz })
      }
      if (!tobaParam.creativeFlags.length) {
        delete tobaParam.creativeFlags
      }

      if (this.tobaCode) {
        this.industry.push({ type: 'TOBACCO', codes: [this.tobaCode] })
      }

      this.dialogIndustrySearch = false
      this.tobaParam = tobaParam
      this.option = { productParam: this.industry, tobaParam: tobaParam }
      this.$emit('input', this.option)
    },
    setData () {
      if (this.value.productParam) {
        this.industry = this.value.productParam
      }
      if (this.value.tobaParam) {
        const dynamicFlags = this.value.tobaParam.dynamicFlags || []
        dynamicFlags.forEach(item => {
          this[item.flag.toLowerCase()] = Number(item.value) || 0
        })
        const rangeCodes = this.value.tobaParam.rangeCodes || []
        this.price_type = []
        rangeCodes.forEach(item => {
          if (this.rangeTypeOptions1.findIndex(range => range.value === item) > -1) {
            this.range_type1.push(item)
          } else if (this.rangeTypeOptions2.findIndex(range => range.value === item) > -1) {
            this.range_type2.push(item)
          } else if (this.priceTypeOptions.findIndex(range => range.value === item) > -1) {
            this.price_type.push(item)
          }
        })
        if (this.value.tobaParam.tarRange) {
          this.tarRange = this.value.tobaParam.tarRange
        }
        if (this.value.tobaParam.wholesalePriceRange) {
          this.wholesalePriceRange = this.value.tobaParam.wholesalePriceRange
        }
        if (this.value.tobaParam.retailPriceRange) {
          this.retailPriceRange = this.value.tobaParam.retailPriceRange
        }
        if (this.value.tobaParam.allotPriceRange) {
          this.allotPriceRange = this.value.tobaParam.allotPriceRange
        }
      }
    },
    reset () {
      this.industry = []
      this.names = []
      this.double_fifteen = -1
      this.important = -1
      this.encourage = -1
      this.fcg = -1
      this.price_type = ''
      this.range_type1 = []
      this.range_type2 = []
      this.tarRange = {
        min: null,
        max: null
      }
      this.wholesalePriceRange = {
        min: null,
        max: null
      }
      this.retailPriceRange = {
        min: null,
        max: null
      }
      this.allotPriceRange = {
        min: null,
        max: null
      }
      this.tobaParam = {}
      this.zz = -1
      this.xz = -1
      this.dz = -1
      this.bz = -1
      this.tobaCode = ''
      this.option = { productParam: [], tobaParam: {} }
      this.$emit('input', { productParam: this.industry, tobaParam: {} })
    }
  }
}
</script>

<style lang='scss' scoped>
.tobacco-picker{
  .row{
    margin: 10px 0;
    display: flex;
  }
  .dialog-picker-title{
    display: inline-block;
    width: 100px;
    flex-shrink: 0;
    text-align: right;
  }
  ::v-deep .el-input{
    input{
      height: 28px!important;
    }
  }
}
</style>
