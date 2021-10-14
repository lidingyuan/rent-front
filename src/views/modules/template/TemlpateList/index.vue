<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">模板列表</div>
      <template slot="operates">
        <!-- <el-button size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button> -->
      </template>

      <!-- 列表 -->
      <div class="template-list">
        <div v-for="item in templateList" :key="item.id" class="act-item" @click="handleCreateAct(item)">
          <div class="act-img">
            <img :src="item.coverUrl">
          </div>
          <!-- 活动信息展示 -->
          <div class="act-info">
            <div class="act-name" :title="item.name">{{item.name}}</div>
          </div>
        </div>
      </div>

      <!-- 页码 -->
      <template slot="footer">
        <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
          layout="total, prev, pager, next, jumper" >
        </el-pagination>
      </template>
    </table-wrapper>

    <!-- 活动编辑框 -->
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="768px">
      <!-- 活动编辑 -->
      <edit-act :templateId="templateId" :formData="formData" :editStatus="dialogStatus" @closeDialog="dialogFormVisible = false"></edit-act>
    </el-dialog>
  </div>
</template>

<script>
import TableWrapper from '@/components/TableWrapper'
import * as ActTemplateApi from '@/api/template/ActTemplateApi'
import EditAct from './components/EditAct'
export default {
  name: 'TemplateList',
  components: { TableWrapper, EditAct },
  data () {
    return {
      //
      page: {
        current: 1,
        total: 0,
        size: 50
      },
      templateList: [],
      activeName: 'page',
      dialogVisible: false,
      dialogFormVisible: false,
      dialogStatus: 'create',
      templateId: '',
      // 编辑的表单数据
      formData: null
    }
  },
  created () {
    //
    ActTemplateApi.listByPage(this.page).then(res => {
      this.templateList = res.data.records
    })
  },
  methods: {
    //
    // 翻页
    handleCurrentChange (current) {
      this.page.current = current
      this.$table.scrollTopAfterPage(this.$refs.table)
      this.doSearch()
    },
    doSearch () {
      let options = { ...this.page }
      ActTemplateApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    handleCreateAct (row) {
      this.templateId = row.id
      this.showActGuide = true
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // const { href } = this.$router.resolve({
      //   name: 'templatePage',
      //   query: { id: row.id }
      // })
      // window.open(href, '_blank')
    },
    handleUpdate (row) {
      this.templateId = row.id
      this.dialogVisible = true
    },
    handleCreate () {
      this.dialogFormVisible = 'create'
      this.formData = null
      this.dialogFormVisible = true
    },
    handleDelete () {}
  }
}
</script>

<style lang='scss' scoped>
.template-list {
  display: flex;
  flex-wrap: wrap;
  font-size: 0.85em;
  .act-item {
    position: relative;
    margin: 30px;
    padding: 20px;
    border-radius: 15px;
    background: #fff;
    width: 200px;
    height: 360px;
    cursor: pointer;
    &:hover{
      margin: 20px;
      padding: 25px;
      width: 220px;
      height: 380px;
    }
    .act-img{
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        max-width: 100%;
        max-height: 100%;
      }
    }
    .act-info {
      position: relative;
      line-height: 1.8em;
      text-align: center;
      .act-name {
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
