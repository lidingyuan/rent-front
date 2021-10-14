<template>
<!-- 问卷调查活动开展情况查询-->
  <div>
    <!-- 查询表单 -->
    <el-form ref="queryForm" :inline="true" :inline-message="true" size="small" style="background:#FFFFF">
      <el-form-item label="查询时间:">
        <el-date-picker v-model="queryTime" size="small" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
      </el-form-item>
      <el-form-item label="来源:">
        <el-select size="small" v-model="queryParam.sourceType" style="width: 110px">
          <el-option label="全部" value=""></el-option>
          <el-option label="群发泰山币" value="1302886986056380417,1302886986056380417-1,1302886986056380417-2,1416953815092248578,1416953815092248578-1,1416953815092248578-2"></el-option>
          <el-option label="商城兑换" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" >查询</el-button>
      </el-form-item>
    </el-form>
    <table-wrapper :filterable="false" :excel="true" height="400px">
      <div slot="title">积分收支记录</div>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="dataList" size="small" height="100%" border stripe ref="table">
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="effecttime" width="150" label="发生时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sourcename" width="200" label="来源名称" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="num" width="100" label="次数/商品数量" align="right"></el-table-column>
        <el-table-column prop="point" width="150" label="使用泰山币" align="right"></el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

  </div>
</template>

<script>
import TableWrapper from '@/components/TableWrapper'
import * as trackApi from '@/api/track/trackApi.js'

import SimpleDateFormatter from '@/utils/SimpleDateFormatter'

export default {
  name: 'MemberPointUserPointRecord',
  components: { TableWrapper },
  props: {
    userId: String,
    defaultQueryTime: Array
  },
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const end = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
              const start = new Date(new Date().setHours(0, 0, 0, 0))
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近两天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      queryTime: [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)],
      queryParam: {
        sourceType: ''
      },
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      // ---数据
      dataList: [],
      dialogStatus: '',
      loading: false
    }
  },
  created () {
    this.queryTime = [ ...this.defaultQueryTime ]
    this.handleSearch()
  },
  methods: {
    // ---查询列表
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    // 翻页
    handleCurrentChange (current) {
      this.page.current = current
      this.$table.scrollTopAfterPage(this.$refs.table)
      this.doSearch()
    },
    doSearch () {
      if (this.queryTime === undefined || this.queryTime === null || this.queryTime.length < 2 || this.queryTime[0].getTime() > this.queryTime[1].getTime()) {
        this.$alert('请选择查询时间')
        return
      }
      this.loading = true
      const options = {
        ...this.page,
        ...this.queryParam,
        sourceType: this.queryParam.sourceType ? this.queryParam.sourceType.split(',') : [],
        userId: this.userId,
        beginDate: SimpleDateFormatter(this.queryTime[0].getTime()),
        endDate: SimpleDateFormatter(this.queryTime[1].getTime())
      }
      trackApi.userPointDetails(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.record
        this.loading = false
      })
    }
  }
}
</script>
