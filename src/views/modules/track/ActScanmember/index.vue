<template>
<!-- 扫码抽奖活动会员参与情况 -->
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
        <!-- <date-picke v-model="exCheckDate3" @changeDate="changeDate($event)" style="width: 330px"></date-picke> -->
      </el-form-item>
      <el-form-item label="省份:">
        <el-select size="small" v-model="region.provCode" placeholder="请选择省份" clearable style="width: 130px" @change="provChange">
          <el-option v-for="item in provinceList"
            :key="item.provCode"
            :label="item.provName"
            :value="item.provCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地市:">
        <el-select size="small" v-model="region.cityCode" placeholder="请选择地市" clearable style="width: 130px" @change="cityChange">
          <el-option v-for="item in cityList"
            :key="item.cityCode"
            :label="item.cityName"
            :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区县:">
        <el-select size="small" v-model="region.countyCode" clearable placeholder="请选择区县" style="width: 130px" @change="countyChange">
          <el-option v-for="item in countyList"
            :key="item.countyCode"
            :label="item.countyName"
            :value="item.countyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称:">
        <el-select size="small" v-model="region.actId" placeholder="请选择活动" style="width: 130px" clearable @change="actChange">
          <el-option v-for="(item) in actList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="奖项:">
        <el-select size="small" v-model="region.awardsId" placeholder="请选择奖项" style="width: 130px" clearable>
          <el-option v-for="(item) in awardsList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色:">
        <el-select size="small" v-model="region.role" placeholder="请选择角色" style="width: 130px" >
          <el-option label="消费者" value="02"></el-option>
          <el-option label="零售户" value="01"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码:">
        <el-input type="number" clearable v-model="region.phone" placeholder="请输入手机号" oninput="if(value.length>11)value=value.slice(0,11)" style="width: 127px" @blur="phoneCheck"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :disabled="disableButton">查询</el-button>
        <el-button size="small" type="primary" icon="el-icon-download" @click="handleExcelDownload" :disabled="disableButton">导出</el-button>
      </el-form-item>
    </el-form>
    <table-wrapper :filterable="false" :excel="true" height="510px">
      <!-- 标题 -->
      <div slot="title">扫码抽奖活动会员参与情况</div>
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
        <el-table-column prop="actName" width="250" label="活动名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="tobaName" width="250" label="卷烟规格" align="center"></el-table-column>
        <el-table-column prop="prizeId" width="180" label="奖项ID" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="prizeName" width="180" label="奖项名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="nickname" width="180" label="用户昵称" align="center"></el-table-column>
        <el-table-column prop="phone" width="100" label="手机号码" align="center"></el-table-column>
        <el-table-column prop="prizeNum" width="100" label="中奖次数" show-overflow-tooltip align="center"></el-table-column>
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
      awardsList: [],
      disableButton: false,
      exCheckDate3: [ '2020-01-01', '2021-03-15' ],
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
        endDate: '2021-03-15',
        provCode: '',
        cityCode: '',
        countyCode: '',
        tobaId: '',
        phone: '',
        awardsId: '',
        role: '02'
      }
    }
  },
  created () {
    this.getProvince()
    this.getActList()
    // this.handleSearch()
  },
  methods: {
    provChange (val) {
      this.region.cityCode = ''
      this.region.countyCode = ''
      this.region.actId = ''
      this.region.awardsId = ''
      this.cityList = []
      this.countyList = []
      this.actList = []
      this.awardsList = []
      trackApi.cityList().then(res => {
        this.cityList = res.data.filter(item => item.provCode === val)
      })
      this.getActList()
    },
    phoneCheck () {
      let isPhone = /^(?:(?:\+|00)86)?1\d{10}$/
      if (this.region.phone !== '' && !isPhone.test(this.region.phone)) {
        this.$message.error('请输入正确的手机号！')
      }
    },
    cityChange (val) {
      this.region.countyCode = ''
      this.region.actId = ''
      this.region.awardsId = ''
      this.countyList = []
      this.actList = []
      this.awardsList = []
      trackApi.countyList().then(res => {
        this.countyList = res.data.filter(item => item.cityCode === val)
      })
      this.getActList()
    },
    countyChange () {
      this.region.actId = ''
      this.actList = []
      this.getActList()
    },
    actChange (val) {
      this.region.awardsId = ''
      this.awardsList = []
      trackApi.awardsList({ actId: val }).then(res => {
        this.awardsList = res.value
      })
    },
    getProvince () {
      trackApi.provList().then(res => {
        this.provinceList = res.data
      })
    },
    getActList () {
      let option = { beginDate: this.region.beginDate, endDate: this.region.endDate, provCode: this.region.provCode, cityCode: this.region.cityCode, countyCode: this.region.countyCode, type: 1 }
      trackApi.actList(option).then(res => {
        this.actList = res.value
      })
    },
    // 时间
    changeDate (val) {
      this.region.actId = ''
      this.actList = []
      this.region.awardsId = ''
      this.awardsList = []
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
    // 翻页
    handleCurrentChange (current) {
      this.page.current = current
      this.$table.scrollTopAfterPage(this.$refs.table)
      this.doSearch()
    },
    doSearch () {
      let isPhone = /^(?:(?:\+|00)86)?1\d{10}$/
      if (this.region.phone === '' && this.region.actId === '') {
        this.$message.error('请选择活动或输入手机号!')
        return
      } else {
        if (this.region.phone !== '' && !isPhone.test(this.region.phone)) {
          this.$message.error('请输入正确的手机号！')
          return
        }
      }
      this.loading = true
      let options = { beginDate: this.region.beginDate, endDate: this.region.endDate, actId: this.region.actId, phone: this.region.phone, prizeId: this.region.awardsId, role: this.region.role, ...this.page, total: 0 }
      trackApi.getScanMemberList(options).then(res => {
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
        { prop: 'actName', title: '活动名称', width: '100' },
        { prop: 'tobaName', title: '卷烟规格', width: '200' },
        { prop: 'prizeId', title: '奖项ID', width: '100' },
        { prop: 'prizeName', title: '奖项名称', width: '100' },
        { prop: 'nickname', title: '用户昵称', width: '100' },
        { prop: 'phone', title: '手机号码', width: '100' },
        { prop: 'prizeNum', title: '中奖次数', width: '100' }
      ]
      const ExportTable = new ExportPlus({
        title: '扫码抽奖活动会员参与情况',
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
