<template>
  <div class="paper-tab">
    <div class="title">
      <el-date-picker size="medium" v-model="searchCondition.time" type="daterange" value-format="yyyy-MM-dd" range-separator="-" style="width: 350px"
        start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
      <el-button @click="handleQuery"  size="medium" type="primary" icon="el-icon-search" style="margin-left:20px">查询</el-button>
      <el-button @click="handleExportSingleExcel()" :disabled="!canClickExcelBtn" size="medium" type="success" icon="el-icon-download" style="margin-left:20px">
        {{canClickExcelBtn ? '导出' : '正在导出'}}
      </el-button>
    </div>

    <!-- 问卷数据 -->
    <div class="main">
      <el-table size="small" :data="tableData" height="100%" border style="width:100%">
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column label="问卷名称" prop="name" width="380"></el-table-column>
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
    <el-dialog title="问卷数据详情" :visible.sync="dialogVisible" :close-on-click-modal="false" width="768px">
      <!-- 问卷 -->
      <div class="act-dialog">
        <el-row>
          <el-col :span="14" style="point-events:none">
            <div><label>问卷名称：</label>{{paperDetail.name}}</div>
            <div><label>问卷有效期：</label>{{paperDetail.beginTime}} 至 {{paperDetail.endTime}}</div>
            <div><label>问卷状态：</label>{{ paperDetail.status | filterStatus(statusList) }}</div>
            <div><label>题目数量：</label>{{paperDetail.itemNum | filterQuestionCount(paperDetail.questionList)}}</div>
            <div><label>开放式填写：</label><el-switch disabled v-model="paperDetail.open" :active-value="1" inactive-value="0"></el-switch></div>
            <div><label>应用场景：</label>{{ paperDetail.scene | filterScene }}</div>
            <div><label>重复提交：</label><el-switch disabled v-model="paperDetail.rewritable" :active-value="1" inactive-value="0"></el-switch></div>
            <div><label>完整回答提交：</label><el-switch disabled v-model="paperDetail.completed" :active-value="1" inactive-value="0"></el-switch></div>
            <div><label>后端校验回答：</label><el-switch disabled v-model="paperDetail.verify" :active-value="1" inactive-value="0"></el-switch></div>
            <div style="color:#F56C6C"><label>问卷提交总次数：</label>{{paperDetail.answerTimes}}</div>
            <div style="color:#F56C6C"><label>问卷提交总人数：</label>{{paperDetail.answerNumbers}}</div>
          </el-col>
          <el-col :span="10">
            <div style="text-align:center;color:#409eff"><label>题目展示</label></div>
            <div>
              <el-carousel indicator-position="outside" :interval="0" height="500px">
                <el-carousel-item v-for="(item) in paperDetail.questionList" :key="item.id">
                  <div class="topic-block">
                    <img v-if="/^https?:\/\//.test(item.title)" :src="item.title">
                    <span v-else>{{item.title}} [{{item.type | filterQuestionType}}]</span>
                  </div>
                  <div class="topic-content" v-if="item.type !== '3'">
                    <div class="topic" v-for="(option) in item.options" :key="option.value">
                      <div class="topic-btn">
                        <span>{{ option.value }}. {{ option.name }}</span>
                        <input v-if="option.free" class="input-option" type="text" disabled>
                      </div>
                    </div>
                    </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="paperEchart.xAxis.data.length > 0">
          <el-col :span="24" style="height: 260px">
            <v-chart :options="paperEchart" :auto-resize="true" style="width:100%;height:100%"></v-chart>
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
import * as ActPaperApi from '@/api/paper/ActPaperApi.js'

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
      // 问卷参与趋势图
      paperEchart: {},
      // 弹出层
      dialogVisible: false,
      selectedQuestionValue: '',
      // 问卷详情
      paperDetail: {},
      // 弹出层问题列表
      questionList: [],
      // 表格导出按钮，防重复点击
      canClickExcelBtn: true
    }
  },
  created () {
    this.initEchart()
    // ---查询条件
    this.initSearchCondition()
    // ---列表数据查询
    this.handleQuery()
  },
  filters: {
    filterScene (value) {
      const sceneList = ['', '一次性问卷', '随机可重复回答问卷', '条件可重复回答问卷']
      return sceneList[parseInt(value)] || ''
    },
    filterStatus (value, statusList) {
      let status = statusList[parseInt(value)]
      if (status) {
        return status.name
      }
      return ''
    },
    filterQuestionType (value) {
      const questionType = ['', '单选', '多选', '问答']
      return questionType[parseInt(value)]
    },
    filterQuestionCount (value, questionList = 0) {
      return Math.max(parseInt(value), questionList.length)
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
    initEchart (title = '问卷参与趋势图', xAxisData = [], paperTimes = [], paperNumbers = [], answerTimes = [], answerNumbers = []) {
      this.paperEchart = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '10',
          data: ['参与次数', '参与人数', '提交次数', '提交人数']
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
            data: paperTimes
          },
          {
            name: '参与人数',
            type: 'line',
            stack: '总量',
            data: paperNumbers
          },
          {
            name: '提交次数',
            type: 'line',
            stack: '总量',
            data: answerTimes
          },
          {
            name: '提交人数',
            type: 'line',
            stack: '总量',
            data: answerNumbers
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
      ActPaperApi.listByCondition(options).then(res => {
        this.tableData = res.data
      })
    },
    // 显示弹出层
    handleQueryDetail (row) {
      // 1. 问卷详情
      const paperPromise = new Promise((resolve, reject) => {
        ActPaperApi.detail(row.id).then(res => {
          this.paperDetail = res.data
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
          resolve({ xData, times: series.times, numbers: series.numbers })
        })
      })

      // 3. 回答人数和人次查询
      const answerTrendPromise = new Promise((resolve, reject) => {
        ActPaperApi.answerStatisticsTrend(row.id).then(res => {
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
          resolve({ xData, times: series.times, numbers: series.numbers })
        })
      })

      // 4. 提交总人数，从次数
      const answerStatisticsPromise = new Promise((resolve, reject) => {
        ActPaperApi.answerStatistics(row.id).then(res => {
          resolve({ times: res.data.times, numbers: res.data.numbers })
        })
      })

      // 5. 显示弹出层
      Promise.all([paperPromise, trendPromsie, answerTrendPromise, answerStatisticsPromise]).then((res) => {
        const paper = res[0]

        // 选项转换（字符串转json）
        res[0].actPaperQuestionList.forEach((item, index) => {
          paper.actPaperQuestionList[index].options = JSON.parse(item.options)
        })

        // 根据paper的itemNum截取合适的题目数
        const questionList = paper.actPaperQuestionList
        if (paper.itemNum <= 0 || paper.itemNum > questionList.length) {
          this.paperDetail['questionList'] = questionList
        } else {
          this.paperDetail['questionList'] = questionList.slice(0, paper.itemNum)
        }

        // 处理回答的数据（以参与趋势的recordDate为横坐标），保证可以对应上参与趋势的日期数据，没有补0
        let answerTimes = res[2].times
        let answerNumbers = res[2].numbers
        let answerRecordDates = res[2].xData
        res[1].xData.forEach((item, index) => {
          if (answerRecordDates[index] !== item) {
            answerRecordDates.splice(index, 0, item)
            answerTimes.splice(index, 0, 0)
            answerNumbers.splice(index, 0, 0)
          }
        })
        // 绘制图表
        this.initEchart(row.name + '问卷参与趋势图', res[1].xData, res[1].times, res[1].numbers, answerTimes, answerNumbers)

        // 添加参与总数据
        this.paperDetail['answerTimes'] = res[3].times || 0
        this.paperDetail['answerNumbers'] = res[3].numbers || 0
        this.dialogVisible = true
      })
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
      let fileName = `${startDate}至${endDate}问卷数据`

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
        { prop: 'name', title: '问卷名称' },
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
.paper-tab{
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
// 问卷题目展示样式（使用跑马灯形式）
.el-carousel__item .topic-block {
  position: relative;
  height: 100px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.el-carousel__item .topic-block img{
  width: 180px;
  height: 100px;
}
.el-carousel__item .topic-block span{
  position: absolute;
  top: 40px;
  // left: 135px;
  font-size: 14px;
}
.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
.topic-content{
  height: 300px;
  margin-top: 20px;
}
.topic{
  display: flex;
  justify-content: center;
}
.topic-btn{
  width: 200px;
  height: 35px;
  margin: 8px;
  background: linear-gradient(to bottom, #7AC3EC, #409EFF);
  border: 1px solid blue;
  border-radius: 50px;
  text-align: center;
  color: #fff;
  line-height: 30px;
  .input-option{
    width: 40%;
    margin-left: 5px;
    background: none;
    border: none;
    border-bottom: 1px dashed blue;
  }
}
</style>
