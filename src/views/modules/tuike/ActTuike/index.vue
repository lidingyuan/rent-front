<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">抽奖列表</div>
      <template slot="operates">
        <act-select :actId.sync="actId"></act-select>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button v-if="$auth('activity:lucky:lucky:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actId" width="80" label="活动ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" width="200" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tobaName" width="200" label="卷烟" show-overflow-tooltip></el-table-column>
        <el-table-column prop="firstOnly" width="60" label="奖励次数" align="center" :formatter="fistOnlyFormatter"></el-table-column>
        <el-table-column prop="rewardsPoint" width="70" label="用户奖励积分" align="right"></el-table-column>
        <el-table-column prop="inviterPoint" width="70" label="邀请人奖励积分" align="right"></el-table-column>
        <el-table-column prop="followPoint" width="70" label="关注的人奖励积分" align="right"></el-table-column>
        <el-table-column prop="enable" width="100" label="状态" align="center" :formatter="statusFormatter"></el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="$auth('activity:lucky:lucky:mod')" icon="el-icon-edit" @click.native="handleUpdate(scope.row)" >编辑</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:lucky:lucky:del')" icon="el-icon-delete" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item>
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
      <edit-tuike v-if="dialogFormVisible"
        :formData="formData"
        :editStatus="dialogStatus"
        :actData="{}"
        @closeDialog="closeDialog"></edit-tuike>
    </el-dialog>
  </div>
</template>

<script>
import * as ActTuikeApi from '@/api/tuike/ActTuikeApi.js'
import * as ActConfigApi from '@/api/activityInfo/ActConfigApi.js'
import * as ActTobaccoApi from '@/api/baseInfo/ActTobaccoApi.js'

import TableWrapper from '@/components/TableWrapper'
import ActSelect from '@/views/modules/components/ActSelect'
import EditTuike from './components/EditTuike'

export default {
  name: 'ActTuike',
  components: { TableWrapper, ActSelect, EditTuike },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      actId: '',
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
      let options = { ...this.page, actId: this.actId }
      // 匹配卷烟id添加卷烟 runTime(n^3) 数据数量太多不可用 建议优化
      ActTuikeApi.listByPage(options).then(res => {
        ActConfigApi.listByPage({ size: -1, current: 1, type: 'TUIKE' }).then(res2 => {
          ActTobaccoApi.list().then(res3 => {
            const data = res.data.records
            const configs = res2.data.records
            const tobas = res3.data
            data.forEach(toba1 => {
              configs.forEach(toba2 => {
                if (toba1.actId === toba2.id) {
                  const tobaIds = toba2.tobaId.replace(/"/g, '').slice(1, -1).split(', ')
                  let tobaName = ''
                  tobaIds.forEach(toba => {
                    tobas.forEach(toba3 => {
                      if (toba === toba3.id) {
                        tobaName += toba3.name + (toba3.type * 1 === 1 ? '(包码)' : '(条码)') + ', '
                      }
                    })
                  })
                  toba1.tobaName = tobaName.slice(0, -2)
                }
              })
            })
            this.$objects.copyProperties(res.data, this.page)
            this.dataList = res.data.records
          })
        })
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
      this.$confirm('确认删除此规则?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActTuikeApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    statusFormatter (row, column, cellValue, index) {
      if (cellValue === 0 || cellValue === '0') {
        return '停用'
      } else if (cellValue === 1 || cellValue === '1') {
        return '启用'
      } else {
        return ''
      }
    },
    fistOnlyFormatter (row, column, cellValue, index) {
      if (cellValue === 0 || cellValue === '0') {
        return '多次'
      } else if (cellValue === 1 || cellValue === '1') {
        return '1次'
      } else {
        return ''
      }
    },
    // ----
    // 关闭弹窗
    closeDialog (flag) {
      if (flag) {
        this.doSearch()
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scope>
.el-table td .gutter, .el-table th .gutter{
  display: none;
}
</style>
