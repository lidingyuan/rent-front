<template>
  <div class="act-tab">
    <div class="title">
      <el-date-picker size="medium" v-model="searchCondition.time" type="daterange" value-format="yyyy-MM-dd" range-separator="-" style="width: 350px"
        start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" ></el-date-picker>
      <el-cascader v-model="searchCondition.districtCode" ref="areaCascader" size="medium" placeholder="请选择区域" style="width: 200px;margin-left:15px" :options="districtOptions" :props="{ checkStrictly: true }"></el-cascader>
      <el-select v-model="searchCondition.tobaId" size="medium" style="width: 200px;margin-left:15px" placeholder="请选择卷烟">
        <el-option label="全部卷烟" value=""></el-option>
        <el-option v-for="(tobacco, index) in tobaList" :key="index" :label="tobacco | tobaType" :value="tobacco.id"></el-option>
      </el-select>
      <el-select size="medium" v-model="searchCondition.status" placeholder="" style="width: 150px;margin-left:15px">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item) in statusList" :value="item.value" :label="item.name" :key="item.value"></el-option>
      </el-select>
      <el-button @click="handleQuery"  size="medium" type="primary" icon="el-icon-search" style="margin-left:20px">查询</el-button>
      <el-button @click="handleExportSingleExcel()" :disabled="!canClickExcelBtn" size="medium" type="success" icon="el-icon-download" style="margin-left:20px">
        {{canClickExcelBtn ? '导出' : '正在导出'}}
      </el-button>
    </div>

    <div class="main">
      <el-table size="small" :data="tableData" :row-style="rowStyle" ref="act-table" height="100%" border style="width:100%">
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column label="活动名称" prop="name" width="300" show-overflow-tooltip align="left"></el-table-column>
        <el-table-column label="开始时间" prop="beginTime" align="center"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" align="center"></el-table-column>
        <el-table-column label="活动对象" prop="target" align="center" :formatter="formatTarget"></el-table-column>
        <el-table-column label="状态" prop="status" align="center" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" plain @click="handleQueryDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出层信息 -->
    <el-dialog custom-class="act-dialog" title="活动详情信息" :visible.sync="dialogVisible" :close-on-click-modal="false" width="768px">
      <div class="act-dialog" v-if="dialogVisible">
        <el-row>
          <el-col :span="16">
            <div><label>活动名称：</label>{{actDetail.name}}</div>
            <div><label>预热时间：</label>{{actDetail.advanceTime}}</div>
            <div><label>活动有效期：</label>{{actDetail.beginTime}} 至 {{actDetail.endTime}}</div>
            <div><label>失效时间：</label>{{actDetail.expiredTime}}</div>
            <div><label>面向零售户：</label><el-switch disabled v-model="actDetail.target" active-value="01" inactive-value="02"></el-switch></div>
            <div><label>获取地理位置：</label><el-switch disabled v-model="actDetail.location" :active-value="1" :inactive-value="0"></el-switch></div>
          </el-col>
          <el-col :span="8">
            <div style="color:#409eff;font-weight:bold">打开微信扫一扫，立马体验活动</div>
            <act-qrcode :actId="actDetail.id" :location="actDetail.location"></act-qrcode>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div><label>活动环节:</label></div>
            <div class="phase-container">
              <div v-for="(item, index) in actPhaseList" :key="item.id">
                {{item.phaseName}}&nbsp;&nbsp;{{item.phaseType ? '(' + item.phaseType + ')' : ''}}
                <svg-icon v-if="index !== (actPhaseList.length - 1)" icon-class="arrow-right" class="arrow-right-svg"></svg-icon>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="actDetail.tobaId">
          <el-col :span="24">
            <label>活动卷烟：</label>
            <el-tag style="margin-right:5px;margin-top:5px" v-for="(item) in actDetail.tobaId" :key="item">
              {{ item | tobaType(tobaList) }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin-top:5px" v-if="actDetail.districtCode">
          <el-col :span="24">
            <label>开展地区：</label>
            <el-tag style="margin-right:5px;margin-top:5px" type="success" v-for="(item) in actDetail.districtCode" :key="item">
              {{ item | actAreaFilter(districtOptions) }}
            </el-tag>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ActDistrictApi from '@/api/baseInfo/ActDistrictApi.js'
import * as ActTobaApi from '@/api/baseInfo/ActTobaccoApi.js'
import * as ActConfigApi from '@/api/activityInfo/ActConfigApi.js'
import * as ActPhaseApi from '@/api/activityInfo/ActPhaseApi.js'
import SimpleDateFormatter from '@/utils/SimpleDateFormatter'
import ActQrcode from '@/views/modules/components/ActQrcode'
import ExportPlus from 'export-table'

export default {
  name: 'dashboard',
  components: { ActQrcode },
  data () {
    return {
      searchCondition: {
        time: [],
        districtCode: ['000000'],
        tobaId: '',
        // 卷烟名称，用于导出Excel使用。在查询的时候改变该值，仅点击select不切换
        tobaName: '',
        // 地区名称，用于导出Excel使用。在查询的时候改变该值，仅点击cascader不切换
        districtName: '全国',
        status: 1
      },
      // 卷烟列表
      tobaList: [],
      // 地区列表-树形结构
      districtOptions: [],
      // 地区列表-非树形结构，原始后端传过来的数据
      cityList: [],
      // ---表格数据
      tableData: [],
      // 状态
      statusList: [
        { value: -1, name: '已过期' },
        { value: 0, name: '已结束' },
        { value: 1, name: '进行中' },
        { value: 2, name: '未开始' }
      ],
      // 弹出层
      dialogVisible: false,
      actDetail: {},
      // 活动环节列表(展示在活动详情中)
      actPhaseList: [],
      // 表格导出按钮，防重复点击
      canClickExcelBtn: true
    }
  },
  created () {
    // 初始化时间
    const endDate = SimpleDateFormatter((new Date()).getTime())
    const startDate = SimpleDateFormatter((new Date()).getTime() - 3600 * 1000 * 24 * 30)
    this.searchCondition.time.push(startDate.substring(0, 10))
    this.searchCondition.time.push(endDate.substring(0, 10))

    // 卷烟和地市
    Promise.all([this.handleQueryTobaList(), this.handleQueryCityList()]).then(() => {
      this.handleQuery()
    })
  },
  filters: {
    actAreaFilter (areaCode, districtOptions) {
      let area = ''
      let prov = districtOptions.find(prov => prov.value.substr(0, 2) === areaCode.substr(0, 2))
      if (prov) {
        area = prov.label
        let city = prov.children.find(city => city.value === areaCode)
        // 省市名称重复，只取一个显示
        if (city && city.label !== prov.label) {
          area = prov.label + '/' + city.label
        }
      }
      return area
    }
  },
  methods: {
    // ---查询
    // 获取基础数据-卷烟
    handleQueryTobaList () {
      return new Promise((resolve, reject) => {
        if (sessionStorage.getItem('tobaList')) {
          this.tobaList = JSON.parse(sessionStorage.getItem('tobaList'))
          resolve()
        } else {
          ActTobaApi.list().then(res => {
            this.tobaList = res.data
            sessionStorage.setItem('tobaList', JSON.stringify(res.data))
            resolve()
          })
        }
      })
    },
    // 获取基础数据-地市
    handleQueryCityList () {
      return new Promise((resolve, reject) => {
        if (sessionStorage.getItem('districtOptions')) {
          this.districtOptions = JSON.parse(sessionStorage.getItem('districtOptions'))
          this.cityList = JSON.parse(sessionStorage.getItem('cityList'))
          resolve()
        } else {
          ActDistrictApi.listAll().then(res => {
            // 省市转为树型结构
            this.cityList = res.data
            this.dealDistrict(res.data)
            // 原始全部城市数据缓存
            sessionStorage.setItem('cityList', JSON.stringify(res.data))
            resolve()
          })
        }
      })
    },
    // 活动数据
    handleQuery () {
      // 1. 查询表格数据
      const options = {
        beginDate: this.searchCondition.time[0],
        endDate: this.searchCondition.time[1],
        districtCode: this.searchCondition.districtCode[this.searchCondition.districtCode.length - 1],
        tobaId: this.searchCondition.tobaId
      }
      ActConfigApi.listByCondition(options).then(res => {
        this.tableData = res.data
      })

      // 2. 设置当前卷烟名称
      let toba = this.tobaList.find(item => item.id === options.tobaId)
      this.searchCondition.tobaName = toba ? (toba.name + '[' + (toba.type === '01' ? '包码' : (toba.type === '02' ? '条码' : '件码')) + ']卷烟') : ''

      // 3. 设置当前地区名称
      if (options.districtCode === '000000') {
        // 3.1 全国
        this.searchCondition.districtName = '全国'
      } else if (options.districtCode.substr(-4) === '0000') {
        // 省份
        this.searchCondition.districtName = (this.cityList.find(item => item.provCode === options.districtCode)).provName
      } else {
        // 地市
        this.searchCondition.districtName = (this.cityList.find(item => item.cityCode === options.districtCode)).cityName
      }
    },
    // 查询详情
    handleQueryDetail (actId) {
      const actDetailPromise = new Promise((resolve, reject) => {
        ActConfigApi.detail(actId).then(res => {
          this.actDetail = res.data
          // 开展地区转换
          this.actDetail.districtCode = res.data.districtCode ? JSON.parse(res.data.districtCode) : []
          // 卷烟转换
          this.actDetail.tobaId = res.data.tobaId ? JSON.parse(res.data.tobaId) : []

          resolve()
        }).catch(err => reject(err))
      })

      // 2.2查看环节列表
      const phaseListPromise = new Promise((resolve, reject) => {
        ActPhaseApi.list({ actId }).then(res => {
          this.actPhaseList = res.data
          resolve()
        }).catch(err => reject(err))
      })

      // 2.3 显示弹窗
      Promise.all([actDetailPromise, phaseListPromise]).then(() => {
        this.dialogVisible = true
      })
    },
    // 地市处理成树形结构
    dealDistrict (districtList) {
      let len = districtList.length
      for (let i = 0; i < len; i++) {
        // 匹配provCode
        let provLen = this.districtOptions.length
        let city = {
          value: districtList[i].cityCode,
          label: districtList[i].cityName
        }
        let prov = {
          value: districtList[i].provCode,
          label: districtList[i].provName,
          children: []
        }
        for (let j = 0; j < provLen; j++) {
          // 匹配，加城市
          if (districtList[i].provCode === this.districtOptions[j].value) {
            this.districtOptions[j].children.push(city)
            break
          }
          // 匹配加省。上一个if判断已经判断匹配情况包括最后一个匹配
          if (j === provLen - 1) {
            prov.children.push(city)
            this.districtOptions.push(prov)
          }
        }
        if (provLen === 0) {
          prov.children.push(city)
          this.districtOptions.push(prov)
        }
      }

      // 添加全国
      this.districtOptions.unshift({ value: '000000', label: '全国', children: [{ value: '000000', label: '全国' }] })

      sessionStorage.setItem('districtOptions', JSON.stringify(this.districtOptions))
    },
    // ---表格格式化输出数据
    // 活动状态
    formatStatus (row) {
      return this.statusList[parseInt(row.status) + 1].name
    },
    // 活动对象
    formatTarget (row) {
      return row.target === '01' ? '零售户' : '消费者'
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
      let fileName = `${startDate}至${endDate}${this.searchCondition.tobaName}${this.searchCondition.districtName}活动数据`

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
          if (prop === 'target') {
            return value === '01' ? '零售户' : '消费者'
          }
          if (prop === 'status') {
            return this.statusList[parseInt(value) + 1].name
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
    // --- 表格设置行样式
    rowStyle (row, rowIndex) {
      if (row.target === '01') {
        return 'row-style-retailer'
      }
      return ''
    },
    getColumns () {
      let colums = []
      colums = [
        { prop: 'name', title: '活动名称' },
        { prop: 'beginTime', title: '开始时间' },
        { prop: 'endTime', title: '结束时间' },
        { prop: 'target', title: '活动对象' },
        { prop: 'status', title: '状态' }
      ]
      return colums
    }
  }
}
</script>

<style lang='scss' scoped>
.act-tab{
  position: relative;
  padding-top: 65px;
  width: 100%;
  min-width: 1200px;
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
  .qrcode-img{
    width: 165px;
    height: 165px;
    padding: 3px;
    border: 2px solid #409eff;
  }
}
</style>
