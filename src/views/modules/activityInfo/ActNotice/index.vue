<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">{{actName}} - 公告列表</div>
      <template slot="operates">
        <el-button v-if="$auth('activity:activity:notice:add')" size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe>
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" width="80" label="公告编号" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="title" width="200" label="公告标题" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="content" width="200" label="公告内容" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="beginTime" width="150" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" width="150" label="结束时间"></el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" show-overflow-tooltip ></el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="$auth('activity:activity:notice:mod')" plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="$auth('activity:activity:notice:del')" plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="768px">
      <notice-edit :noticeTemp="temp" source="list" v-if="dialogFormVisible" :status="dialogStatus" @handleCloseEdit="handleCloseEdit"></notice-edit>
    </el-dialog>

  </div>
</template>

<script>
import * as ActNoticeApi from '@/api/activityInfo/ActNoticeApi.js'
import TableWrapper from '@/components/TableWrapper'
import NoticeEdit from './components/NoticeEdit'

export default {
  name: 'ActNotice',
  components: { TableWrapper, NoticeEdit },
  data () {
    return {
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: {
        id: '',
        actId: '',
        code: '',
        title: '',
        content: '',
        beginTime: '',
        endTime: '',
        orderTag: 1,
        remarks: ''
      },
      // 活动ID
      actId: '',
      actName: ''
    }
  },
  created () {
    this.actId = this.$route.query.actId
    this.actName = this.$route.query.actName
    this.temp.actId = this.actId
    this.handleSearch()
  },
  methods: {
    // ---查询列表
    handleSearch () {
      this.page.current = 1
      this.page.total = 0
      this.doSearch()
    },
    doSearch () {
      // let options = Object.assign({}, this.page)
      let options = {
        actId: this.actId
      }
      ActNoticeApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    // ---编辑
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('确认删除此公告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ActNoticeApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.handleSearch()
        })
      })
    },
    resetTemp () {
      this.temp = {
        id: '',
        actId: this.actId,
        code: '',
        title: '',
        content: '',
        beginTime: '',
        endTime: '',
        orderTag: 1,
        remarks: ''
      }
    },
    // 格式化发布状态。0待发布，1已发布
    formatNoticeStatus (row) {
      if (row.status === 0 || row.status === '0') {
        return '待发布'
      } else if (row.status === 1 || row.status === '1') {
        return '已发布'
      } else {
        return ''
      }
    },
    handleCloseEdit () {
      this.dialogFormVisible = false
      this.handleSearch()
    }
  }
}
</script>

<style lang="scss" scope>
</style>
