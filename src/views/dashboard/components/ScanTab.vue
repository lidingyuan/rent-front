<template>
  <div class="scan-tab">
    <!-- 扫码数据 -->
    <div class="main">
      <!-- 扫码趋势图 -->
      <div>
        <el-row class="search-box">
          <div class="module-name">最近12个月扫码趋势</div>
        </el-row>
        <el-row v-if="scanEchart.xAxis.data.length > 0">
          <el-col :span="24" style="height: 260px">
            <v-chart :options="scanEchart" :auto-resize="true" style="width:100%;height:100%"></v-chart>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="24" style="height:260px;line-height:260px;text-align:center;">
            暂无数据
          </el-col>
        </el-row>
      </div>

      <!-- 按省 -->
      <div>
        <el-row class="search-box">
          <div class="module-name">全部省份扫码数据</div>
          <el-date-picker size="medium" v-model="searchByProv.time" type="daterange" value-format="yyyyMMdd" range-separator="-" style="width: 350px"
            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
          <el-button @click="handleQueryByProv"  size="medium" type="primary" icon="el-icon-search" style="margin-left:20px">查询</el-button>
          <el-button @click="handleExportSingleExcel(tableByProv, 'tableByProv', canClickExcelBtnByProv)" :disabled="!canClickExcelBtnByProv" size="medium" type="success" icon="el-icon-download" style="margin-left:20px">
            {{canClickExcelBtnByProv ? '导出表格' : '正在导出'}}
          </el-button>
        </el-row>
        <el-row style="margin-top:15px">
          <el-col :span="24" style="height:500px;">
            <el-table size="small" :data="tableDataByProv" ref="tableByProv" height="100%" border style="width:100%">
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column label="省份" prop="provCode" :formatter="formatProv"></el-table-column>
              <el-table-column label="二维码数" prop="numbers" sortable ></el-table-column>
              <el-table-column label="扫码数" prop="times" sortable></el-table-column>
              <el-table-column label="扫码率" prop="percent" sortable></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <!-- 按市 -->
      <div>
        <el-row class="search-box">
          <div class="module-name">单一省份下各地市扫码数据</div>
          <el-date-picker size="medium" v-model="searchByCity.time" type="daterange" value-format="yyyyMMdd" range-separator="-" style="width: 350px"
            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
          <el-select v-model="searchByCity.provCode" size="medium" placeholder="请选择省份" style="width:200px;margin-left:20px">
            <el-option v-for="(prov) in provList" :key="prov.provCode" :value="prov.provCode" :label="prov.provName"></el-option>
          </el-select>
          <el-button @click="handleQueryByCity"  size="medium" type="primary" icon="el-icon-search" style="margin-left:20px">查询</el-button>
          <el-button @click="handleExportSingleExcel(tableByCity, 'tableByCity', 'canClickExcelBtnByCity')" :disabled="!canClickExcelBtnByCity" size="medium" type="success" icon="el-icon-download" style="margin-left:20px">
            {{canClickExcelBtnByCity ? '导出' : '正在导出'}}
          </el-button>
        </el-row>
        <el-row >
          <el-col :span="24" style="height:500px">
            <el-table size="small" :data="tableDataByCity" ref="tableByCity" height="100%" border style="width:100%">
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column label="地市" prop="cityCode" :formatter="formatCity" ></el-table-column>
              <el-table-column label="二维码数" prop="numbers" sortable></el-table-column>
              <el-table-column label="扫码数" prop="times" sortable></el-table-column>
              <el-table-column label="扫码率" prop="percent" sortable></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>

      <!-- 按卷烟 -->
      <div>
        <el-row class="search-box">
          <div class="module-name">各款卷烟扫码数据</div>
          <el-date-picker size="medium" v-model="searchByToba.time" type="daterange" value-format="yyyyMMdd" range-separator="-" style="width: 350px"
            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
          <el-button @click="handleQueryByToba" size="medium" type="primary" icon="el-icon-search" style="margin-left:20px">查询</el-button>
          <el-button @click="handleExportSingleExcel(tableByToba, 'tableByToba', 'canClickExcelBtnByToba')" :disabled="!canClickExcelBtnByToba" size="medium" type="success" icon="el-icon-download" style="margin-left:20px">
            {{canClickExcelBtnByToba ? '导出' : '正在导出'}}
          </el-button>
        </el-row>
        <el-row>
          <el-col :span="24" style="height:600px">
            <el-table size="small" :data="tableDataByToba" ref="tableByToba" height="100%" border style="width:100%">
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column label="卷烟" prop="tobaId">
                <template slot-scope="scope">
                  {{ scope.row.tobaId | tobaType(tobaList)}}
                </template>
              </el-table-column>
              <el-table-column label="二维码数" prop="numbers" sortable></el-table-column>
              <el-table-column label="扫码数" prop="times" sortable></el-table-column>
              <el-table-column label="扫码率" prop="percent" sortable></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import * as ActDistrictApi from '@/api/baseInfo/ActDistrictApi.js'
