<template>
<!-- 扫码集盒活动开展情况 -->
  <div>
    <!-- 查询表单 -->
    <el-form ref="queryForm" :inline="true" :inline-message="true" size="small" style="background:#FFFFF">
      <el-form-item label="查询时间:">
        <el-date-picker
          v-model="exCheckDate3"
          type="daterange"
          @change="changeDate"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <!-- <date-picke v-model="exCheckDate3" @changeDate="changeDate($event)" style="width: 330px"></date-picke> -->
      </el-form-item>
      <el-form-item label="省份:">
        <el-select size="small" v-model="region.provCode" placeholder="请选择省份" clearable style="width: 130px" @change="provChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in provinceList"
            :key="item.provCode"
            :label="item.provName"
            :value="item.provCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地市:">
        <el-select size="small" v-model="region.cityCode" placeholder="请选择地市" clearable style="width: 130px" @change="cityChange">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in cityList"
            :key="item.cityCode"
            :label="item.cityName"
            :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区县:">
        <el-select size="small" v-model="region.countyCode" clearable placeholder="请选择区县" style="width: 130px">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in countyList"
            :key="item.countyCode"
            :label="item.countyName"
            :value="item.countyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卷烟规格:">
        <el-select size="small" v-model="region.tobaId" placeholder="请选择卷烟" style="width: 130px" clearable>
          <el-option v-for="(item) in SpecificationsList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动是否在展开:">
        <el-select size="small" v-model="region.whether" style="width: 130px">
          <el-option label="否" value="0"></el-option>
          <el-option label="是" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :disabled="disableButton">查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-download" @click="handleExcelDownload" :disabled="disableButton">导出</el-button>
      </el-form-item>
    </el-form>
    <table-wrapper :filterable="false" :excel="true" height="510px">
      <!-- 标题 -->
      <div slot="title">扫码集盒活动开展情况</div>
      <!-- 列表 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="dataList"
        size="small"
        height="100%"
        border stripe
        ref="table">
        <el-table-column type="index" :index="page | listIndexFilter" width="60" align="center"></el-table-column>
        <el-table-column prop="ruleId" width="150" label="ID" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="collectName" width="200" label="活动名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="beginTime" width="150" label="活动开始时间" align="center"></el-table-column>
        <el-table-column prop="endTime" width="150" label="活动结束时间" align="center"></el-table-column>
        <el-table-column prop="whether" width="150" label="活动是否正在开展" align="center"></el-table-column>
        <el-table-column prop="tobaName" width="120" label="卷烟规格" align="center"></el-table-column>
        <el-table-column prop="type" width="80" label="条盒/小盒" align="center"></el-table-column>
        <el-table-column prop="allNum" width="80" label="扫码次数" align="center"></el-table-column>
        <el-table-column prop="rewardNum" width="150" label="集盒集够人次" align="center"></el-table-column>
        <el-table-column prop="allPoint" width="200" label="集盒集够所获泰山币" show-overflow-tooltip align="center"></el-table-column>
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
// import * as ActConfigApi from '@/api/activityInfo/ActConfigApi.js'
import TableWrapper from '@/components/TableWrapper'
import * as trackApi from '@/api/track/trackApi.js'
import ExportPlus from 'export-table'

export default {
  name: 'ActScanbox',
  components: {
    TableWrapper
  },
  data () {
    return {
      loading: false,
      countyList: [],
      cityList: [],
      SpecificationsList: [],
      disableButton: false,
      exCheckDate3: [ '2020-05-01', '2021-01-01' ],
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
      provinceList: [],
      region: {
        beginDate: '2020-05-01',
        endDate: '2020-12-01',
        provCode: '',
        cityCode: '',
        countyCode: '',
        whether: '0',
        tobaId: ''
      }
    }
  },
  created () {
    this.getProvinceAndTobacco()
    this.handleSearch()
  },
  methods: {
    provChange (val) {
      this.region.cityCode = ''
      this.region.countyCode = ''
      this.cityList = []
      this.countyList = []
      trackApi.cityList().then(res => {
        this.cityList = res.data.filter(item => item.provCode === val)
      })
    },
    cityChange (val) {
      this.region.countyCode = ''
      this.countyList = []
      trackApi.countyList().then(res => {
        this.countyList = res.data.filter(item => item.cityCode === val)
      })
    },
    getProvinceAndTobacco () {
      trackApi.provList().then(res => {
        this.provinceList = res.data
      })
      trackApi.tobaccoList().then(res => {
        let tempArray = []
        res.data.forEach(item => {
          let temp = {
            id: item.id,
            name: item.name + '(' + item.remarks.slice(0, 1) + '盒)'
          }
          tempArray.push(temp)
        })
        this.SpecificationsList = tempArray
      })
    },
    // 时间
    changeDate (val) {
      this.region.beginDate = val[0]
      this.region.endDate = val[1]
      this.exCheckDate3 = val
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
      let options = { ...this.page, ...this.region, 'total': 0 }
      trackApi.getScanbox(options).then(res => {
        this.$objects.copyProperties(res.value, this.page)
        this.dataList = res.value.record
        this.loading = false
      })
    },
    // ---管理素材
    // 下载excel文件
    handleExcelDownload () {
      // 表头信息
      let columns = [
        { prop: 'ruleId', title: 'ID', width: '150' },
        { prop: 'collectName', title: '活动名称', width: '200' },
        { prop: 'beginTime', title: '活动开始时间', width: '150' },
        { prop: 'endTime', title: '活动结束时间', width: '100' },
        { prop: 'whether', title: '活动是否正在开展', width: '150' },
        { prop: 'tobaName', title: '卷烟规格', width: '120' },
        { prop: 'type', title: '条盒/小盒', width: '80' },
        { prop: 'allNum', title: '扫码次数', width: '80' },
        { prop: 'rewardNum', title: '集盒集够人次', width: '150' },
        { prop: 'point', title: '集盒集够所获泰山币', width: '200' }
      ]
      const ExportTable = new ExportPlus({
        title: '扫码集盒活动开展情况',
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
