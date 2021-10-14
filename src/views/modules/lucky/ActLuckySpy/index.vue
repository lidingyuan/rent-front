<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">{{luckyName}}</div>
      <template slot="operates">
        <el-input v-model="userId" size="small" placeholder="输入用户ID" clearable style="width:250px;"></el-input>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button v-if="$auth('activity:lucky:spy:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="luckyId" width="100" label="抽奖ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userId" width="100" label="用户ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="beginTime" width="140" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" width="140" label="截止时间"></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" ></el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="$auth('activity:lucky:spy:mod')" plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="$auth('activity:lucky:spy:del')" plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
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
        <el-form-item v-if="dialogStatus === 'create'" label="用户ID" prop="userId" :rules="[{required:true, message:'必须字段'}]">
          <el-input type="textarea" :autosize="{minRows:4, maxRows:6}" v-model="temp.userId"></el-input>
          &nbsp; 填入userId，一行一个，最多100个
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update'" label="用户ID" prop="userId" :rules="[{required:true, message:'必须字段'}]">
          <el-input v-model="temp.userId" placeholder="请填入userId" readonly ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="beginTime" :rules="[{required:true, message:'必须字段'}]">
              <el-date-picker v-model="temp.beginTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00" :clearable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止时间" prop="endTime" :rules="[{required:true, message:'必须字段'}]">
              <el-date-picker v-model="temp.endTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
                default-time="23:59:59" :clearable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks"></el-input>
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
import * as ActLuckySpyApi from '@/api/lucky/ActLuckySpyApi.js'
import TableWrapper from '@/components/TableWrapper'

export default {
  name: 'ActLuckySpy',
  components: { TableWrapper },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      luckyId: '',
      luckyName: '',
      type: 1,
      userId: '',
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        luckyId: this.luckyId,
        type: this.type,
        userId: '',
        beginTime: '',
        endTime: '',
        orderTag: 1,
        remarks: ''
      }
    }
  },
  created () {
    // 路由参数
    if (this.$route.query.luckyId) {
      this.luckyId = this.$route.query.luckyId
      this.luckyName = this.$route.query.luckyName
      this.type = parseInt(this.$route.query.type)
      this.luckyName += this.type === 1 ? '-白名单管理' : '-黑名单管理'
      this.handleSearch()
    } else {
      this.$message.error('缺少路由参数：luckyId')
    }
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
      let options = Object.assign({ luckyId: this.luckyId, type: this.type, userId: this.userId }, this.page)
      ActLuckySpyApi.listByPage(options).then(res => {
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
          ActLuckySpyApi.save(this.temp).then(res => {
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
          ActLuckySpyApi.update(tempData).then(() => {
            this.handleSearch()
            this.dialogFormVisible = false
            this.$message.success('更新成功')
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除此标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActLuckySpyApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        luckyId: this.luckyId,
        type: this.type,
        userId: '',
        beginTime: '',
        endTime: '',
        orderTag: 1,
        remarks: ''
      }
    }
  }
}
</script>

<style lang="scss" scope>

</style>
