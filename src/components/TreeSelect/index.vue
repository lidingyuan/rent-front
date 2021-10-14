<!-- 树状选择器 -->
<template>
  <el-dropdown
    trigger="click"
    class="tree-select"
    @visible-change="onVisibleChange">
    <el-input
      ref="input"
      v-model="labelModel"
      :placeholder="placeholder"
      :readonly="!filterable"
      :clearable="filterable"
      suffix-icon="el-icon-arrow-down"
      :class="{ 'rotate': showStatus }"
      :style="`width:${width || 160}px`"
      @input="onFilter" />
    <el-dropdown-menu slot="dropdown" placement="bottom-end">
      <el-tree
        ref="tree"
        :style="`min-width: ${treeWidth}; max-height:${treeHeight}`"
        :props="props"
        :node-key="props.key"
        :data="data"
        :show-checkbox="showCheckbox"
        :default-expanded-keys="expandedKeys"
        :default-checked-keys="checkedKeys"
        :filter-node-method="filterNode"
        @node-click="onClickNode"
        @check="onCheckChange">
      </el-tree>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'TreeSelect',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected'
  },
  props: {
    // 接收绑定参数，默认选中值
    value: String,
    // 输入框宽度
    width: String,
    // 选项数据
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        label: 'label',
        children: 'children',
        key: 'key',
        parentKey: 'parentKey'
      })
    },
    // 显示复选框？
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 可筛选？
    filterable: {
      type: Boolean,
      default: false
    },
    // 默认展开的结点
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    },
    // 默认展开层级
    defaultExpandedLevel: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 树宽度
      treeWidth: 'auto',
      // 树高度
      treeHeight: 'auto',
      // 输入框显示值
      labelModel: '',
      // 实际请求传值
      valueModel: ''
    }
  },
  computed: {
    // 是否为树状结构数据
    dataType () {
      const jsonStr = JSON.stringify(this.options)
      return jsonStr.indexOf(this.props.children) !== -1
    },
    // 若非树状结构，则转化为树状结构数据
    data () {
      return this.dataType ? this.options : this.switchTree()
    },
    // 默认展开的结点
    expandedKeys () {
      if (this.defaultExpandedKeys.length !== 0) {
        return this.defaultExpandedKeys
      }
      // 最小展开层级为1，最大展开层级为3
      const level = Math.min(Math.max(1, this.defaultExpandedLevel), 3)
      // 递归遍历data数组，返回层级 <= level的节点key值数组
      const fa = (list, currentLevel) => {
        const temp = []
        list.forEach(item => {
          if (currentLevel <= level) {
            temp.push(item[this.props.key])
          }
          if (item[this.props.children] && item[this.props.children].length) {
            fa(item.children, currentLevel + 1)
          }
        })
        return temp
      }
      return fa(this.data, 1)
    },
    // 选中的结点
    checkedKeys () {
      return this.value.split(',')
    }
  },
  watch: {
    labelModel (val) {
      if (!val) {
        this.valueModel = ''
      }
      // this.$refs.tree.filter(val)
    },
    value (val) {
      this.labelModel = this.queryTree(this.data, val)
    }
  },
  created () {
    // 检测输入框原有值并显示对应 label
    if (this.value) {
      this.labelModel = this.queryTree(this.data, this.value)
    }
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth)}px`
    })
  },
  methods: {
    // 单击节点
    onClickNode (item) {
      if (!this.showCheckbox) {
        this.labelModel = item[this.props.label]
        this.valueModel = item[this.props.key]
      }
    },
    // 复选框change时触发
    onCheckChange (node, checkedData) {
      // this.labelModel = this.$refs.tree.getCheckedNodes(false, true).map(item => item[this.props.label])
      // this.valueModel = this.$refs.tree.getCheckedKeys(true) // 仅叶子节点
      this.labelModel = checkedData.checkedNodes.map(item => item[this.props.label]).join(',')
      this.valueModel = checkedData.checkedKeys.join(',')
      this.$emit('select-change', this.valueModel)
    },
    onFilter (val) {
      this.$refs.tree.filter(val)
    },
    // 下拉框显示、隐藏时触发
    onVisibleChange (show) {
      if (show) {
        this.showStatus = true
        this.$refs.tree.filter(false)
      } else {
        this.showStatus = false
        this.$refs.input.blur()
        this.$emit('selected', this.valueModel)
      }
    },
    // 扁平数组转化为树状层级结构
    switchTree () {
      return this.cleanChildren(this.buildTree(this.options))
    },
    // 树节点过滤方法
    filterNode (query, data) {
      if (!query) return true
      return data[this.props.label].indexOf(query) !== -1
    },
    // 搜索树状数据中的 ID
    queryTree (tree, id) {
      const labels = []
      const ids = id.split(',')
      let stark = []
      stark = stark.concat(tree)
      while (stark.length) {
        const temp = stark.shift()
        if (temp[this.props.children]) {
          stark = stark.concat(temp[this.props.children])
        }
        if (ids.indexOf(temp[this.props.key]) >= 0) {
          labels.push(temp[this.props.label])
        }
      }
      return labels.join(',')
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree (data) {
      // shallow copy
      const items = JSON.parse(JSON.stringify(this.options))
      // 构造对象，方便查找
      let keyData = {}
      items.forEach(item => {
        keyData[item[this.props.key]] = item
      })
      // 构造树
      const tree = []
      const parentKey = this.props.parentKey
      const childrenKey = this.props.children
      for (let item of items) {
        const parentId = item[parentKey]
        if (parentId !== item[this.props.key] && // 元素的key不能与自身的parentKey相等
            keyData.hasOwnProperty(parentId)) {
          if (keyData[parentId][childrenKey]) {
            keyData[parentId][childrenKey].push(item)
          } else {
            keyData[parentId][childrenKey] = [item]
          }
        } else {
          tree.push(item)
        }
      }
      return tree
    },
    // 清除空 children 项
    cleanChildren (data) {
      const childrenKey = this.props.children
      const fa = (list) => {
        list.map((e) => {
          if (e[childrenKey] && e[childrenKey].length) {
            fa(e[childrenKey])
          } else {
            delete e[childrenKey]
          }
          return e
        })
        return list
      }
      return fa(data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tree {
    max-height: 350px;
    overflow-y: auto;
  }
  .tree-select /deep/ .el-input.el-input--suffix {
    cursor: pointer;
  }
  .tree-select /deep/ .el-input.el-input--suffix.rotate .el-input__suffix {
    transform: rotate(180deg);
  }
</style>
