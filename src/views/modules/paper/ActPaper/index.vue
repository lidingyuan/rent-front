<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">问卷列表</div>
      <template slot="operates">
        <!-- 活动选择组件 -->
        <act-select :actId.sync="actId" :actName.sync="actName"></act-select>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button v-if="$auth('activity:paper:paper:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actId" width="80" label="活动ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" width="80" label="问卷编码" align="center"></el-table-column>
        <el-table-column prop="name" width="150" label="问卷名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="beginTime" width="140" label="开始时间" sortable></el-table-column>
        <el-table-column prop="endTime" width="140" label="结束时间"></el-table-column>
        <el-table-column prop="itemNum" width="100" label="题目个数" align="center">
          <template slot-scope="scope">
            {{scope.row.itemNum === -1 ? '全部' : scope.row.itemNum}}
          </template>
        </el-table-column>
        <el-table-column prop="completed" width="80" label="完整填写" align="center" :formatter="yesOrNoFormatter" ></el-table-column>
        <el-table-column prop="rewritable" width="80" label="多次提交" align="center" :formatter="yesOrNoFormatter"></el-table-column>
        <el-table-column prop="open" width="80" label="开放填写" align="center" :formatter="yesOrNoFormatter"></el-table-column>
        <el-table-column prop="verify" width="80" label="自动校验" align="center" :formatter="yesOrNoFormatter"></el-table-column>
        <el-table-column prop="status" width="70" label="状态" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$auth('activity:paper:paper:mod')" icon="el-icon-edit" @click.native="handleUpdate(scope.row)" >编辑</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:paper:paper:del')" icon="el-icon-delete" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:phase_rule:get')" divided @click.native="handleManageRule(scope.row)" >参与约束管理</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:paper:question:get')" icon="el-icon-headset" divided @click.native="handleManageQuestion(scope.row)" >题库管理</el-dropdown-item>
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
      :close-on-click-modal="false" width="768px" append-to-body>
      <edit-paper v-if="dialogFormVisible" :formData="formData" :editStatus="dialogStatus" :actData="{}"
        @closeDialog="dialogFormVisible = false"></edit-paper>
    </el-dialog>

  </div>
</template>

<script>
import * as ActPaperApi from '@/api/paper/ActPaperApi.js'
import TableWrapper from '@/components/TableWrapper'
import ActSelect from '../../components/ActSelect'
import EditPaper from './components/EditPaper'

export default {
  name: 'ActPaper',
  components: { TableWrapper, ActSelect, EditPaper },
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
      formData: null,
      actId: '',
      actName: ''
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
      let options = Object.assign({}, this.page, { actId: this.actId })
      ActPaperApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
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
      // 在开始时间之后不允许删除问卷
      let beginTime = new Date(row.beginTime)
      let currentTime = new Date()
      if (currentTime < beginTime) {
        this.$confirm('确认删除此问卷?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ActPaperApi.del(row.id).then(res => {
            this.$message.success('删除成功')
            this.handleSearch()
          })
        })
      } else {
        this.$message.info('问卷已过开始时间，不允许删除')
      }
    },
    // 题库管理
    handleManageQuestion (row) {
      this.$router.push({ name: 'ActPaperQuestion', query: { paperId: row.id, paperName: row.name } })
    },
    // ---formatters
    yesOrNoFormatter (row, column, cellValue, index) {
      if (cellValue === 1 || cellValue === '1') {
        return '是'
      } else {
        return '否'
      }
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
          actName: '',
          phaseId: row.id,
          phaseName: row.name,
          phaseType: 'PAPER'
        }
      })
    }
  },
  watch: {
    dialogFormVisible (newVal) {
      if (this.showExpand) {
        this.$emit('closeDialog')
      }
    }
  }
}
</script>

<style lang="scss" scope>

</style>
