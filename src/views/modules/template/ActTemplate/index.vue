<template>
  <div class="template-list">
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">模板列表</div>
      <template slot="operates">
        <el-button size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="templateList" size="small" height="100%" border stripe ref="table">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="name" width="200" label="模板名称" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" show-overflow-tooltip ></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
           <template slot-scope="scope">
            <el-button plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑模板</el-button>
            <el-button plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-wrapper>
    <el-dialog
      title="编辑模板"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="页面管理" name="page">
          <ActTemplatePage :templateId="templateId"></ActTemplatePage>
        </el-tab-pane>
        <el-tab-pane label="组件管理" name="component">
          <ActTemplateComponent :templateId="templateId"></ActTemplateComponent>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import TableWrapper from '@/components/TableWrapper'
import * as ActTemplateApi from '@/api/template/ActTemplateApi'
import ActTemplatePage from '../ActTemplatePage'
import ActTemplateComponent from '../ActTemplateComponent'
export default {
  name: 'TemplateList',
  components: { TableWrapper, ActTemplatePage, ActTemplateComponent },
  data () {
    return {
      //
      pageParam: { current: 1, size: 20, total: 0 },
      templateList: [],
      activeName: 'page',
      dialogVisible: false,
      dialogFormVisible: false,
      dialogStatus: 'create',
      templateId: '',
      // 显示创建活动说明弹窗
      showActGuide: false,
      // 编辑的表单数据
      formData: null
    }
  },
  created () {
    //
    ActTemplateApi.listByPage(this.pageParam).then(res => {
      this.templateList = res.data.records
    })
  },
  methods: {
    //
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
      this.showActGuide = false
      this.dialogFormVisible = true
    },
    handleDelete () {}
  }
}
</script>

<style lang='scss' scoped>
</style>
