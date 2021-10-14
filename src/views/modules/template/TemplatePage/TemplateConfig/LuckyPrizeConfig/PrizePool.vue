<template>
  <!-- 奖池·单个奖项 -->
  <div class="page">
    <table-wrapper :filterable="false" :excel="false" :expand="false" height="70vh">
      <div slot="title" class="title">奖池维护</div>
      <template slot="operates">
        <el-date-picker v-model="queryParam.beginTime" value-format="yyyy-MM-dd" type="date" size="small" :clearable="false" style="width: 150px;"></el-date-picker>
        <el-date-picker v-model="queryParam.endTime" value-format="yyyy-MM-dd" type="date" size="small" :clearable="false" style="width: 150px;"></el-date-picker>
        <el-cascader v-model="queryParam.districtCode" :options="areaTreeData"  clearable collapse-tags filterable
          size="small" :props="{emitPath: false,checkStrictly: true}" style="width: 200px;" placeholder="请选择区域"></el-cascader>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
        <el-button size="small" type="success" icon="el-icon-plus" @click="handleCreate()">新增</el-button>
        <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete()" title="批量删除" v-if="selected.length > 0">批量删除</el-button>
      </template>

      <el-table :data="dataList" size="small" height="100%" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="50" ></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="districtCode" width="130" label="区域" show-overflow-tooltip :formatter="formatArea"/>
        <el-table-column prop="beginTime" width="140" label="开始时间" align="center"/>
        <el-table-column prop="endTime" width="140" label="结束时间" align="center"/>
        <template v-for="item in validPrizeList">
          <el-table-column :key="item.id" :label="item.name" align="center">
            <el-table-column :prop="item.id+'##planNum'" width="80" label="预设数量" align="right" show-overflow-tooltip/>
            <el-table-column :prop="item.id+'##usedNum'" width="80" label="已中数量" align="right" show-overflow-tooltip/>
            <el-table-column :prop="item.id+'##preNum'" width="80" label="上期结余" align="right" show-overflow-tooltip/>
          </el-table-column>
        </template>
        <el-table-column width="100" label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)" >编辑</el-button>
            <br/>
            <el-button size="mini" type="warning" icon="el-icon-delete" @click="handleDelete(scope.row)" style="margin-top: 3px;" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-wrapper>

    <!-- 表单·新增奖池 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="900px" append-to-body>
      <el-form size="medium" label-width="120px" ref="dataForm" :model="temp" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" label-width="160px" prop="beginTime" :rules="[{required:true, message:'必须字段'}]">
              <el-date-picker placeholder="开始时间" type="datetime" v-model="temp.beginTime" value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" label-width="160px" prop="endTime" :rules="[{required:true, message:'必须字段'}]">
              <el-date-picker placeholder="结束时间" type="datetime" v-model="temp.endTime" value-format="yyyy-MM-dd HH:mm:ss"
                default-time="23:59:59" ></el-date-picker>
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
        <el-form-item label="选择新增的奖项">
          <el-select @change="handleAddItemTempList" v-model="checkBoxSelected" placeholder="请选择奖项">
            <el-option v-for="(item, index) in validPrizeList" :key="`select${index}`" :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!-- 奖项预设数量表格 -->
          <el-table border stripe size="mini" :data="tempList" height="230" style="width: 100%;margin-top:10px;">
            <el-table-column prop="prizeId" label="奖项名称" :formatter="formatePrizeName"/>
            <el-table-column prop="planNum" label="预设数量" width="250">
              <template slot-scope="scoped">
                <el-input-number size="mini" v-model="scoped.row.planNum" placeholder=""></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150" class-name="small-padding">
              <template slot-scope="scope">
                <el-button type="danger"  size="mini" icon="el-icon-delete" circle title="删除" @click="handleDelItemTempList(tempList, scope.$index)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>

    </el-dialog>

    <!-- 表格·编辑奖池 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormEditVisible" :close-on-click-modal="false" width="85%" append-to-body>
      <div>
        选择新增奖项
        <el-select size="small" @change="handleAddItemTempList" v-model="checkBoxSelected" placeholder="请选择奖项">
          <el-option v-for="(item, index) in validPrizeList" :key="`select${index}`" :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-table border stripe size="mini" :data="tempList" height="60vh" style="width: 100%;margin-top:10px;">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="districtCode" width="100" label="区域编码"></el-table-column>
        <el-table-column prop="beginTime" width="150" label="开始时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" width="150" label="结束时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="prizeId" width="150" label="奖项" show-overflow-tooltip :formatter="formatePrizeName"></el-table-column>
        <el-table-column prop="planNum" width="200" label="预设数量" align="center">
          <template slot-scope="scoped">
            <el-input-number size="mini" v-model="scoped.row.planNum"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="usedNum" width="80" label="已中数量" align="right"></el-table-column>
        <el-table-column prop="preNum" width="80" label="上期结余" align="right"></el-table-column>
        <el-table-column label="操作" align="center" width="120" class-name="small-padding">
          <template slot-scope="scope">
            <el-button type="success"  size="mini" icon="el-icon-check" circle title="保存"
              @click="updateSinglePool(scope.row)"></el-button>
            <el-button type="danger"  size="mini" icon="el-icon-delete" circle title="删除" @click="handleDelPool(scope.row, scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import TableWrapper from '@/components/TableWrapper'
import * as ActLuckyPrizePoolApi from '@/api/lucky/ActLuckyPrizePoolApi'
import PrizeAreaSelect from '@/views/modules/components/PrizeAreaSelect'
import SimpleDateFormatter from '@/utils/SimpleDateFormatter'

