<template>
  <div class="lucky-tab">
    <div class="title">
      <el-date-picker size="medium" v-model="searchCondition.time" type="daterange" value-format="yyyy-MM-dd" range-separator="-" style="width: 350px"
        start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
      <el-button @click="handleQuery"  size="medium" type="primary" icon="el-icon-search" style="margin-left:20px">查询</el-button>
      <el-button @click="handleExportSingleExcel()" :disabled="!canClickExcelBtn" size="medium" type="success" icon="el-icon-download" style="margin-left:20px">
        {{canClickExcelBtn ? '导出' : '正在导出'}}
      </el-button>
    </div>

    <!-- 抽奖数据 -->
    <div class="main">
      <el-table size="small" :data="tableData" height="100%" border style="width:100%">
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column label="抽奖名称" prop="name"  width="380"></el-table-column>
        <el-table-column label="开始时间" prop="beginTime"></el-table-column>
        <el-table-column label="结束时间" prop="endTime"></el-table-column>
        <el-table-column label="状态" prop="status" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" plain @click="handleQueryDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出层信息 -->
    <el-dialog title="抽奖数据详情" :visible.sync="dialogVisible" :close-on-click-modal="false" width="768px">
      <!-- 抽奖 -->
      <div class="act-dialog">
        <el-row>
          <el-col :span="12">
            <div><label>抽奖名称：</label>{{luckyDetail.name}}</div>
            <div><label>开始时间：</label>{{luckyDetail.beginTime}}</div>
            <div><label>结束时间：</label>{{luckyDetail.endTime}}</div>
            <div><label>抽奖状态：</label>{{ luckyDetail.status | filterStatus(statusList) }}</div>
          </el-col>
          <el-col :span="12" style="height: 300px">
            <!-- 综合指标图 -->
            <v-chart :options="prizeEchart" :auto-resize="true" style="width:100%;height:100%"></v-chart>
            <div style="margin-top:-50px">
              <i class="el-icon-info">若某奖项未出现在图中，代表该奖项的中奖概率为0</i>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="luckyEchart.xAxis.data.length > 0">
          <el-col :span="24" style="height: 300px">
            <v-chart :options="luckyEchart" :auto-resize="true" style="width:100%;height:100%"></v-chart>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="24" style="height:100px;line-height:100px;text-align:center;">
            暂无参与数据
          </el-col>
        </el-row>
      </div>
      <!-- 关闭 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SimpleDateFormatter from '@/utils/SimpleDateFormatter'
