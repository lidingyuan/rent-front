<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">地区列表</div>
      <template slot="operates">
        <el-select size="small" v-model="provCode" @change="handleSearch">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in provList" :key="item.provCode" :value="item.provCode" :label="item.provName"></el-option>
        </el-select>
        <el-button v-if="$auth('activity:basics:district:add')" size="small" icon="el-icon-plus" @click="handleCreate" type="primary">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="provCode" width="100" label="省份编码"></el-table-column>
        <el-table-column prop="provName" width="150" label="省份名称"></el-table-column>
        <el-table-column prop="cityCode" width="100" label="地市编码"></el-table-column>
        <el-table-column prop="cityName" width="200" label="地市名称"></el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="$auth('activity:basics:district:mod')" plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="$auth('activity:basics:district:del')" plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
            layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="768px">
      <el-form size="medium" label-width="100px" ref="dataForm" :model="temp" status-icon>
        <el-row>
          <el-col :span="10">
            <el-form-item label="省份编码" prop="provCode" :rules="[{required:true, message:'必须字段，请输入正确的编码', pattern: /^[1-9][0-9]{5}$/}]">
              <el-input v-model="temp.provCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="省份名称" prop="provName" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="temp.provName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地市编码" prop="cityCode" :rules="[{required:true, message:'必须字段，请输入正确的编码', pattern: /^[1-9][0-9]{5}$/}]">
              <el-input v-model="temp.cityCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="地市名称" prop="cityName" :rules="[{required:true, message:'必须字段'}]">
              <el-input v-model="temp.cityName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序码" prop="orderTag" >
              <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="temp.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as ActDistrictApi from '@/api/baseInfo/ActDistrictApi.js'
import TableWrapper from '@/components/TableWrapper'

export default {
  name: 'ActDistrict',
  components: { TableWrapper },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      provCode: '',
      // ---数据
      provList: [],
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        provCode: '',
        provName: '',
        cityCode: '',
        cityName: '',
        orderTag: 1,
        remarks: ''
      }
    }
  },
  created () {
    ActDistrictApi.provList().then(res => {
      this.provList = res.data
    })
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
      let options = Object.assign({}, this.page, { provCode: this.provCode })
      ActDistrictApi.list(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
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
          ActDistrictApi.save(this.temp).then(res => {
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
          ActDistrictApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除此地市数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActDistrictApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        provCode: '',
        provName: '',
        cityCode: '',
        cityName: '',
        orderTag: 1,
        remarks: ''
      }
    }
  }
}
</script>

<style lang="scss" scope>
.el-table td.gutter, .el-table th.gutter{
  display:none;
}
</style>
