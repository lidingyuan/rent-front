<template>
  <div class="table-wrapper" :style="{ height: height }">
    <div class="table-wrapper-header" v-if="showHeader">
      <div class="table-wrapper-header-title">
        <slot name="title">此处是标题</slot>
      </div>
      <div class="table-wrapper-header-operates">
        <div class="customer-operates">
          <slot name="operates"></slot>
        </div>
        <el-input v-if="filterable" size="small" v-model="filterText" :clearable="true" :placeholder="filterPlaceholder" :title="filterPlaceholder" @change="doFilter" class="filter-box">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-button slot="append" icon="el-icon-search" @click="doFilter"></el-button>
        </el-input>
        <el-button-group>
          <!-- 暂时禁用excel导出功能，待此项功能完善后再放开
          <el-button size="small" v-if="excel" title="导出Excel" @click="handleExportExcel" >
            <svg-icon icon-class="export-excel"></svg-icon>
          </el-button>
          -->
          <el-button size="small" v-if="expand" title="最大化" @click="handleWrapperFull">
            <svg-icon icon-class="expand"></svg-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="table-wrapper-body" :style="{ bottom: footerHeight}">
      <slot></slot>
    </div>
    <div class="table-wrapper-footer" :style="{ height: footerHeight}">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TableWrapper',
  props: {
    // 组件高度
    height: {
      type: String,
      default: 'calc(100vh - 8rem)'
    },
    // 是否显示筛选框
    filterable: {
      type: Boolean,
      default: true
    },
    // 筛选框占位符
    filterPlaceholder: {
      type: String,
      default: 'placeholder'
    },
    // 筛选方法
    filterMethod: {
      type: Function,
      default: () => {}
    },
    // 导出 Excel
    excel: {
      type: Boolean,
      default: true
    },
    // 最大化
    expand: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      filterText: '',
      expandIcon: 'expand-arrows-alt'
    }
  },
  computed: {
    footerHeight () {
      if (this.$slots['footer']) {
        return '2rem'
      }
      return '0'
    }
  },
  methods: {
    doFilter () {
      this.filterMethod && this.filterMethod(this.filterText)
    },
    clearFilterText () {
      this.filterText = ''
    },
    handleExportExcel () {
      // 导出 Excel
      // TODO 导出 Excel
    },
    handleWrapperFull () {
      // 最大化
      let wrapperEl = this.$el
      if (wrapperEl.classList.contains('full')) {
        // 窗口还原
        wrapperEl.classList.remove('full')
        this.expandIcon = 'expand-arrows-alt'
      } else {
        // 最大化
        wrapperEl.classList.add('full')
        // 修改为还原图标
        // TODO 图标替换
        this.expandIcon = 'compress-arrows-alt'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .table-wrapper {
    &.full {
      position: fixed;
      z-index: 1999;
      top: 0;
      left: 0;
      width: 100vw !important;
      height: 100vh !important;
      background-color: #fff;
    }

    position: relative;
    border-radius: .5rem;

    > div {
      width: 100%;
    }
    .table-wrapper-header {
      position: absolute;
      top: 0px;
      padding-left: 1rem;
      padding-right: 1rem;
      width: 100%;
      height: 3rem;
      line-height: 3rem;
      background-color: #f9fafc;
      .table-wrapper-header-title {
        display: inline-block;
      }
      .table-wrapper-header-operates {
        display: block;
        float: right;
        .filter-box {
          width: 18rem;
        }
        > .customer-operates {
          display: inline-block;
          > * {
            margin-right: 10px;
          }
          > .el-button+.el-button {
            margin-left: 0;
          }
        }
      }
    }
    .table-wrapper-body {
      position: absolute;
      top: 3rem;
      overflow-y: auto;
    }
    .table-wrapper-footer {
      position: absolute;
      bottom: 0;
    }
  }
</style>