import ExportPlus from 'export-table'
import * as ActPhaseApi from '@/api/activityInfo/ActPhaseApi.js'
import * as ActLuckyApi from '@/api/lucky/ActLuckyApi.js'
import * as ActLuckyPrizeApi from '@/api/lucky/ActLuckyPrizeApi.js'

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
      searchCondition: {
        time: [],
        status: 1
      },
      // ---表格数据
      tableData: [],
      // 状态
      statusList: [
        { value: 0, name: '草稿状态' },
        { value: 1, name: '生效' },
        { value: 2, name: '已终止' }
      ],
      // ---图表数据
      // 抽奖参与趋势图
      luckyEchart: {},
      prizeEchart: {},
      // 弹出层
      dialogVisible: false,
      // 抽奖详情
      luckyDetail: {},
      // 弹出层问题列表
      questionList: [],
      // 表格导出按钮，防重复点击
      canClickExcelBtn: true
    }
  },
  created () {
    this.initEchart()
    this.initPrizeEachart()
    // ---查询条件
    this.initSearchCondition()
    // ---列表数据查询
    this.handleQuery()
  },
  filters: {
    filterStatus (value, statusList) {
      let status = statusList[parseInt(value)]
      if (status) {
        return status.name
      }
      return ''
    }
  },
  methods: {
    // 初始化查询条件
    initSearchCondition () {
      // 1.时间
      const endDate = SimpleDateFormatter((new Date()).getTime())
      const startDate = SimpleDateFormatter((new Date()).getTime() - 3600 * 1000 * 24 * 30)
      this.searchCondition.time.push(startDate.substring(0, 10))
      this.searchCondition.time.push(endDate.substring(0, 10))
    },
    // 初始化图表
    initEchart (title = '抽奖参与趋势图', xAxisData = [], data1, data2) {
      this.luckyEchart = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '10',
          data: ['参与次数', '参与人数']
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
            name: '参与次数',
            type: 'line',
            stack: '总量',
            data: data1
          },
          {
            name: '参与人数',
            type: 'line',
            stack: '总量',
            data: data2
          }
        ]
      }
    },
    initPrizeEachart (title = '奖项配置', legendData = [], seriesData = []) {
      this.prizeEchart = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br>中奖概率：{c}'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 50,
          data: legendData
        },
        series: [
          {
            name: '奖项配置统计',
            type: 'pie',
            radius: ['0', '50%'],
            center: ['30%', '50%'],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            selectedMode: 'single',
            data: seriesData
          }
        ]
      }
    },
    // ---查询
    handleQuery () {
      let options = {
        beginDate: this.searchCondition.time[0],
        endDate: this.searchCondition.time[1]
      }
      ActLuckyApi.listByCondition(options).then(res => {
        this.tableData = res.data
      })
    },
    // 显示弹出层
    handleQueryDetail (row) {
      // 1. 奖项列表查询
      this.luckyDetail = Object.assign({}, row)
      const luckyPromise = new Promise((resolve, reject) => {
        ActLuckyPrizeApi.list(row.id).then(res => {
          resolve(res.data)
        })
      })

      // 2. 趋势数据查询
      const trendPromsie = new Promise((resolve, reject) => {
        ActPhaseApi.trend(row.id).then(res => {
          let xData = []
          let series = {
            numbers: [],
            times: []
          }
          res.data.forEach(item => {
            xData.push(item.recordDate)
            series.numbers.push(item.numbers)
            series.times.push(item.times)
          })
          this.initEchart(row.name + '抽奖参与趋势图', xData, series.times, series.numbers)
          resolve()
        })
      })

      // 3. 显示弹出层
      Promise.all([luckyPromise, trendPromsie]).then((res) => {
        this.luckyDetail['prizeList'] = res[1]
        this.drawPrizeEchart(res[0])
        this.dialogVisible = true
      })
    },
    // 绘制奖项配置图表
    drawPrizeEchart (prizeList) {
      let legendData = []
      let seriesData = []
      prizeList.forEach(item => {
        let name = item.name + (item.goodsName ? item.goodsName : '')
        legendData.push(name)
        seriesData.push({ value: item.chance, name: name })
      })
      this.initPrizeEachart(this.luckyDetail.name + '奖项配置', legendData, seriesData)
    },
    // ---表格格式化输出数据
    formatStatus (row) {
      return this.statusList[parseInt(row.status)].name || ''
    },
    // ---表格导出
    // 单个表格数据导出
    handleExportSingleExcel () {
      if (this.tableData.length === 0) {
        this.$message.info('当前待导出的表格无数据！')
        return
      }
      this.canClickExcelBtn = false
      setTimeout(() => {
        this.canClickExcelBtn = true
      }, 5000)

      // 1. 设置文件名称
      const startDate = this.searchCondition.time[0]
      const endDate = this.searchCondition.time[1]
      let fileName = `${startDate}至${endDate}抽奖数据`

      // 2. 设置表格样式，数据格式（status字段的处理）
      let actOptions = {
        cellStyle: ({ prop, value }) => {
          if (prop === 'name') {
            return { horizontalAlignment: 'left' }
          } else {
            return { horizontalAlignment: 'center' }
          }
        },
        cellFormat: ({ prop, value }) => {
          // 此处格式化数据输出，value为0输出为空，所以修改了源码
          if (prop === 'status') {
            return this.statusList[parseInt(value)].name
          }
          return value
        }
      }

      // 3. 设置导出列
      let tableColumns = this.getColumns()

      // 4. 导出表格数据
      const ExportTable = new ExportPlus({ title: fileName, saveFileName: fileName })
      ExportTable.json_xlsx(this.tableData, tableColumns, actOptions)
    },
    getColumns () {
      let colums = []
      colums = [
        { prop: 'name', title: '抽奖名称' },
        { prop: 'beginTime', title: '开始时间' },
        { prop: 'endTime', title: '结束时间' },
        { prop: 'status', title: '状态' }
      ]
      return colums
    }
  }
}
</script>

<style lang="scss" scoped>
.lucky-tab{
  position: relative;
  padding-top: 65px;
  width: 100%;
  min-width: 900px;
  height: 100%;
  overflow: hidden;
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
    height: calc(100vh - 235px - 2rem);
    background: #f00;
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
