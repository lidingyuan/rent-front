<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">
        {{luckyName}}
      </div>
      <template slot="operates">
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="handleSearch()">刷新</el-button>
        <el-button v-if="$auth('activity:lucky:prize:add')" size="small" type="success" icon="el-icon-plus" @click="handleCreate">新增</el-button>
        <el-button size="small" type="warning" icon="el-icon-s-grid" @click="handleConfig">奖池和中奖率</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" width="150" label="奖项名称"></el-table-column>
        <el-table-column prop="rank" width="110" label="奖项排名" sortable></el-table-column>
        <el-table-column prop="img" width="80" label="奖项图片">
          <template slot-scope="scoped">
            <img-preview :imgArr="scoped.row.img"></img-preview>
          </template>
        </el-table-column>
        <el-table-column prop="type" width="100" label="奖项类别" align="center">
          <template slot-scope="scope">
            {{['无奖奖项', '有奖奖项'][scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" width="140" label="物资名称" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="goodsImg" width="80" label="物资图片">
          <template slot-scope="scoped">
            <img-preview :imgArr="scoped.row.goodsImg"></img-preview>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNum" width="80" label="物资个数" align="right"></el-table-column>
        <el-table-column prop="position" width="110" label="排序" align="center" sortable></el-table-column>
        <el-table-column prop="standby" width="70" label="默认奖项" align="center">
          <template slot-scope="scope">
            {{['否', '是'][scope.row.standby]}}
          </template>
        </el-table-column>
        <el-table-column prop="enabled" width="80" label="状态" align="center" sortable>
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">启用</el-tag>
            <el-tag type="danger" v-else>停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remarks" width="200" show-overflow-tooltip ></el-table-column>
        <el-table-column width="120" label="操作" align="center">
          <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$auth('activity:lucky:prize:mod')" size="mini" icon="el-icon-edit" @click.native="handleUpdate(scope.row)" style="color:#409eff;">编辑</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:lucky:prize:del')" size="mini" icon="el-icon-delete" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:lucky:prize:mod')" size="mini" icon="el-icon-picture" divided @click.native="handleMaterialMapping(scope.row)">奖项图片</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="768px">
      <el-form size="medium" label-width="120px" ref="dataForm" :model="temp" status-icon>
        <el-form-item label="奖项名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
          <el-input v-model="temp.name"></el-input>
          <br>
          提示：新增奖项后记得<span class="txt-red">维护奖项图片</span>(图片类型为<span class="txt-red">icon</span>)哦~适用于以下情况：
          <br>1.页面需要显示该奖项图片，但关联的奖品没有奖品图；2.奖项关联的图片不是页面需要显示的
        </el-form-item>
        <el-form-item prop="rank" :rules="[{required:true, message:'必须字段'}]">
          <span slot="label">
            奖项排名
            <i class="el-icon-question" title="1代表一等奖，2代表二等奖，依次类推"></i>
          </span>
          <el-input-number v-model.number="temp.rank" :min="1"></el-input-number>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="奖项类别" prop="type" :rules="[{required:true, message:'必须字段'}]">
              <el-select v-model="temp.type">
                <el-option :value="1" label="有奖奖项"></el-option>
                <el-option :value="0" label="无奖奖项"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="12" v-if="temp.type == 1">
            <el-form-item label="物资数量" prop="goodsNum" :rules="[{required:true, message:'必须字段'}]">
              <el-input-number v-model="temp.goodsNum" :min="0"></el-input-number>
              <i class="el-icon-question">单个奖项所含的奖品个数,</i>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 物资选择 -->
        <el-form-item v-if="temp.type === 1" label="物资选择">
          <el-popover placement="bottom" trigger="click" width="700">
            <goods-selected-box :selectedGoods="selectedGoods" ref="selectedGoods" @updateSelectedGoods="updateSelectedGoods"></goods-selected-box>
            <el-input slot="reference" readonly :value="selectedGoods.goodsName"></el-input>
          </el-popover>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item  prop="standby" :rules="[{required:true, message:'必须字段'}]">
              <span slot="label">
                默认奖项
                <i class="el-icon-question" title="建议每个抽奖都应设置一个(也只能指定一个)默认奖项，中奖后如果中奖奖项奖池不足，以默认奖项代替"></i>
              </span>
              <el-switch v-model="temp.standby" :active-value="1" :inactive-value="0"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="enabled" :rules="[{required:true, message:'必须字段'}]">
              <el-switch v-model="temp.enabled" :active-value="1" :inactive-value="0"> </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="position" :rules="[{required:true, message:'必须字段'}]">
          <span slot="label">
            奖项序号
            <i class="el-icon-question" title="奖品在页面上的位置；转盘：从12点钟位置顺时针排列；九宫格：从左上方位置顺时针排列">
            </i>
          </span>
          <el-input-number v-model.number="temp.position" :min="0"></el-input-number>
          <i></i>
        </el-form-item>
        <!-- <el-form-item label="排序码">
          <el-input-number v-model.number="temp.orderTag" :min="0"></el-input-number>
        </el-form-item> -->
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{dialogStatus === 'create' ? '保存' : '确定'}}
        </el-button>
      </div>
    </el-dialog>

    <!-- 奖池管理 -->
    <el-dialog v-if="dialogConfigVisible" :visible.sync="dialogConfigVisible" :close-on-click-modal="false" width="90%" top="3vh">
      <el-tabs v-model="tabActiveName" type="card">
        <el-tab-pane label="奖池维护" name="prizePool">
          <el-tag>奖池维护，修改后1分钟内生效</el-tag>
          <prize-pool :luckyId="luckyId" :luckyName="luckyName" :prizeList="dataList"
            :luckyBeginTime="luckyBeginTime" :luckyEndTime="luckyEndTime"></prize-pool>
        </el-tab-pane>
        <el-tab-pane label="每日奖池模板" name="prizePoolTemplate">
          <el-tag>分时段奖池维护，系统自动在每日24:00前，生成<b>次日</b>奖池。您也可以点击下方生成奖池按钮来生成次日奖池，如果次日奖池已经存在，则不再生成。</el-tag>
          <prize-pool-template :luckyId="luckyId" :luckyName="luckyName" :prizeList="dataList"></prize-pool-template>
        </el-tab-pane>
        <el-tab-pane label="中奖率维护" name="prizeChance">
          <el-tag>分时段中奖率维护，修改后1分钟内生效</el-tag>
          <prize-chance :luckyId="luckyId" :luckyName="luckyName" :prizeList="dataList"></prize-chance>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script>
import * as ActLuckyPrizeApi from '@/api/lucky/ActLuckyPrizeApi.js'
import TableWrapper from '@/components/TableWrapper'
import GoodsSelectedBox from '@/views/modules/components/GoodsSelectedBox'
import PrizeChance from './components/PrizeChance'
import PrizePoolTemplate from './components/PrizePoolTemplate'
import PrizePool from './components/PrizePool'
import ImgPreview from '@/views/modules/components/ImgPreview'

export default {
  name: 'ActLuckyPrize',
  components: {
    TableWrapper,
    GoodsSelectedBox,
    PrizeChance,
    PrizePool,
    PrizePoolTemplate,
    ImgPreview
  },
  data () {
    return {
      luckyName: '',
      // ---查询条件
      luckyId: '',
      luckyBeginTime: '',
      luckyEndTime: '',
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        luckyId: this.luckyId,
        name: '',
        rank: 1,
        chance: 0,
        type: 1,
        position: 0,
        orderTag: 1,
        standby: 0,
        enabled: 1,
        goodsId: '',
        goodsNum: 1,
        remarks: ''
      },
      // 奖项位置可设置的最小数值
      minPrizePosition: -1,
      selectedGoods: {
        goodsId: '',
        goodsName: '',
        goodsNum: 1
      },
      // 显示奖池维护弹窗
      dialogConfigVisible: false,
      // 奖池维护打开tab名称
      tabActiveName: 'prizePool',
      // 奖项图片说明弹窗
      dialogPrizeImgVisible: false,
      prizeRow: null
    }
  },
  created () {
    // 路由参数
    if (this.$route.query.luckyId) {
      this.luckyId = this.$route.query.luckyId
      this.luckyName = this.$route.query.luckyName
      this.luckyBeginTime = this.$route.query.beginTime
      this.luckyEndTime = this.$route.query.endTime
      this.handleSearch()
    } else {
      this.$router.replace('/lucky/manage')
    }
  },
  methods: {
    // ---查询列表
    handleSearch () {
      if (!this.luckyId) {
        return
      }
      ActLuckyPrizeApi.list(this.luckyId).then(res => {
        this.dataList = res.data
        // 按照奖项排名排序
        this.dataList.sort((a, b) => { return a.rank - b.rank })
        this.minPrizePosition = this.dataList.length
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
      this.currentMaxChance = this.remainChance
    },
    // 新增保存
    createData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          // 无奖奖项删除goodsId字段
          if (this.temp.type === 0) {
            delete tempData['goodsId']
            delete tempData['goodsNum']
          }
          ActLuckyPrizeApi.save(tempData).then(res => {
            this.temp.id = res.data
            this.handleSearch()
            this.dialogFormVisible = false
            this.$confirm('保存成功', '提示', {
              confirmButtonText: '配置奖池和中奖率',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleConfig()
            })
          })
        }
      })
    },
    handleUpdate (row) {
      this.resetTemp()
      Object.assign(this.temp, row)
      this.$objects.copyProperties(row, this.selectedGoods)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.currentMaxChance = (this.remainChance * 10000 + this.temp.chance * 10000) / 10000
    },
    // 修改保存
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          // 无奖奖项删除goodsId字段
          if (this.temp.type === 0) {
            delete tempData['goodsId']
            delete tempData['goodsNum']
          }
          ActLuckyPrizeApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$confirm('保存成功', '提示', {
              confirmButtonText: '配置奖池和中奖率',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleConfig()
            })
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除此奖项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActLuckyPrizeApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        luckyId: this.luckyId,
        name: '',
        rank: 1,
        chance: 0,
        type: 1,
        position: this.minPrizePosition,
        orderTag: 1,
        standby: 0,
        enabled: 1,
        goodsId: '',
        goodsNum: 1,
        remarks: ''
      }
      this.selectedGoods = {
        goodsId: '',
        goodsName: '',
        goodsNum: 1
      }
      this.nextChoice = ''
    },
    updateSelectedGoods (val) {
      this.selectedGoods = val
      this.temp.goodsId = val.goodsId
    },
    // 奖项图片
    handleMaterialMapping (row) {
      this.$router.push({ name: 'ActMaterialMapping', query: { sourceId: row.id, sourceType: 'PRIZE', sourceName: row.name } })
    },
    // 配置奖池和中奖率
    handleConfig (row) {
      this.temp = row
      this.tabActiveName = 'prizePool'
      this.dialogConfigVisible = true
    }
  },
  watch: {
    dialogFormVisible (newVal, oldVal) {
      if (newVal) {
        setTimeout(() => {
          if (this.temp.type === 1) {
            this.$refs.selectedGoods.handleSearch()
          }
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
