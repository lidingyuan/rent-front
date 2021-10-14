<template>
<!-- 问卷调查活动开展情况查询-->
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
      <el-form-item label="活动名称:">
        <el-select size="small" v-model="region.actId" placeholder="请选择活动" style="width: 230px">
          <el-option v-for="(item) in actList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :disabled="disableButton">查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-download" @click="handleExcelDownload" :disabled="disableButton">导出</el-button>
      </el-form-item>
    </el-form>
    <table-wrapper :filterable="false" :excel="true" height="510px">
      <!-- 标题 -->
      <div slot="title">问卷调查活动开展情况</div>
      <!-- 列表 -->
      <el-table
      v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="dataList" size="small" height="100%" border stripe ref="table">
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="actId" width="180" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" width="300" label="活动名称" show-overflow-tooltip >
          <template slot-scope="scope">
            <i class="el-icon-document-copy" style="color:#409eff;margin-right:5px;" @click="handleCopyActUrl(scope.row)"></i>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column prop="provName" width="150" label="地区"></el-table-column>
        <el-table-column prop="winCnt" width="150" label="参与答题人数"></el-table-column>
        <el-table-column prop="drawCnt" width="150" label="参与抽奖人数"></el-table-column>
        <el-table-column prop="status" width="150" label="中奖次数"></el-table-column>
        <el-table-column prop="rate" width="150" label="中奖率">
          <template slot-scope="scope">
            <span>{{scope.row.rate.toFixed(2)}}</span>
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
  </div>
</template>

<script>
import DatePicke from '../ActScanluck/components/DataPicker'
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
        actId: ''
      },
      loading: false,
      actList: []
    }
  },
  created () {
    this.getProvince()
    this.getActList()
    this.handleSearch()
  },
  watch: {

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
    },
    // 时间
    changeDate (val) {
      this.region.beginDate = val[0]
      this.region.endDate = val[1]
    },
    getActList () {
      if (this.exCheckDate3.length > 0) {
        this.region.beginDate = this.exCheckDate3[0]
        this.region.endDate = this.exCheckDate3[1]
      }
      let option = { beginDate: '2020-01-01', endDate: '2021-03-22', provCode: '', cityCode: '', countyCode: '', type: 0 }
      trackApi.actList(option).then(res => {
        this.actList = res.value
      })
    },
    handleChange () {},
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
      if (this.exCheckDate3.length > 0) {
        this.region.beginDate = this.exCheckDate3[0]
        this.region.endDate = this.exCheckDate3[1]
      }
      trackApi.paperList(this.region).then(res => {
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
        { prop: 'actId', title: 'ID', width: '200' },
        { prop: 'name', title: '活动名称', width: '300' },
        { prop: 'provName', title: '地区', width: '150' },
        { prop: 'winCnt', title: '参与答题人数', width: '150' },
        { prop: 'drawCnt', title: '参与抽奖人数', width: '150' },
        { prop: 'status', title: '中奖次数', width: '200' },
        { prop: 'rate', title: '中奖率', width: '200' }
      ]
      const ExportTable = new ExportPlus({
        title: '问卷调查活动开展情况',
        describe: ''
      })
      ExportTable.json_xlsx(this.dataList, columns, {
        cellFormat: this.cellFormatCheckType,
        cellStyle: this.cellStyle
      })
      // })
    }
  }
}
</script>

<style lang="scss" scope>
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
