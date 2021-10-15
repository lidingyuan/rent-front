<template>
  <div
    class="search-picker"
    @click="clickDropdown"
  >
    <el-dropdown
      ref="dropdown"
      trigger="click"
      :hide-on-click="false"
      @visible-change="visibleChange"
    >
      <div
        class="picker-btn"
        @mouseenter="inputHover = true"
        @mouseleave="inputHover = false"
      >
        <el-select
          v-model="dataType"
          :size="size"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dataTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          ref="input"
          v-model="inputValue"
          class="main-input"
          :class="{'is-focus':pickerVisible}"
          :size="size"
          :placeholder="inputPlaceholder"
          @focus="inputFocus"
          @blur="inputBlur"
        >
          <template slot="suffix">
            <el-tooltip placement="top">
              <span>{{ checkedKeys.length-1>0?'+'+(checkedKeys.length-1):'' }}</span>
              <div slot="content">
                {{ checkedNames.join() }}
              </div>
            </el-tooltip>
            <i
              v-if="clearBtnVisible"
              key="clear"
              class="el-input__icon el-icon-circle-close"
              @click.stop="handleClear"
            />
            <i
              v-else
              key="arrow-down"
              :class="[
                'el-input__icon',
                'el-icon-arrow-down',
                pickerVisible && 'is-reverse'
              ]"
              @click.stop="clickDropdown()"
            />
          </template>
        </el-input>
      </div>
      <el-dropdown-menu slot="dropdown">
        <scroll-box
          ref="scrollBox"
          style="height:200px;width:200px;"
        >
          <el-tree
            ref="tree"
            :data="options"
            node-key="value"
            :show-checkbox="!single"
            @node-click="getCheckedNode"
            @check="getCheckedNodes"
          />
        </scroll-box>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import ScrollBox from '@/core/components/ScrollBox'
export default {
  name: 'SearchPicker',
  components: {
    ScrollBox
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    // 单选
    single: {
      type: Boolean,
      default: false
    },
    dataTypeOptions: {
      type: Array,
      default: () => []
    },
    defaultDataType: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'mini'
    },
    // 限制选择数量上限
    limit: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      pickerVisible: false,
      dataType: '',
      inputPlaceholder: '',
      inputValue: '',
      checkedKeys: [],
      checkedNames: [],
      searching: false,
      inputHover: false
    }
  },
  computed: {
    clearBtnVisible () {
      return this.inputValue !== '' && this.inputHover
    }
  },
  watch: {
    value (val) {
      const item = val[0] || { codes: [] }
      if (item.codes.join() === this.checkedKeys.join()) {
        return
      }
      this.dataType = item.type || this.dataType
      this.$refs.tree.setCheckedKeys(item.codes)
      this.setCheckedValue(this.$refs.tree.getCheckedNodes(true))
    },
    inputValue () {
      if (this.searching) {
        this.$emit('search', this.inputValue)
      }
    },
    options () {
      this.$refs.tree.setCheckedKeys(this.checkedKeys)
    },
    pickerVisible (val) {
      if (!val && !this.single) {
        this.searching = false
        const nodes = this.$refs.tree.getCheckedNodes(true)
        this.inputValue = nodes[0] ? nodes[0].label : ''
      }
    },
    checkedKeys (val) {
      this.pushValue()
    },
    dataType (val) {
      this.$emit('dataTypeChange', val)
      this.$nextTick(() => {
        this.pushValue()
      })
    }
  },
  created () {
    //
    this.dataType = this.defaultDataType
  },
  methods: {
    //
    getCheckedNode (obj, node) {
      // 单选
      if (this.single && node.isLeaf) {
        this.searching = false
        this.inputValue = obj.label
        this.setCheckedValue([node.data])
      }
    },
    getCheckedNodes () {
      const nodes = this.$refs.tree.getCheckedNodes(true)
      this.setCheckedValue(nodes)
    },
    setCheckedValue (nodes) {
      if (!this.searching) {
        this.inputValue = nodes[0] ? nodes[0].label : ''
      }
      if (this.limit && this.limit < nodes.length) {
        nodes.length = this.limit
        this.$refs.tree.setCheckedKeys(nodes.map(item => item.value))
        this.$message('限选' + this.limit + '个')
      }
      this.checkedKeys = nodes.map(item => item.value)
      this.checkedNames = nodes.map(item => item.label)
    },
    // 点击保持展开
    clickDropdown () {
      this.$refs.dropdown.show()
    },
    inputFocus () {
      if (!this.searching) {
        this.searching = true
        this.inputPlaceholder = this.inputValue
        this.inputValue = ''
      }
    },
    inputBlur () {
      if (this.inputValue === '') {
        this.searching = false
        this.inputValue = this.inputPlaceholder
        this.inputPlaceholder = ''
      }
    },
    handleClear () {
      this.$refs.tree.setCheckedKeys([])
      this.setCheckedValue([])
    },
    visibleChange (visible) {
      this.pickerVisible = visible

      // dropdown创建时是dispalynone,在打开时计算scrollBox的bar width
      visible && this.$refs.scrollBox.computeBarWidth()
    },
    pushValue () {
      let value = []
      if (this.checkedKeys.length) {
        value = [{ type: this.dataType, codes: this.checkedKeys }]
      }
      this.$emit('input', value)
    }
  }
}
</script>

<style lang='scss' scoped>
.search-picker{
  display: inline-block;
  .picker-btn{
    display: flex;
  }
  ::v-deep .el-dropdown{
    .main-input{
      width: 120px;
      &.is-focus .el-input__inner{
        border-color: #409EFF;
      }
      .el-input__inner{
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      .el-input__icon{
        cursor: pointer;
        &.is-reverse{
          transform: rotateZ(180deg);
        }
      }
    }
    .el-select{
      width: 80px;
      .el-input__inner{
        padding: 10px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
}
</style>