export default {
  name: 'PrizePool',
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
    },
    luckyBeginTime: {
      type: String,
      default: ''
    },
    luckyEndTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataList: [],
      dialogFormVisible: false,
      // 编辑的弹窗
      dialogFormEditVisible: false,
      dialogStatus: 'create',
      // 查询条件
      queryParam: {
        beginTime: '',
        endTime: '',
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
      selected: [],
      checkBoxSelected: ''
    }
  },
  computed: {
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
    this.queryParam.beginTime = this.luckyBeginTime.substr(0, 10)
    this.queryParam.endTime = this.luckyEndTime.substr(0, 10)
    this.handleSearch()
  },
  methods: {
    // 分页查询
    handleSearch () {
      let options = {
        luckyId: this.luckyId,
        beginTime: this.queryParam.beginTime + ' 00:00:00',
        endTime: this.queryParam.endTime + ' 23:59:59',
        districtCode: this.queryParam.districtCode
      }
      ActLuckyPrizePoolApi.listForTransform(options).then(res => {
        this.dataList = res.data
        this.selected = []
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
    // 新增保存，批量保存
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let saveDataList = this.tempList.map(item => {
            return {
              luckyId: this.temp.luckyId,
              districtCode: this.temp.districtCode || '000000',
              beginTime: this.temp.beginTime,
              endTime: this.temp.endTime,
              prizeId: item.prizeId,
              planNum: item.planNum
            }
          })
          ActLuckyPrizePoolApi.saveOrUpdateBatch(saveDataList).then(res => {
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
      this.dialogFormEditVisible = true
    },
    // 修改保存，批量更新
    updateData (data) {
      let saveDataList = data.map(item => {
        return {
          id: item.id,
          luckyId: this.temp.luckyId,
          districtCode: this.temp.districtCode || '000000',
          beginTime: this.temp.beginTime,
          endTime: this.temp.endTime,
          prizeId: item.prizeId,
          planNum: item.planNum
        }
      })
      ActLuckyPrizePoolApi.saveOrUpdateBatch(saveDataList).then(() => {
        this.handleSearch()
        this.dialogFormVisible = false
        this.$message.success('更新成功')
      })
    },
    handleDelete (row, isEdit) {
      this.$confirm('删除奖池会导致此周期内无法出奖。提交后1分钟内生效，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = ''
        // 编辑页面-单条奖池数据
        if (isEdit) {
          ids = [row.id]
        } else {
          // 非编辑页面-整个周期的奖池
          ids = this.validPrizeList.map(prize => row[prize.id + '##id'])
        }
        ActLuckyPrizePoolApi.del(ids).then(res => {
          this.$message.success('删除成功！')
          this.handleSearch()
          // 编辑页面，移除删除的元素
          if (isEdit) {
            let index = this.tempList.findIndex(item => item.id === row.id)
            this.tempList.splice(index, 1)
          }
        })
      })
    },
    resetTemp (row) {
      this.temp = {
        luckyId: this.luckyId,
        districtCode: row ? row.districtCode : '000000',
        beginTime: row ? row.beginTime : SimpleDateFormatter(Date.now(), 'yyyy-MM-dd 00:00:00'),
        endTime: row ? row.endTime : SimpleDateFormatter(Date.now(), 'yyyy-MM-dd 23:59:59')
      }
      this.tempList = []
      if (row) {
        // 仅保留设置过预设数量的奖池
        this.validPrizeList.forEach(prize => {
          const tempObj = {
            id: row[prize.id + '##id'],
            luckyId: this.luckyId,
            districtCode: this.temp.districtCode || '000000',
            beginTime: this.temp.beginTime,
            endTime: this.temp.endTime,
            prizeId: prize.id,
            prizeName: prize.name,
            planNum: row[prize.id + '##planNum'] || 0,
            preNum: row[prize.id + '##preNum'] || 0,
            usedNum: row[prize.id + '##usedNum'] || 0
          }
          if (row[prize.id + '##planNum'] !== undefined) {
            this.tempList.push(tempObj)
          }
        })
      }
    },
    // ---
    // 勾选表格条目
    handleSelectionChange (val) {
      this.selected = val
    },
    // 表格区域code转name
    formatArea (row, cell, cellValue) {
      return this.$area.getNameByCode(cellValue)
    },
    // ---新增是奖项表格操作
    formatePrizeName (row, cell, cellValue) {
      let prize = this.validPrizeList.find(item => item.id === cellValue)
      return prize.name
    },
    // --- 新增奖池表格操作
    // 新增奖池-添加一条奖项
    handleAddItemTempList (value) {
      // 检查表中是否已经添加过该奖项
      let index = this.tempList.findIndex(item => item.prizeId === value)
      if (index > -1) {
        this.$message.info('您已添加过该奖项,不能在同一周期奖池内添加重复奖项')
      } else {
        if (this.dialogStatus === 'create') {
          this.tempList.push({
            prizeId: value,
            planNum: 0
          })
        } else {
          this.tempList.push({
            luckyId: this.luckyId,
            districtCode: this.temp.districtCode || '000000',
            beginTime: this.temp.beginTime,
            endTime: this.temp.endTime,
            prizeId: value,
            planNum: 0,
            preNum: 0,
            usedNum: 0
          })
        }
      }
    },
    handleDelItemTempList (arr, index) {
      arr.splice(index, 1)
    },
    // ---end 新增奖池表格操作
    // --- 编辑奖池表格操作
    // 删除单个奖池
    handleDelPool (row, index) {
      if (row.id) {
        this.handleDelete(row, 1)
      } else {
        this.tempList.splice(index, 1)
      }
    },
    // 更新单个奖池
    updateSinglePool (row) {
      if (row.id) {
        let data = [row]
        this.updateData(data)
      } else {
        ActLuckyPrizePoolApi.save(row).then(res => {
          row.id = res.data
          this.handleSearch()
          this.$message.success('新增成功')
        }).catch(() => {})
      }
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
