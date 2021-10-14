<template>
<!-- 扫码抽奖活动开展情况 -->
  <div>
    <!-- 查询表单 -->
    <el-form ref="queryForm" :inline="true" :inline-message="true" size="small" style="background:#FFFFF">
      <el-form-item label="查询时间:">
        <date-picke v-model="exCheckDate3" @changeDate="changeDate($event)" style="width: 330px"></date-picke>
      </el-form-item>
      <el-form-item label="省份:">
        <el-select size="small" v-model="region.provCode" placeholder="请选择省份" style="width: 130px" @change="provChange">
          <el-option v-for="item in provinceList"
            :key="item.provCode"
            :label="item.provName"
            :value="item.provCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地市:">
        <el-select size="small" v-model="region.cityCode" placeholder="请选择地市" style="width: 130px" @change="cityChange">
          <el-option v-for="item in cityList"
            :key="item.cityCode"
            :label="item.cityName"
            :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区县:">
        <el-select size="small" v-model="region.countyCode" placeholder="请选择区县" style="width: 130px">
          <el-option v-for="item in countyList"
            :key="item.countyCode"
            :label="item.countyName"
            :value="item.countyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卷烟规格:">
        <el-select size="small" v-model="region.tobaId" placeholder="请选择卷烟规格" style="width: 160px">
          <el-option v-for="item in SpecificationsList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动是否在展开:">
        <el-select size="small" v-model="region.whether" style="width: 80px">
          <el-option label="否" value="1"></el-option>
          <el-option label="是" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :disabled="disableButton">查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-download" @click="handleExcelDownload" :disabled="disableButton">导出</el-button>
      </el-form-item>
    </el-form>
    <table-wrapper :filterable="false" :excel="true" height="500px">
      <!-- 标题 -->
      <div slot="title">扫码抽奖活动开展情况</div>
      <!-- 列表 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="dataList" size="small" height="100%" border stripe ref="table" @cell-dblclick="onChange">
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="150" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" width="300" label="活动名称" show-overflow-tooltip >
          <template slot-scope="scope">
            <i class="el-icon-document-copy" style="color:#409eff;margin-right:5px;" @click="handleCopyActUrl(scope.row)"></i>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" width="150" label="活动开始时间"></el-table-column>
        <el-table-column prop="endTime" width="150" label="活动结束时间"></el-table-column>
        <el-table-column prop="whether" width="150" label="活动是否正在开展" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.whether === 1">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column prop="tobaname" width="300" label="卷烟规格"></el-table-column>
        <el-table-column prop="drawCnt" width="80" label="抽奖次数" align="right"></el-table-column>
        <el-table-column prop="prizeCnt" width="80" label="中奖次数" show-overflow-tooltip ></el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 活动编辑框 -->
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="900px">
      <!-- 说明内容 -->
        <el-table :data="dialogList" size="small" height="100%" border stripe ref="table" @cell-dblclick="onChange">
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="180" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" width="180" label="奖项名称" show-overflow-tooltip ></el-table-column>
        <el-table-column label="图片" min-width="100%" >
          <template   slot-scope="scope">
            <img :src="scope.row.url"  min-width="70" height="70" />
          </template>
        </el-table-column>
        <el-table-column prop="planNum" width="150" label="预设奖池" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="usedNum" width="150" label="中奖人数" show-overflow-tooltip ></el-table-column>
      </el-table>
      <div style="text-align:right">
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DatePicke from './components/DataPicker'
import TableWrapper from '@/components/TableWrapper'
import * as trackApi from '@/api/track/trackApi.js'
import ExportPlus from 'export-table'

export default {
  name: 'ActConfig',
  components: { TableWrapper, DatePicke },
  data () {
    return {
      countyList: [],
      cityList: [],
      SpecificationsList: [],
      disableButton: false,
      exCheckDate3: [],
      options: [],
      value: [],
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: '',
      // 编辑的表单数据
      formData: null,
      provinceList: [],
      dialogList: [],
      region: {
        beginDate: '',
        endDate: '',
        provCode: '',
        cityCode: '',
        countyCode: '',
        whether: '1',
        tobaId: ''
      },
      loading: false
    }
  },
  created () {
    this.getProvince()
    this.handleSearch()
  },
  watch: {
    // dialogFormVisible (newVal) {
    //   if (!newVal) {
    //     this.showActGuide = true
    //   }
    // }
  },
  methods: {
    provChange (val) {
      this.region.cityCode = ''
      this.region.countyCode = ''
      trackApi.cityList().then(res => {
        this.cityList = res.data.filter(item => item.provCode === val)
      })
    },
    cityChange (val) {
      this.region.countyCode = ''
      trackApi.countyList().then(res => {
        this.countyList = res.data.filter(item => item.cityCode === val)
      })
    },
    getProvince () {
      trackApi.provList().then(res => {
        this.provinceList = res.data
      })
      trackApi.tobaccoList().then(res => {
        this.SpecificationsList = res.data
      })
    },
    // 时间
    changeDate (val) {
      this.region.beginDate = val[0]
      this.region.endDate = val[1]
    },
    handleChange () {},
    onChange (row, column, cell, event) {
      trackApi.getPrizeluck({ actId: row.actId, beginDate: this.region.beginDate, endDate: this.region.endDate }).then(res => {
        this.dialogStatus = row.name
        this.dialogList = res.value
        this.dialogFormVisible = true
      })
    },
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
      this.loading = true
      trackApi.getScanluck(this.region).then(res => {
        this.dataList = res.value
        this.loading = false
      })
    },
    // 赋值活动链接
    handleCopyActUrl (row) {
      let url = `${location.protocol}//${location.hostname}` +
        `/service/activity/act/access/redirect?noAuth=1` +
        `&actId=${row.id}`
      if (row.location) {
        url += '&location=1'
      }
      this.$copyText(url).then(() => {
        this.$message.success('复制活动链接成功！')
      }, () => {
        this.$message.fail('复制活动链接失败！')
      })
    },
    // 下载excel文件
    handleExcelDownload () {
      // 表头信息
      let columns = [
        { prop: 'id', title: 'ID', width: '100' },
        { prop: 'name', title: '活动名称', width: '300' },
        { prop: 'beginTime', title: '活动开始时间', width: '150' },
        { prop: 'endTime', title: '活动结束时间', width: '150' },
        { prop: 'whether', title: '活动是否正在开展', width: '150' },
        { prop: 'tobaname', title: '卷烟规格', width: '300' },
        { prop: 'drawCnt', title: '抽奖次数', width: '80' },
        { prop: 'prizeCnt', title: '中奖次数', width: '80' }
      ]
      const ExportTable = new ExportPlus({
        title: '扫码抽奖活动开展情况',
        describe: ''
      })
      ExportTable.json_xlsx(this.dataList, columns, {
        cellFormat: this.cellFormatCheckType,
        cellStyle: this.cellStyle
      })
    }
  }
}
</script>

<style>
.li{
  line-height: 1.6em;
  font-size: 1.15em;
}
.cascader_districtCode{
  width: 100%;
  max-height: 15vh;
  overflow-y: auto;
}
</style>
