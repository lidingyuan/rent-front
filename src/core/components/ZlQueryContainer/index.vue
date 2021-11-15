<template>
  <div
    class="zl-query-container"
    :class="{'full-container':full}"
  >
    <div
      v-if="$slots.queryParam"
      class="query-param"
    >
      <slot name="queryParam" />
    </div>
    <div
      v-loading="loading"
      class="result-content"
    >
      <div class="result-head">
        <div class="title">
          {{ title }}
        </div>
        <div class="action">
          <el-input
            v-if="searchCol.length"
            v-model="searchKey"
            size="small"
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
          />
          <ExportExcel
            v-if="tableData.length && columns.length"
            :table-data="tableData"
            :columns="columns"
          />
          <el-button
            v-if="fullscreen"
            size="small"
            title="最大化"
            @click="handleWrapperFull"
          >
            缩放
          </el-button>
          <slot name="resultHead" />
        </div>
      </div>
      <div class="result-body">
        <!-- <WaterMark :text="text" /> -->
        <PixelWaterMark :number-list="id && (id+'').split('')" />
        <slot />
      </div>
      <div class="result-foot">
        <el-pagination
          v-if="pagination"
          :current-page="activePagination.current"
          :page-sizes="activePagination.pageSizes"
          :page-size="activePagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="activePagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <slot name="resultFoot" />
      </div>
    </div>
  </div>
</template>

<script>
import ExportExcel from '@/core/components/ExportExcel'
// import WaterMark from '@/core/components/WaterMark'
import PixelWaterMark from '@/core/components/PixelWaterMark'
import { mapGetters } from 'vuex'
export default {
  name: 'ZlQueryContainer',
  components: { ExportExcel, PixelWaterMark },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    pagination: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean
    },
    text: {
      type: String
    },
    fullscreen: {
      type: Boolean,
      default: true
    },
    searchCol: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activePagination: null,
      searchKey: '',
      full: false
    }
  },
  computed: {
    ...mapGetters('user', ['id'])
  },
  watch: {
    pagination: {
      handler (pagination) {
        this.activePagination = {
          current: 0,
          size: 20,
          total: 0,
          pageSizes: [20, 50, 80, 100],
          ...pagination
        }
      },
      deep: true,
      immediate: true
    },
    searchCol (val, oldVal) {
      if (JSON.stringify(val) === JSON.stringify(oldVal)) {
        return
      }
      this.filterData()
    },
    searchKey () {
      this.filterData()
    }
  },
  created () {
    document.addEventListener('webkitfullscreenchange', this.fullscreenchange)
    document.addEventListener('mozfullscreenchange', this.fullscreenchange)
    document.addEventListener('fullscreenchange', this.fullscreenchange)
  },
  methods: {
    handleWrapperFull () {
      const fullscreenElement = document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement
      if (fullscreenElement) {
        const fun = document.exitFullscreen || document.msExitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || (() => {})
        fun.call(document)
      } else {
        this.full = true
        const fun = document.body.requestFullScreen || document.body.webkitRequestFullScreen || document.body.MozRequestFullScreen || (() => {})
        fun.call(document.body)
      }
    },
    fullscreenchange () {
      const fullscreenElement = document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement
      if (fullscreenElement) {
        this.full = true
      } else {
        this.full = false
      }
    },
    handleSizeChange (val) {
      this.activePagination.size = val
      const { current, size, total } = this.activePagination
      this.$emit('update:pagination', { current, size, total })
    },
    handleCurrentChange (val) {
      this.activePagination.current = val
      const { current, size, total } = this.activePagination
      this.$emit('update:pagination', { current, size, total })
    },
    filterData () {
      if (!this.searchKey) {
        return this.$emit('filterData', null)
      }
      const filterData = this.tableData.filter(row => {
        return this.searchCol.some(col => {
          if (row[col] != null) {
            return row[col].indexOf(this.searchKey) !== -1
          }
        })
      })
      this.$emit('filterData', filterData)
    }
  }
}
</script>

<style lang='scss' scoped>
.zl-query-container{
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
  background: #F3F4F5;
  &.full-container{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .query-param{
    margin-bottom: 12px;
    padding: 12px;
    background: #FFFFFF;
  }
  .result-content{
    height: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .result-head{
      display: flex;
      justify-content: space-between;
      .action{
        display: flex;
        justify-content: flex-end;
      }
    }
    .result-body{
      position: relative;
      background: #FFFFFF;
      height: 0;
      flex-grow: 1;
    }
  }
  .watermark{
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    pointer-events: none;
    background: #FFFFFF;
    opacity: 0.5;
    z-index: 9;
  }
}
</style>
