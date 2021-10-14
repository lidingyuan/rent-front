<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">卷烟列表</div>
      <template slot="operates">
        <el-button size="small" type="primary" icon="el-icon-refresh" @click="handleSearch">刷新</el-button>
        <!-- <el-button v-if="$auth('activity:basics:tobacco:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button> -->
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" width="100" label="卷烟编码" show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="name" width="100" label="卷烟" show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="cssUrl" width="80" label="扫码皮肤">
          <template slot-scope="scope">
            <el-popover placement="left" :content="scope.row.cssUrl">
              <el-button type="text" slot="reference">{{scope.row.cssUrl ? '已配置' : '未配置'}}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" width="100" label="品牌" show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="priceTypeName" width="100" label="价类" show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="tar" width="80" label="焦油含量"></el-table-column>
        <el-table-column prop="nicotine" width="100" label="烟气烟碱量"></el-table-column>
        <el-table-column prop="co" width="80" label="CO量"></el-table-column>
        <el-table-column prop="type" width="80" label="卷烟类型">
          <template slot-scope="scope">
            {{scope.row.type * 1 === 1 ? '包码' : '条码'}}
          </template>
        </el-table-column>
        <el-table-column prop="size" width="80" label="单包支数"></el-table-column>
        <el-table-column prop="discribe" width="100" label="卷烟描述" show-overflow-tooltip=""></el-table-column>
        <el-table-column prop="length" width="100" label="卷烟长度(mm)"></el-table-column>
        <el-table-column prop="xiZhi" width="80" label="是否细支" :formatter="formatTrueOrFalse"></el-table-column>
        <el-table-column prop="zhongZhi" width="80" label="是否中支" :formatter="formatTrueOrFalse"></el-table-column>
        <el-table-column prop="duanZhi" width="80" label="是否短支" :formatter="formatTrueOrFalse"></el-table-column>
        <el-table-column prop="baoZhu" width="80" label="是否爆珠" :formatter="formatTrueOrFalse"></el-table-column>
        <el-table-column prop="industryName" width="100" label="工业"></el-table-column>
        <el-table-column prop="industryName" width="150" label="素材预览"></el-table-column>
        <el-table-column prop="orderTag" width="50" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="300" label="备注" show-overflow-tooltip=""></el-table-column>
        <el-table-column width="100" label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item v-if="$auth('activity:basics:tobacco:mod')" icon="el-icon-edit" @click.native="handleUpdate(scope.row)" >编辑</el-dropdown-item> -->
                <!-- <el-dropdown-item v-if="$auth('activity:basics:tobacco:del')" icon="el-icon-delete" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item> -->
                <el-dropdown-item v-if="$auth('activity:basics:material_mapping:get')" icon="el-icon-picture-outline" divided @click.native="handleMaterial(scope.row)" >管理素材</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:basics:material_mapping:get')" icon="el-icon-picture-outline" divided @click.native="handleSkin(scope.row)" >设置皮肤</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer" v-if="false">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="768px">
      <el-form size="medium" label-width="130px" ref="dataForm" :model="temp" status-icon class="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="卷烟编码" prop="code">
              <el-input v-model="temp.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卷烟名称" prop="name" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌编码" prop="brandCode" >
              <el-input v-model="temp.brandCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌名称" prop="brandName" >
              <el-input v-model="temp.brandName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价类编码" prop="priceTypeCode" >
              <el-input v-model="temp.priceTypeCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价类名称" prop="priceTypeName" >
              <el-input v-model="temp.priceTypeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="焦油含量" prop="tar" >
              <el-input-number v-model="temp.tar" :precision="2" :step="0.1" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="烟气烟碱量" prop="nicotine" >
              <el-input-number v-model="temp.nicotine" :precision="2" :step="0.1" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="烟气一氧化碳量" prop="co" >
              <el-input-number v-model="temp.co" :precision="2" :step="0.1" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卷烟类型" prop="type" >
              <el-select v-model="temp.type">
                <el-option label="包码" value="1"></el-option>
                <el-option label="条码" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单包支数" prop="size" :rules="[{required:true, message:'必须字段，且为正整数'}]">
              <el-input-number v-model.number="temp.size" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卷烟长度" prop="length" :rules="[{required:true, message:'必须字段', pattern: /^[1-9]\.?[0-9]*$/}]">
              <el-input-number v-model.number="temp.length" :min="0"></el-input-number>毫米
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否细支" prop="xiZhi" >
              <el-switch v-model="temp.xiZhi" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否中支" prop="zhongZhi" >
              <el-switch v-model="temp.zhongZhi" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否短支" prop="duanZhi" >
              <el-switch v-model="temp.duanZhi" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否爆珠" prop="baoZhu" >
              <el-switch v-model="temp.baoZhu" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工业编码" prop="industryCode" >
              <el-input v-model="temp.industryCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工业名称" prop="industryName" >
              <el-input v-model="temp.industryName" :min="0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序码" prop="orderTag" >
              <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卷烟描述" prop="discribe" >
              <el-input v-model="temp.discribe"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input type="textarea" v-model="temp.remarks"></el-input>
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
import * as ActTobaccoApi from '@/api/baseInfo/ActTobaccoApi.js'
import TableWrapper from '@/components/TableWrapper'

export default {
  name: 'MpActTobacco',
  components: { TableWrapper },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        code: '',
        name: '',
        brandCode: '',
        brandName: '',
        priceTypeCode: '',
        priceTypeName: '',
        tar: '',
        nicotine: '',
        co: 0,
        type: '',
        size: 20,
        discribe: '',
        length: 90,
        xiZhi: 0,
        zhongZhi: 0,
        duanZhi: 0,
        baoZhu: 0,
        industryCode: '',
        industryName: '',
        orderTag: 1,
        remarks: ''
      },
      dialogMaterialVisible: false,
      // 查询卷烟详情/新增素材的卷烟Id
      tobaccoId: ''
    }
  },
  created () {
    this.handleSearch()
  },
  methods: {
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
      // let options = Object.assign({}, this.page)
      ActTobaccoApi.list().then(res => {
        this.dataList = res.data
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
          ActTobaccoApi.save(this.temp).then(res => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('创建成功')
          })
        }
      })
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改保存
    updateData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          ActTobaccoApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除此卷烟?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActTobaccoApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        code: '',
        name: '',
        brandCode: '',
        brandName: '',
        priceTypeCode: '',
        priceTypeName: '',
        tar: '',
        nicotine: '',
        co: 0,
        type: '1',
        size: 20,
        discribe: '',
        length: 90,
        xiZhi: 0,
        zhongZhi: 0,
        duanZhi: 0,
        baoZhu: 0,
        industryCode: '',
        industryName: '',
        orderTag: 1,
        remarks: ''
      }
    },
    // 转换0和1，0为否，1为是
    formatTrueOrFalse (row, column) {
      if (row[column.property] === 0 || row[column.property] === '1') {
        return '是'
      } else if (row[column.property] === 0 || row[column.property] === '0') {
        return '否'
      } else {
        return ''
      }
    },
    // 素材管理
    handleMaterial (row) {
      this.$router.push({ name: 'ActMaterialMapping', query: { sourceId: row.id, sourceType: 'TOBACCO', sourceName: row.name } })
    },
    // 设置皮肤
    handleSkin (row) {
      this.$router.push({ name: 'ActTobaccoSkin', query: { sourceId: row.id, sourceType: 'TOBACCO', sourceName: row.name, cssUrl: row.cssUrl } })
    }
  }
}
</script>

<style lang="scss" scope>

</style>
