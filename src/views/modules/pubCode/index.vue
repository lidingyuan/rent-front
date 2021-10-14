<template>
  <div>
    <table-wrapper :filterable="false" :excel="false" :expand="expand">
      <!-- 标题 -->
      <div slot="title">公共配置列表</div>
      <template slot="operates">
        <el-select size="small" v-model="searchKey.code" placeholder="配置编码" allow-create filterable default-first-option>
          <el-option label="扫码抽奖活动规则" value="act:lucky:rule"></el-option>
          <el-option label="集盒活动规则" value="act:boxcollect:rule"></el-option>
          <el-option label="扫码抽奖地址提示" value="act:lucky:address"></el-option>
        </el-select>
        <el-button size="small" icon="el-icon-plus" @click="handleCreate">新增</el-button>
        <el-button size="small" type="success" icon="el-icon-document" @click="dialogExplain = true">配置参考说明</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="code" width="200" label="编码" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="name" width="300" label="名称" show-overflow-tooltip ></el-table-column>
        <el-table-column width="300" label="操作" align="center">
          <template slot-scope="scope">
            <el-button plain type="primary" size="mini" @click.native="handleUpdate(scope.row)">编辑</el-button>
            <!-- <el-button plain type="danger" size="mini" @click.native="handleDelete(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </table-wrapper>

    <!-- 编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible"
      :close-on-click-modal="false" width="768px" append-to-body>
      <edit-pub v-if="dialogFormVisible" :formData="formData" @closeDialog="closeDialog"></edit-pub>
    </el-dialog>

    <!-- 说明弹窗 -->
    <el-dialog :visible.sync="dialogExplain" :close-on-click-modal="false" width="768px" class="dialog-explain" append-to-body>
      <div class="explain-title">公共代码配置说明</div>
      <div class="p-line">
        <div class="line-title txt-primary">使用场景</div>
        <div class="line-explain">
          使用情况较少，使用于配置一些公共的代码(非软件开发人员理解的的代码)，例如配置一条代表性别的公共代码，01表示男性，02表示女性；
          目前使用到的有：配置活动如扫码抽奖的活动规则信息，集盒活动规则信息，另外还有扫码抽奖奖品地址弹窗文字描述和积分来源中显示的活动名称；
          <br>不是所有的活动都需要在此配置活动规则，我们建议只有像扫码抽奖，集盒这种系列类的活动，活动规则形式固定，每个活动中的活动规则只有些许文字描述有出入，
          适合在此配置活动规则；像单个单个的问卷或者抽奖或者其他活动，例如中秋调研问卷，国庆抽奖，不需要在此配置活动规则，直接前端开发人员写死就好
        </div>
        <div class="line-title txt-primary">关于code命名</div>
        <div class="line-explain">
          code不能随意命名
          <br>错误示范：01，或者activity，建议模块区分命名易理解，正确示范：<span class="block-code">act:lucky:rule</span>，可理解为抽奖活动的活动规则；
          一个活动中相同code编码值仅能有一条
          <br>已使用的code值：<span class="block-code">act:lucky:rule</span>(扫码抽奖活动规则)，act:lucky:address(扫码抽奖奖品地址弹窗文字描述)，
          <span class="block-code">act:boxcollect:rule</span>(集盒活动规则)，
          在选择自定义文本中，输入的code不建议使用上述已被约定过的值
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as PubCodeApi from '@/api/pubCode/PubCodeApi'
import TableWrapper from '@/components/TableWrapper'
import EditPub from './components/EditPub'

export default {
  name: 'ActNotice',
  components: { TableWrapper, EditPub },
  data () {
    return {
      // 是否显示最大化,作为弹窗不出现
      expand: true,
      // 查询参数
      searchKey: {
        // 扫码样例
        actId: '',
        code: ''
      },
      // ---数据
      dataList: [],
      // ---新增、修改
      dialogFormVisible: false,
      dialogStatus: 'create',
      formData: {
        id: '',
        actId: '',
        code: '',
        name: '',
        content: '',
        remarks: ''
      },
      // 说明弹窗
      dialogExplain: false
    }
  },
  created () {
    if (!this.$route.query.actId) {
      this.$router.replace('/activity/manage')
      return
    }
    this.initQueryParams()
    this.doSearch()
  },
  methods: {
    // 初始化路由参数
    initQueryParams () {
      // 作为页签打开
      this.searchKey.actId = this.$route.query.actId
      this.searchKey.actName = this.$route.query.actName
      this.expand = true
      this.formData.actId = this.$route.query.actId
    },
    doSearch () {
      if (this.searchKey.code) {
        PubCodeApi.getByCode(this.searchKey).then(res => {
          this.dataList = [res.data]
        })
      } else {
        PubCodeApi.listByActId(this.searchKey.actId).then(res => {
          this.dataList = res.data.filter(item => item.code !== 'act:flowchart')
        })
      }
    },
    // ---新增
    handleCreate () {
      for (let key in this.formData) {
        this.formData[key] = ''
      }
      this.formData.actId = this.searchKey.actId
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.formData = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('确认删除此数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PubCodeApi.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.doSearch()
        })
      })
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

<style lang="scss" scope>
</style>
