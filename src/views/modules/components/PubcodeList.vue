<template>
  <!-- pubcode组件，显示活动所有的pubCode，可以新增，也可以修改 -->
  <div style="padding-left: 1em;">
    <div v-for="(item) in dataList" :key="item.id" class="item-rule">
      <el-tag :title="item.name" class="tag-base" type="success"
        >{{item.name}}</el-tag>
      <i class="el-icon-delete icon-operate" style="color: #F56C6C;" title="删除"
        @click="handleDel(item)"></i>
      <i class="el-icon-edit icon-operate" style="color: #409EFF;" title="编辑"
        @click="handleEdit(item)"></i>
    </div>
    <el-tag class="tag-base el-icon-plus txt-center" type="primary" @click="handleAdd()">新增</el-tag>

    <!-- 弹窗·约束内容编辑 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible"
      :close-on-click-modal="false" width="768px" append-to-body>
      <edit-pub :formData="formData" :dialogStatus="dialogStatus" :actId="actId" @closeDialog="closeDialog"></edit-pub>
    </el-dialog>
  </div>
</template>

<script>
import * as PubCodeApi from '@/api/pubCode/PubCodeApi'
import EditPub from '@/views/modules/pubCode/components/EditPub'

export default {
  name: 'PubCodeList',
  components: { EditPub },
  props: {
    // 不显示的code，默认流程图的code
    ignoreCode: {
      type: Array,
      default: () => { return ['act:flowchart'] }
    },
    actId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataList: [],
      // 编辑对象
      formData: {},
      // 约束内容编辑
      dialogFormVisible: false,
      dialogStatus: 'create'
    }
  },
  created () {
    this.doSearch()
  },
  methods: {
    // 查询
    doSearch () {
      PubCodeApi.listByActId(this.actId).then(res => {
        // 过滤配置忽视的code
        this.dataList = res.data.filter(item => {
          let index = this.ignoreCode.findIndex(code => code === item.code)
          return index < 0
        })
      })
    },
    // 删除
    handleDel (item) {
      this.$confirm(`确认删除此信息：${item.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PubCodeApi.del(item.id).then(res => {
          this.$message.success('删除成功')
          this.doSearch()
        })
      }).catch(() => {
        // do nothing
      })
    },
    // 添加
    handleAdd (item) {
      this.formData = null
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 编辑当前参与约束
    handleEdit (item) {
      this.formData = Object.assign({}, item)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    closeDialog (flag) {
      if (flag) {
        this.doSearch()
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.icon-operate {
  margin-left: 12px;
  font-size: 24px;
}
.item-rule {
  display: flex;
  margin-bottom: 7px;
  align-items: center;
}
.tag-base {
  width: 250px;
  overflow: hidden;
}
</style>
