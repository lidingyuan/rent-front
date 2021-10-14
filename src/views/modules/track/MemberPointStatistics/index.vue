<template>
<!-- 问卷调查活动开展情况查询-->
  <div>
    <!-- 查询表单 -->
    <el-form ref="queryForm" :inline="true" :inline-message="true" size="small" style="background:#FFFFF">
      <el-form-item label="查询时间:">
        <el-date-picker v-model="queryTime" size="small" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
      </el-form-item>
      <el-form-item label="类型:">
        <el-select size="small" v-model="queryParam.type" style="width: 90px">
          <el-option label="全部" :value="2"></el-option>
          <el-option label="增加" :value="1"></el-option>
          <el-option label="消耗" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源:">
        <el-select size="small" v-model="queryParam.sourceType" style="width: 110px">
          <el-option label="全部" value=""></el-option>
          <el-option label="群发泰山币" value="1302886986056380417,1302886986056380417-1,1302886986056380417-2,1416953815092248578,1416953815092248578-1,1416953815092248578-2"></el-option>
          <el-option label="商城兑换" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机:">
        <el-input v-model="queryParam.mobile" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="粉丝类型:">
        <el-select size="small" v-model="queryParam.userType" style="width: 100px">
            <el-option label="全部" value="00"></el-option>
            <el-option label="零售户" value="1"></el-option>
            <el-option label="非零售户" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" >查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-download" @click="handleExcelDownload" >导出</el-button>
      </el-form-item>
    </el-form>
    <table-wrapper :filterable="false" :excel="true" height="calc(100vh - 13rem)">
      <div slot="title">用户积分变动监控</div>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="dataList" size="small" height="100%" border stripe ref="table">
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="userid" width="80" label="粉丝ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nickname" width="150" label="粉丝昵称" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="mobile" width="110" label="手机号"></el-table-column>
        <el-table-column prop="balancepoint" width="100" label="账户余额" align="right"></el-table-column>
        <el-table-column prop="num" width="80" label="变动次数" align="right"></el-table-column>
        <el-table-column prop="points" width="100" label="变动数额" align="right"></el-table-column>
        <el-table-column prop="warnid" width="150" label="预警关注" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.warnid === 1" type="danger">预警关注</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click.native="handleShowUserPointStat(scope.row)">来源统计</el-button>
            <el-button type="primary" size="mini" @click.native="handleShowUserPointRecord(scope.row)">收支记录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 标签编辑框 -->
    <el-dialog title="用户积分来源统计" :visible.sync="dialogUserPointStatVisible" :close-on-click-modal="false" :append-to-body="true" width="800px">
      <user-point-stat v-if="dialogUserPointStatVisible" :userId="selectedUserId" :default-query-time="queryTime"></user-point-stat>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserPointStatVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="用户积分收支记录" :visible.sync="dialogUserPointRecordVisible" :close-on-click-modal="false" :append-to-body="true" width="800px">
      <user-point-record v-if="dialogUserPointRecordVisible" :userId="selectedUserId" :default-query-time="queryTime"></user-point-record>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserPointRecordVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import TableWrapper from '@/components/TableWrapper'
import UserPointStat from './UserPointStat.vue'
import UserPointRecord from './UserPointRecord.vue'
import * as trackApi from '@/api/track/trackApi.js'

import SimpleDateFormatter from '@/utils/SimpleDateFormatter'
import ExportPlus from 'export-table'

export default {
  name: 'MemberPointStatistics',
  components: { TableWrapper, UserPointStat, UserPointRecord },
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
        mobile: '',
        type: 2,
        userType: '00',
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
      loading: false,
      // ---
      dialogUserPointStatVisible: false,
      dialogUserPointRecordVisible: false,
      selectedUserId: ''
    }
  },
  created () {
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
        beginDate: SimpleDateFormatter(this.queryTime[0].getTime()),
        endDate: SimpleDateFormatter(this.queryTime[1].getTime())
      }
      trackApi.userIntegralCount(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.record
        this.loading = false
      })
    },
    handleShowUserPointStat (row) {
      this.selectedUserId = row.userid
      this.dialogUserPointStatVisible = true
    },
    handleShowUserPointRecord (row) {
      this.selectedUserId = row.userid
      this.dialogUserPointRecordVisible = true
    },
    // 下载excel文件
    handleExcelDownload () {
      // 表头信息
      let columns = [
        { prop: 'userid', title: '粉丝ID', width: '200' },
        { prop: 'nickname', title: '粉丝昵称', width: '300' },
        { prop: 'mobile', title: '手机号', width: '150' },
        { prop: 'balancepoint', title: '账户余额', width: '200' },
        { prop: 'num', title: '变动次数', width: '150' },
        { prop: 'points', title: '变动数额', width: '150' }
      ]
      let describe = '时间：' + SimpleDateFormatter(this.queryTime[0].getTime()) + '至' + SimpleDateFormatter(this.queryTime[1].getTime())
      if (this.queryParam.type !== '00') {
        describe += '，类型：' + (this.queryParam.type === 1 ? '增加' : '消耗')
      }
      if (this.queryParam.sourceType !== '') {
        describe += '，来源：' + (this.queryParam.sourceType === '1' ? '商城兑换' : '群发泰山币')
      } else {
        describe += '，来源：全部'
      }
      if (this.queryParam.userType !== '00') {
        describe += '，粉丝类型：' + (this.queryParam.userType === '1' ? '零售户' : '非零售户')
      }
      const ExportTable = new ExportPlus({
        title: '用户积分变动监控',
        describe: describe
      })
      ExportTable.json_xlsx(this.dataList, columns, {
        cellFormat: this.cellFormatCheckType,
        cellStyle: this.cellStyle
      })
    }
  }
}
</script>
