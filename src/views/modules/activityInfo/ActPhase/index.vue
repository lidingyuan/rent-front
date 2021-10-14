<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">{{actName}} - 环节列表</div>
      <template slot="operates">
        <el-button v-if="$auth('activity:activity:phase_mapping:add')" type="primary" class="el-icon-plus" size="small" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe style="positive:relative">
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="actId" width="80" label="活动ID" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="phaseId" width="80" label="环节ID" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="phaseName" width="180" label="环节名称" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="entryUrl" width="280" label="环节入口地址" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="phaseType" width="80" label="环节类型" ></el-table-column>
        <el-table-column prop="orderTag" width="60" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" show-overflow-tooltip ></el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
             <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$auth('activity:activity:phase_mapping:mod')" @click.native="handleUpdate(scope.row)" >编辑</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:phase_mapping:del')" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:phase_rule:get')" divided @click.native="handleManageRule(scope.row)" >环节约束管理</el-dropdown-item>
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
      <edit-phase v-if="dialogFormVisible" :formData="formData" :editStatus="dialogStatus" :actData="{actId,actName}"
        @closeDialog="closeDialog"></edit-phase>
    </el-dialog>

  </div>
</template>

<script>
import * as ActPhaseApi from '@/api/activityInfo/ActPhaseApi.js'

import TableWrapper from '@/components/TableWrapper'
import EditPhase from './components/EditPhase'

export default {
  name: 'ActPhase',
  components: { TableWrapper, EditPhase },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 1000
      },
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      formData: {
        id: '',
        phaseId: '',
        phaseName: '',
        phaseType: '',
        entryUrl: '',
        orderTag: 1,
        remarks: ''
      },
      actId: '',
      actName: ''
    }
  },
  created () {
    this.actId = this.$route.query.actId
    this.actName = this.$route.query.actName
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
      ActPhaseApi.list({ actId: this.actId }).then(res => {
        this.dataList = res.data
      })
    },
    // ---编辑
    handleCreate () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('确认删除此环节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActPhaseApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    // 关闭弹窗
    closeDialog (flag) {
      if (flag) {
        this.doSearch()
      }
      this.dialogFormVisible = false
    },
    // ---环节约束
    handleManageRule (row) {
      this.$router.push({
        name: 'ActPhaseRule',
        query: {
          actId: this.actId,
          actName: this.actName,
          phaseId: row.phaseId,
          phaseName: row.phaseName,
          phaseType: row.phaseType
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>

</style>
