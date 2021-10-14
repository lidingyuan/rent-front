<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">抽奖列表</div>
      <template slot="operates">
        <el-input size="small" v-model="searchKey.name" placeholder="请输入抽奖名称" style="width: 200px"></el-input>
        <act-select :actId.sync="actId"></act-select>
        <el-select size="small" v-model="searchKey.status" placeholder="抽奖状态" style="width: 150px">
          <el-option label="全部" :value="-99"></el-option>
          <el-option label="进行中" :value="1"></el-option>
          <el-option label="未开始" :value="2"></el-option>
          <el-option label="已结束" :value="0"></el-option>
        </el-select>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button v-if="$auth('activity:lucky:lucky:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actId" width="80" label="活动ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" width="140" label="抽奖名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="beginTime" width="140" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" width="140" label="结束时间"></el-table-column>
        <el-table-column prop="refreshPoolPre" width="100" label="奖池结余处理" :formatter="poolPreFormatter"></el-table-column>
        <el-table-column prop="status" width="100" label="状态" align="center" :formatter="statusFormatter"></el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$auth('activity:lucky:lucky:mod')" icon="el-icon-edit" @click.native="handleUpdate(scope.row)" >编辑</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:lucky:lucky:del')" icon="el-icon-delete" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:phase_rule:get')" icon="el-icon-s-check" divided @click.native="handleManageRule(scope.row)" >参与约束管理</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:lucky:prize:get')" divided icon="el-icon-s-grid" @click.native="handleManagePrize(scope.row)" >奖项管理</el-dropdown-item>
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
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible"
      :close-on-click-modal="false" width="768px">
      <edit-lucky v-if="dialogFormVisible" :formData="formData" :editStatus="dialogStatus" :actData="{}"
        @closeDialog="closeDialog"></edit-lucky>
    </el-dialog>
  </div>
</template>

<script>
import * as ActLuckyApi from '@/api/lucky/ActLuckyApi.js'
import TableWrapper from '@/components/TableWrapper'
import ActSelect from '@/views/modules/components/ActSelect'
import EditLucky from './components/EditLucky'

export default {
  name: 'LuckyActLucky',
  components: { TableWrapper, ActSelect, EditLucky },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      actId: '',
      searchKey: {
        name: '',
        status: 1
      },
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      formData: null
    }
  },
  created () {
    this.initQueryParams()
    this.handleSearch()
  },
  methods: {
    // 初始化路由参数
    initQueryParams () {
      // 作为页签打开
      if (this.$route && this.$route.query.actId) {
        this.actId = this.$route.query.actId
      }
    },
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
      let options = { ...this.page, ...this.searchKey, actId: this.actId }
      if (options.status === -99) {
        delete options.status
      }
      ActLuckyApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    // ---编辑
    handleCreate () {
      this.formData = null
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('确认删除此抽奖?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActLuckyApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    // ---奖项管理
    handleManagePrize (row) {
      this.$router.push({
        name: 'ActLuckyPrize',
        query: { luckyId: row.id,
          luckyName: row.name,
          beginTime: row.beginTime,
          endTime: row.endTime }
      })
    },
    // ---奖池管理
    handleManagePool (row) {
      this.$router.push({ name: 'ActLuckyPrizePool', query: { luckyId: row.id, luckyName: row.name } })
    },
    // ---名单管理
    handleManageSpy (row, type) {
      this.$router.push({ name: 'ActLuckySpy', query: { luckyId: row.id, luckyName: row.name, type } })
    },
    statusFormatter (row, column, cellValue, index) {
      if (cellValue === 0 || cellValue === '0') {
        return '草稿'
      } else if (cellValue === 1 || cellValue === '1') {
        return '启用'
      } else if (cellValue === 2 || cellValue === '2') {
        return '终止'
      } else {
        return ''
      }
    },
    poolPreFormatter (row, column, cellValue, index) {
      if (cellValue === 0 || cellValue === '0') {
        return '不顺延'
      } else if (cellValue === 1 || cellValue === '1') {
        return '顺延至下期'
      } else {
        return ''
      }
    },
    // 关闭弹窗
    closeDialog (flag) {
      if (flag) {
        this.doSearch()
      }
      this.dialogFormVisible = false
    },
    handleManageRule (row) {
      this.$router.push({
        name: 'ActPhaseRule',
        query: {
          actId: row.actId,
          phaseId: row.id,
          phaseName: row.name,
          phaseType: 'LUCKY'
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.el-table td .gutter, .el-table th .gutter{
  display: none;
}
</style>