import * as ActTobaApi from '@/api/baseInfo/ActTobaccoApi.js'
import * as ScanApi from '@/api/scan/ScanApi.js'
import SimpleDateFormatter from '@/utils/SimpleDateFormatter'
import ExportPlus from 'export-table'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/axis'
import 'echarts/lib/component/tooltip'

export default {
  name: 'dashboard',
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      // 查询条件
      // 卷烟
      tobaList: [],
      // 省份
      provList: [],
      // 全部城市
      cityList: [],
      // 某省份下的全部城市
      cityListByProv: [],
      searchByProv: {
        time: []
      },
      searchByCity: {
        time: [],
        provCode: '110000',
        provName: ''
      },
      searchByToba: {
        time: []
      },
      // ---表格数据
      tableDataByProv: [],
      tableDataByCity: [],
      tableDataByToba: [],
      // 扫码趋势图
      scanEchart: {},
      // 表格导出按钮，防重复点击
      canClickExcelBtnByProv: true,
      canClickExcelBtnByCity: true,
      canClickExcelBtnByToba: true
    }
  },
  created () {
    // ---查询条件
    this.initSearchCondition()
    this.initEchart()
    // 查询数据
    this.handleQueryByProv()
    this.handleQueryByCity()
    this.handleQueryByToba()
    // 图表数据查询
    this.drawEchart()
  },
  methods: {
    // 初始化查询条件
    initSearchCondition () {
      // 1.时间：格式20200501
      const endDateStr = (SimpleDateFormatter((new Date()).getTime())).substring(0, 10).replace(/-/g, '')
      const beginDateStr = (SimpleDateFormatter((new Date()).getTime() - 3600 * 1000 * 24 * 30)).substring(0, 10).replace(/-/g, '')

      this.searchByProv.time.push(beginDateStr)
      this.searchByProv.time.push(endDateStr)

      this.searchByCity.time.push(beginDateStr)
      this.searchByCity.time.push(endDateStr)

      this.searchByToba.time.push(beginDateStr)
      this.searchByToba.time.push(endDateStr)

      // 2.卷烟
      if (sessionStorage.getItem('tobaList')) {
        this.tobaList = JSON.parse(sessionStorage.getItem('tobaList'))
      } else {
        ActTobaApi.list().then(res => {
          this.tobaList = res.data
          sessionStorage.setItem('tobaList', JSON.stringify(res.data))
        })
      }

      // 3.省份
      if (sessionStorage.getItem('provList')) {
        this.provList = JSON.parse(sessionStorage.getItem('provList'))
      } else {
        ActDistrictApi.provList().then(res => {
          this.provList = res.data
          sessionStorage.setItem('provList', JSON.stringify(res.data))
        })
      }

      // 4.地市
      if (sessionStorage.getItem('cityList')) {
        this.districtOptions = JSON.parse(sessionStorage.getItem('cityList'))
      } else {
        ActDistrictApi.listAll().then(res => {
          this.cityList = res.data
          sessionStorage.setItem('cityList', JSON.stringify(res.data))
        })
      }
    },
    initEchart (xAxisData = [], data1 = [], data2 = []) {
      this.scanEchart = {
        title: {
          text: '最近12个月扫码数据统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '10',
          data: ['二维码数量', '扫码次数']
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '二维码数量',
            type: 'line',
            stack: '总量',
            data: data1
          },
          {
            name: '扫码次数',
            type: 'line',
            stack: '总量',
            data: data2
          }
        ]
      }
    },
    // ---查询
    // 全部省份扫码数据
    handleQueryByProv () {
      let options = {
        beginDate: parseInt(this.searchByProv.time[0]),
        endDate: parseInt(this.searchByProv.time[1])
      }
      ScanApi.listByProv(options).then(res => {
        this.tableDataByProv = res.data
        // 增加扫码率
        res.data.forEach((item, index) => {
          const percent = (item.numbers / item.times * 100).toFixed(3)
          this.tableDataByProv[index]['percent'] = percent + '%'
        })
      })
    },
    // 某个省份下的扫码数据
    handleQueryByCity () {
      // 过滤当前省份下的城市
      this.cityListByProv = this.cityList.filter(item => item.provCode === this.searchByCity.provCode)
      let options = {
        beginDate: parseInt(this.searchByCity.time[0]),
        endDate: parseInt(this.searchByCity.time[1]),
        provCode: this.searchByCity.provCode
      }
      ScanApi.listByCity(options).then(res => {
        this.tableDataByCity = res.data
        // 增加扫码率
        res.data.forEach((item, index) => {
          const percent = (item.numbers / item.times * 100).toFixed(3)
          this.tableDataByCity[index]['percent'] = percent + '%'
        })
      })
    },
    // 按卷烟查询扫码数据
    handleQueryByToba () {
      let options = {
        beginDate: parseInt(this.searchByCity.time[0]),
        endDate: parseInt(this.searchByCity.time[1])
      }
      ScanApi.listByToba(options).then(res => {
        this.tableDataByToba = res.data
        // 增加扫码率
        res.data.forEach((item, index) => {
          const percent = (item.numbers / item.times * 100).toFixed(3)
          this.tableDataByToba[index]['percent'] = percent + '%'
        })
      })
    },
    // 扫码图表
    drawEchart () {
      ScanApi.trend().then(res => {
        let xAxisData = []
        let seriesDataByNum = []
        let seriesDataByTimes = []
        res.data.forEach(item => {
          xAxisData.push(item.month)
          seriesDataByNum.push(item.numbers)
          seriesDataByTimes.push(item.times)
        })

        this.initEchart(xAxisData, seriesDataByNum, seriesDataByTimes)
      })
    },
    // ---表格数据格式化输出
    // 格式化省份
    formatProv (row) {
      let value = row.provCode
      let prov = this.provList.find(item => item.provCode === value)
      let name = prov ? prov.provName : value
      return name
    },
    // 格式化城市
    formatCity (row) {
      let value = row.cityCode
      let city = this.cityListByProv.find(item => item.cityCode === value)
      let name = city ? city.cityName : value
      return name
    },
    // ---表格导出
    // 单个表格数据导出。参数：tableData-表格数据， elTable-表格ref值，btn-导出按钮label值
    handleExportSingleExcel (tableData, elTable, btn) {
      if (tableData.length === 0) {
        this.$message.info('当前待导出的表格无数据！')
        return
      }

      this[btn] = false
      setTimeout(() => {
        this[btn] = true
      }, 5000)

      // 1. 设置文件名称
      let fileName = ''
      if (elTable === 'tableByProv') {
        // 文件名样例：20200513至20200513各省份扫码数据
        let beginDate = this.searchByProv.time[0]
        let endDate = this.searchByProv.time[1]
        fileName = `${beginDate}至${endDate}各省份扫码数据`
      }
      if (elTable === 'tableByCity') {
        // 文件名样例：20200513至20200513各北京市各地市扫码数据
        let beginDate = this.searchByProv.time[0]
        let endDate = this.searchByProv.time[1]
        // 使用当前cityListByProv第一条数据的provName作为当前的查询的省份名称
        let provName = this.cityListByProv[0].provName ? this.cityListByProv[0].provName + '各地市' : '地市级'
        fileName = `${beginDate}至${endDate}${provName}扫码数据`
      }
      if (elTable === 'tableByToba') {
        // 文件名样例：20200513至20200513各卷烟扫码数据
        let beginDate = this.searchByToba.time[0]
        let endDate = this.searchByToba.time[1]
        fileName = `${beginDate}至${endDate}各卷烟扫码数据`
      }

      // 2. 导出表格数据(无操作按钮，直接将el-table数据导出)
      const ExportTable = new ExportPlus({ title: fileName, saveFileName: fileName })
      ExportTable.table_xlsx(this.$refs[elTable])
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-tab{
  position: relative;
  width: 100%;
  min-width: 900px;
  height: 100%;
  .title{
    position: absolute;
    top: 0;
    left: 0;
    height: 65px;
    overflow: auto hidden;
    white-space: nowrap;
    background: #ffffff;
  }
  .main{
    position: relative;
    width: 100%;
    height: calc(100vh - 275px - 2rem);
    // 模块div
    >div {
      margin-top:30px
    }
    .search-box{
      display: flex;
      height:75px;
      margin-bottom: 10px;
      align-items: center;
      background: rgba($color: #50bfff, $alpha: 0.2);
      border-radius: 4px;
      border-left: 5px solid #50bfff;
      .module-name{
        padding: 0 20px;
      }
    }
  }
  .row-style-retailer{
    background: #f0f9eb;
  }
}
.act-dialog{
  line-height: 40px;
  .phase-container{
    display: flex;
  }
  .arrow-right-svg{
    width: 20px;
    color: #F56C6C;
    margin: 0 15px
  }
}
</style>
