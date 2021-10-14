<template>
  <!-- 奖池·单个奖项 -->
  <div class="page">
    <table-wrapper :filterable="false" :excel="false" :expand="false" height="70vh">
      <div slot="title" class="title">每日奖池模板</div>
      <template slot="operates">
        <el-cascader v-model="queryParam.districtCode" :options="areaTreeData"  clearable collapse-tags filterable
          size="small" :props="{emitPath: false,checkStrictly: true}" style="width: 200px;" placeholder="请选择区域"></el-cascader>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
        <el-button size="small" type="success" icon="el-icon-plus" @click="handleCreate()">新增</el-button>
        <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete()" title="批量删除" v-if="selectedId.length > 1">批量删除</el-button>
        <el-button size="small" type="warning" icon="el-icon-plus" @click="handleGenerate()">生成次日奖池</el-button>
      </template>

      <el-table :data="dataList" size="small" height="100%" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="50" :index="page | listIndexFilter"></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="districtCode" width="100" label="区域" show-overflow-tooltip :formatter="formatArea"/>
        <el-table-column prop="beginTime" width="80" label="开始时间" align="center"/>
        <el-table-column prop="endTime" width="80" label="结束时间" align="center"/>
        <template v-for="item in validPrizeList">
          <el-table-column :key="item.id" :label="item.name" :prop="item.id+'##planNum'" width="80" align="right" show-overflow-tooltip></el-table-column>
        </template>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)" >编辑</el-button>
            <el-button size="mini" type="warning" icon="el-icon-delete" @click="handleDelete(scope.row)" style="margin-top: 3px;" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-wrapper>

    <!-- 表单 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="900px" append-to-body>
      <el-form size="medium" label-width="120px" ref="dataForm" :model="temp" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" label-width="160px" prop="beginTime" :rules="[{required:true, message:'必须字段'}]">
              <el-time-picker placeholder="开始时间" v-model="temp.beginTime" :clearable="false" format="HH:mm" value-format="HH:mm" class="margin-left-small"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" label-width="160px" prop="endTime" :rules="[{required:true, message:'必须字段'}]">
              <el-time-picker placeholder="结束时间" v-model="temp.endTime" :clearable="false" format="HH:mm" value-format="HH:mm" class="margin-left-small"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="区域" label-width="160px">
              <prize-area-select v-if="dialogFormVisible" :code.sync="temp.districtCode" :status="dialogStatus" :multiple="dialogStatus === 'create'"></prize-area-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-for="item in tempList" :key="item.prizeId">
            <el-form-item :label="item.prizeName" label-width="160px">
              <el-tooltip effect="dark" content="设置数量" placement="top" style="width:70%;">
                <el-input-number v-model="item.planNum" placeholder="本期预设" :min="0" :step="1" ></el-input-number>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="" label-width="160px">
              <span style="color: #F56C6C">数量合计：{{totalPlanNum}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableWrapper from '@/components/TableWrapper'
import * as ActLuckyPrizePoolTemplateApi from '@/api/lucky/ActLuckyPrizePoolTemplateApi'
import PrizeAreaSelect from '@/views/modules/components/PrizeAreaSelect'
import SimpleDateFormatter from '@/utils/SimpleDateFormatter'

export default {
  name: 'PrizePoolTemplate',
  components: { TableWrapper, PrizeAreaSelect },
  props: {
    luckyId: {
      type: String,
      default: ''
    },
    luckyName: {
      type: String,
      default: ''
    },
    prizeList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dataList: [],
      dialogFormVisible: false,
      dialogStatus: 'create',
      page: {
        current: 1,
        total: 0,
        size: 30
      },
      // 查询条件
      queryParam: {
        districtCode: ''
      },
      temp: {
        id: '',
        luckyId: '',
        districtCode: '',
        beginTime: '',
        endTime: ''
      },
      tempList: [],
      // 表格中勾选的数据
      selectedId: []
    }
  },
  computed: {
    provList () {
      return this.$store.getters['baseData/provList']
    },
    areaTreeData () {
      return this.$store.getters['baseData/areaTreeData']
    },
    validPrizeList () {
      return this.prizeList.filter(item => item.type === 1 && item.enabled === 1)
    },
    totalPlanNum () {
      return this.tempList.reduce((accumulator, currentValue) => accumulator + (currentValue.planNum || 0), 0)
    }
  },
  created () {
    this.handleSearch()
  },
  methods: {
    // 分页查询
    handleSearch () {
      let options = {
        luckyId: this.luckyId,
        districtCode: this.queryParam.districtCode
      }
      ActLuckyPrizePoolTemplateApi.listForTransform(options).then(res => {
        this.dataList = res.data
        this.selectedId = []
      })
    },
    // ---编辑
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增保存
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let saveDataList = this.tempList.map(item => {
            return {
              id: item.id,
              luckyId: this.temp.luckyId,
              districtCode: this.temp.districtCode || '000000',
              beginTime: this.temp.beginTime + ':00',
              endTime: this.temp.endTime + ':59',
              prizeId: item.prizeId,
              planNum: item.planNum
            }
          })
          ActLuckyPrizePoolTemplateApi.saveOrUpdateBatch(saveDataList).then(res => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('保存成功')
          })
        }
      })
    },
    handleUpdate (row) {
      this.dialogStatus = 'update'
      this.resetTemp(row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改保存
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let saveDataList = this.tempList.map(item => {
            return {
              id: item.id,
              luckyId: this.temp.luckyId,
              districtCode: this.temp.districtCode || '000000',
              beginTime: this.temp.beginTime + ':00',
              endTime: this.temp.endTime + ':59',
              prizeId: item.prizeId,
              planNum: item.planNum
            }
          })
          ActLuckyPrizePoolTemplateApi.saveOrUpdateBatch(saveDataList).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('删除奖池会导致此周期内无法出奖。提交后1分钟内生效，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = this.validPrizeList.map(prize => row[prize.id + '##id'])
        ActLuckyPrizePoolTemplateApi.del(ids).then(res => {
          this.$message.success('删除成功！')
          this.handleSearch()
        })
      })
    },
    handleBatchDelete () {
      this.$confirm('删除该奖池模板并不能改变已有的奖池配置，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        this.selected.forEach(row => {
          ids.concat(this.validPrizeList.map(prize => row[prize.id + '##id']))
        })
        ActLuckyPrizePoolTemplateApi.del(ids).then(res => {
          this.$message.success('删除成功！')
          this.handleSearch()
        })
      })
    },
    resetTemp (row) {
      this.temp = {
        luckyId: this.luckyId,
        districtCode: row ? row.districtCode : '000000',
        beginTime: row ? row.beginTime.substr(0, 5) : '00:00',
        endTime: row ? row.endTime.substr(0, 5) : '23:59'
      }
      this.tempList = this.validPrizeList.map(prize => {
        return {
          id: row ? row[prize.id + '##id'] : '',
          luckyId: this.luckyId,
          districtCode: this.temp.districtCode || '000000',
          beginTime: this.temp.beginTime,
          endTime: this.temp.endTime,
          prizeId: prize.id,
          prizeName: prize.name,
          planNum: row ? row[prize.id + '##planNum'] : 0
        }
      })
    },
    // ---
    // 生成次日奖池
    handleGenerate () {
      let nextDate = SimpleDateFormatter(Date.now() + 24 * 3600 * 1000, 'yyyy-MM-dd')
      let options = { luckyId: this.luckyId, prizeDate: nextDate }
      ActLuckyPrizePoolTemplateApi.generate(options).then(res => {
        this.$message.success('操作成功')
      })
    },
    // 勾选表格条目
    handleSelectionChange (val) {
      this.selectedId = val
    },
    // 表格区域code转name
    formatArea (row, cell, cellValue) {
      return this.$area.getNameByCode(cellValue)
    }
  }
}
</script>

<style lang='scss' scoped>
.title {
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.margin-left-small {
  margin-left: 10px;
}
.margin-right-small {
  margin-right: 10px;
}
.area-selected {
  max-height: 300px;
  overflow: auto;
}
</style>
