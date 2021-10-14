<template>
<!-- 推荐激励活动开展情况 -->
  <div>
    <!-- 查询表单 -->
    <el-form ref="queryForm" :inline="true" :inline-message="true" size="small" style="background:#FFFFF">
      <el-form-item label="查询时间:">
        <el-date-picker
          v-model="exCheckDate3"
          :clearable=false
          type="daterange"
          @change="changeDate"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="省份：">
        <el-select size="small" v-model="region.provCode" placeholder="请选择省份" clearable style="width: 130px" @change="provChange">
          <el-option v-for="item in provinceList"
            :key="item.provCode"
            :label="item.provName"
            :value="item.provCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地市：">
        <el-select size="small" v-model="region.cityCode" placeholder="请选择地市" clearable style="width: 130px" @change="cityChange">
          <el-option v-for="item in cityList"
            :key="item.cityCode"
            :label="item.cityName"
            :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区县：">
        <el-select size="small" v-model="region.countyCode" clearable placeholder="请选择区县" style="width: 130px">
          <el-option v-for="item in countyList"
            :key="item.countyCode"
            :label="item.countyName"
            :value="item.countyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动是否在展开:">
        <el-select size="small" v-model="region.whether" style="width: 130px" clearable @change="actChange">
          <el-option label="否" value="0"></el-option>
          <el-option label="是" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称:">
        <el-select size="small" v-model="region.actId" placeholder="请选择活动" style="width: 130px" clearable>
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
      <div slot="title">推荐激励活动开展情况</div>
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
        <el-table-column prop="areaName" width="80" label="市场" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="beginTime" width="135" label="活动开始时间" align="center"></el-table-column>
        <el-table-column prop="endTime" width="135" label="活动结束时间" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="whether" width="80" label="活动是否正在开展" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="retailerCnt" width="100" label="会员户数" align="center"></el-table-column>
        <el-table-column prop="actRetailerCnt" width="100" label="参与活动户数" align="center"></el-table-column>
        <el-table-column prop="actNewRetailerCnt" width="100" label="发展新消费者会员户数" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="followCnt" width="100" label="消费者会员关注总数" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="legacyCnt" width="100" label="已有会员" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="memberNewCnt" width="100" label="新会员" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="scanCnt" width="100" label="推荐消费者扫码量" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="totalPoint" width="100" label="累计获得积分" show-overflow-tooltip align="center"></el-table-column>
      </el-table>
    </table-wrapper>
  </div>
</template>

<script>
import TableWrapper from '@/components/TableWrapper'
import * as trackApi from '@/api/track/trackApi.js'
import ExportPlus from 'export-table'

export default {
  name: 'ActScanmember',
  components: {
    TableWrapper
  },
  data () {
    return {
      loading: false,
      countyList: [],
      cityList: [],
      actList: [],
      actItem: {},
      awardsList: [],
      disableButton: false,
      exCheckDate3: [ '2020-01-01', '2022-01-01' ],
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
        actId: '',
        beginDate: '2020-01-01',
        endDate: '2022-01-01',
        provCode: '',
        cityCode: '',
        countyCode: '',
        whether: ''
      }
    }
  },
  created () {
    this.getProvince()
    this.getActList()
  },
  methods: {
    provChange (val) {
      this.region.cityCode = ''
      this.region.countyCode = ''
      this.region.actId = ''
      this.cityList = []
      this.countyList = []
      this.actList = []
      trackApi.cityList().then(res => {
        this.cityList = res.data.filter(item => item.provCode === val)
        if (this.cityList.length > 0) {
          this.cityList.unshift({ cityCode: '000000', cityName: '全部地市', id: '000000000000000000000', provCode: val, provName: '' })
        }
      })
      this.getActList()
    },
    cityChange (val) {
      this.region.countyCode = ''
      this.region.actId = ''
      this.countyList = []
      this.actList = []
      trackApi.countyList().then(res => {
        this.countyList = res.data.filter(item => item.cityCode === val)
        if (this.countyList.length > 0) {
          this.countyList.unshift({ countyCode: '111111', countyName: '全部区县', id: '0000000000000000000000', cityCode: val, cityName: '' })
        }
      })
      this.getActList()
    },
    getProvince () {
      trackApi.provList().then(res => {
        this.provinceList = res.data
      })
    },
    getActList () {
      let option = { beginDate: this.region.beginDate, endDate: this.region.endDate, provCode: this.region.provCode, cityCode: this.region.cityCode, countyCode: this.region.countyCode, whether: this.region.whether }
      trackApi.getTuikeActList(option).then(res => {
        this.actList = res.value
      })
    },
    // 时间
    changeDate (val) {
      this.region.actId = ''
      this.actList = []
      this.region.beginDate = val[0]
      this.region.endDate = val[1]
      this.getActList()
      this.exCheckDate3 = val
    },
    // ---查询列表
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    // 活动是否正在开展
    actChange (val) {
      this.region.whether = val
      this.actList = []
      this.region.actId = ''
      this.getActList()
    },
    doSearch () {
      if (this.region.actId === '') {
        this.$message.error('请选择活动信息')
        return
      }
      this.loading = true
      let options = { ...this.region }
      trackApi.getTuikeData(options).then(res => {
        this.actItem = this.actList
        this.actItem = this.actItem.filter(item => item.id === this.region.actId)
        let actItem = JSON.parse(JSON.stringify(this.actItem))
        this.dataList = res.value.filter(item => item.areaCode !== '')
        let dataList = []
        this.dataList.forEach(item => {
          let beginTime = actItem[0].beginTime
          let endTime = actItem[0].endTime
          let whether = actItem[0].whether
          dataList.push({
            'areaName': item.areaName,
            'beginTime': beginTime,
            'endTime': endTime,
            'whether': whether,
            'retailerCnt': item.retailerCnt,
            'actRetailerCnt': item.actRetailerCnt,
            'actNewRetailerCnt': item.actNewRetailerCnt,
            'followCnt': item.followCnt,
            'legacyCnt': item.legacyCnt,
            'memberNewCnt': item.memberNewCnt,
            'scanCnt': item.scanCnt,
            'totalPoint': item.totalPoint
          })
        })
        this.dataList = dataList
        this.loading = false
      })
    },
    // ---管理素材
    // 下载excel文件
    handleExcelDownload () {
      // 表头信息
      let columns = [
        { prop: 'areaName', title: '市场', width: '80' },
        { prop: 'beginTime', title: '活动开始时间', width: '135' },
        { prop: 'endTime', title: '活动结束时间', width: '135' },
        { prop: 'whether', title: '活动是否正在开展', width: '80' },
        { prop: 'retailerCnt', title: '会员户数', width: '100' },
        { prop: 'actRetailerCnt', title: '参与活动户数', width: '100' },
        { prop: 'actNewRetailerCnt', title: '发展新消费者会员户数', width: '100' },
        { prop: 'followCnt', title: '消费者会员关注总数', width: '100' },
        { prop: 'legacyCnt', title: '已有会员', width: '100' },
        { prop: 'memberNewCnt', title: '新会员', width: '100' },
        { prop: 'scanCnt', title: '推荐消费者扫码量', width: '100' },
        { prop: 'totalPoint', title: '累计获得积分', width: '100' }
      ]
      const ExportTable = new ExportPlus({
        title: '推荐激励活动开展情况',
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
