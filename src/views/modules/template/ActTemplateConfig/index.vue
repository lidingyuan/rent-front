<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">数据列表</div>
      <template slot="operates">
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="templateId" width="100" label="模板ID"></el-table-column>
        <el-table-column prop="style" width="100" label="样式数据，json序列化"></el-table-column>
        <el-table-column prop="data" width="100" label="素材列表或其它数据，json序列化"></el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-edit" @click.native="handleUpdate(scope.row)" >编辑</el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        <el-form-item label="模板ID" prop="templateId" :rules="[{required:true, message:'必须字段'}]">
          <el-input v-model="temp.templateId"></el-input>
        </el-form-item>
        <el-form-item label="样式数据，json序列化" prop="style" :rules="[{required:true, message:'必须字段'}]">
          <el-input v-model="temp.style"></el-input>
        </el-form-item>
        <el-form-item label="素材列表或其它数据，json序列化" prop="data" :rules="[{required:true, message:'必须字段'}]">
          <el-input v-model="temp.data"></el-input>
        </el-form-item>
        <el-form-item label="排序码" prop="orderTag" >
          <el-input-number v-model.number="temp.orderTag" :min="1"></el-input-number>
        </el-form-item>
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
import * as ActTemplateConfigApi from '@/api/template/ActTemplateConfigApi.js'
import TableWrapper from '@/components/TableWrapper'

export default {
  name: 'TemplateActTemplateConfig',
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
        templateId: '',
        style: '',
        data: '',
        orderTag: 1,
        remarks: ''
      }
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
      this.doSearch()
    },
    doSearch () {
      let options = Object.assign({}, this.page)
      ActTemplateConfigApi.listByPage(options).then(res => {
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
          ActTemplateConfigApi.save(this.temp).then(res => {
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
          ActTemplateConfigApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActTemplateConfigApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        templateId: '',
        style: '',
        data: '',
        orderTag: 1,
        remarks: ''
      }
    }
  }
}
</script>

<style lang="scss" scope>

</style>
