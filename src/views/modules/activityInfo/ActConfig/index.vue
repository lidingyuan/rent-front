<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">活动列表</div>
      <template slot="operates">
        <el-input size="small" v-model="searchKey.name" placeholder="请输入活动名称" style="width: 300px"></el-input>
        <el-select size="small" v-model="searchKey.status" placeholder="活动状态" style="width: 150px;">
          <el-option label="全部" :value="-99"></el-option>
          <el-option label="未开始" :value="2"></el-option>
          <el-option label="进行中" :value="1"></el-option>
          <el-option label="已结束" :value="0"></el-option>
        </el-select>
        <el-select size="small" v-model="searchKey.type" placeholder="活动类型" style="width:200px">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in actTypeList" :key="item.id" :value="item.code" :label="item.name"></el-option>
        </el-select>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button v-if="$auth('activity:activity:config:add')" size="small" icon="el-icon-plus" @click="handleShowGuide">新增</el-button>
      </template>

      <!-- 列表 -->
      <el-table :data="dataList" size="small" height="100%" border stripe ref="table">
        <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
        <el-table-column prop="id" width="80" label="ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" width="200" label="活动名称" show-overflow-tooltip >
          <template slot-scope="scope">
            <i class="el-icon-document-copy" style="color:#409eff;margin-right:5px;" @click="handleCopyActUrl(scope.row)"></i>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column prop="name" width="100" label="获取地理位置" align="center">
          <template slot-scope="scope">
            {{scope.row.location ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="districtType" width="150" label="活动区域类型">
          <template slot-scope="scope">
            {{scope.row.districtType === 1 ? '零售户归属区域' : '实时定位区域' }}
          </template>
        </el-table-column>
        <el-table-column prop="advanceTime" width="150" label="活动预热时间"></el-table-column>
        <el-table-column prop="beginTime" width="150" label="活动开始时间"></el-table-column>
        <el-table-column prop="endTime" width="150" label="活动结束时间"></el-table-column>
        <el-table-column prop="expiredTime" width="150" label="活动失效时间"></el-table-column>
        <el-table-column prop="target" width="80" label="参与对象" :formatter="formatTarget"></el-table-column>
        <el-table-column prop="status" width="80" label="活动状态" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
        <el-table-column prop="remarks" width="200" label="备注" show-overflow-tooltip ></el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
           <template slot-scope="scope">
            <el-dropdown :hide-on-click="true">
              <el-button size="mini" type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item v-if="$auth('activity:activity:config:mod')" icon="el-icon-setting" @click.native="handleChangeRoute(scope.row, 'FlowConfig')"
                  style="color: #67C23A;" >活动配置</el-dropdown-item> -->
                <el-dropdown-item v-if="$auth('activity:activity:config:mod')" icon="el-icon-edit" @click.native="handleTemplate(scope.row)" style="color:#409EFF;">模板修改</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:config:mod')" icon="el-icon-edit" @click.native="handleUpdate(scope.row)" style="color:#409EFF;">编辑</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:config:del')" icon="el-icon-delete" @click.native="handleDelete(scope.row)" style="color:#F56C6C;">删除</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:config:mod')" icon="el-icon-edit" @click.native="goActivityConfig(scope.row)" style="color:#409EFF;">活动配置</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:basics:material_mapping:get')" icon="el-icon-picture" divided @click.native="handleMaterial(scope.row)" style="color:#67C23A;">活动素材管理</el-dropdown-item>
                <!-- <el-dropdown-item v-if="$auth('activity:activity:notice:get')" disabled divided @click.native="handleChangeRoute(scope.row, 'ActNotice')" >活动公告管理</el-dropdown-item> -->
                <el-dropdown-item v-if="$auth('activity:activity:phase_mapping:get')" divided icon="el-icon-s-operation" @click.native="handleChangeRoute(scope.row, 'ActPhase')" style="color:#409EFF;">活动环节管理</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:phase_rule:get')" divided icon="el-icon-thumb" @click.native="handleChangeRoute(scope.row, 'ActPhaseRule')" style="color:#409EFF;">活动参与约束</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:visible_rule:get')" icon="el-icon-view" @click.native="handleChangeRoute(scope.row, 'ActConfigRule')" style="color:#67C23A;">列表可见约束</el-dropdown-item>
                <el-dropdown-item v-if="$auth('activity:activity:config:mod')" icon="el-icon-tickets" divided @click.native="handleChangeRoute(scope.row, 'pubCodeList')" style="color:#409EFF;">活动公共配置</el-dropdown-item>
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

    <!-- 活动编辑框 -->
    <el-dialog :title="dialogStatus | dialogTitleFilter" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="768px">
      <!-- 说明内容 -->
      <div v-if="showActGuide">
        <h3>关于活动创建的一些说明</h3>
        <div>
          <ul class="li">
            <li>创建活动步骤：1创建活动（活动基础信息）；2维护活动公告；3添加活动参与约束；4添加活动可见约束</li>
            <!-- TODO公告内容 -->
            <li>活动公告: (功能开发中)</li>
            <li>活动参与约束：设置活动参与条件。例如：限制注册的用户才可参与，非注册用户不可参与。</li>
            <li>活动可见约束：设置活动是否显示在用户的活动列表中。例如：限制注册用户的活动列表中显示，非注册用户的活动列表不显示。</li>
            <li>其他：在新增(或者编辑修改)活动过程中，没有显示新增的地区、卷烟信息，请刷新当前页面，再次进入新增(或者编辑修改)</li>
          </ul>
        </div>
        <div style="text-align:right">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreate">创建活动</el-button>
        </div>
      </div>
      <!-- 活动编辑 -->
      <edit-act v-else :formData="formData" :editStatus="dialogStatus" @closeDialog="closeDialog"></edit-act>
    </el-dialog>
  </div>
</template>

<script>
import * as ActConfigApi from '@/api/activityInfo/ActConfigApi.js'

import TableWrapper from '@/components/TableWrapper'
import EditAct from './components/EditAct'

export default {
  name: 'ActConfig',
  components: { TableWrapper, EditAct },
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
      // 查询条件
      searchKey: {
        name: '',
        status: 1,
        type: ''
      },
      // 显示创建活动说明弹窗
      showActGuide: false,
      // 编辑的表单数据
      formData: null
    }
  },
  computed: {
    // 活动类型
    actTypeList () {
      return this.$store.getters['baseData/actTypeList']
    }
  },
  created () {
    this.handleSearch()
  },
  watch: {
    dialogFormVisible (newVal) {
      if (!newVal) {
        this.showActGuide = true
      }
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
      let options = { ...this.page, ...this.searchKey }
      if (options.status === -99) {
        delete options.status
      }
      ActConfigApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
      })
    },
    // ---编辑
    handleCreate () {
      this.dialogFormVisible = 'create'
      this.formData = null
      this.showActGuide = false
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      this.showActGuide = false
      this.formData = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDelete (row) {
      // 生效的活动禁止删除
      if (row.status === 1) {
        this.$message.info('启用中的活动禁止删除！')
      } else {
        this.$confirm('确认删除此活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ActConfigApi.del(row.id).then(res => {
            this.$message.success('删除成功')
            this.handleSearch()
          })
        })
      }
    },
    // 显示创建活动说明
    handleShowGuide () {
      this.showActGuide = true
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // --------------------表格格式化输出
    // 格式化输出活动状态。0-草稿，1-启用，2-停用
    formatStatus (row) {
      if (row.status === '0' || row.status === 0) {
        return '草稿'
      } else if (row.status === '1' || row.status === 1) {
        return '启用'
      } else if (row.status === '2' || row.status === 2) {
        return '停用'
      } else {
        return '未知'
      }
    },
    // 参与对象，01-零售户，02-消费者
    formatTarget (row) {
      if (row.target === '01') {
        return '零售户'
      } else if (row.target === '02') {
        return '消费者'
      } else {
        return '未知'
      }
    },
    // 关闭弹窗
    closeDialog (flag) {
      if (flag) {
        this.doSearch()
      }
      this.dialogFormVisible = false
    },
    // ---
    // 切换路由
    handleChangeRoute (row, routeName) {
      this.$router.push({ name: routeName, query: { actId: row.id, actName: row.name } })
    },
    goActivityConfig (row) {
      const type = row.type ? row.type.replace(/"/g, '').slice(1, -1) : ''
      if (type === 'COLLECT') {
        this.$router.push({ name: 'ActBoxCollect', query: { actId: row.id } })
      } else if (type === 'TUIKE') {
        this.$router.push({ name: 'ActTuike', query: { actId: row.id } })
      } else {
        this.$router.push({ name: 'ActLucky', query: { actId: row.id } })
      }
    },
    // ---管理素材
    // 素材管理
    handleMaterial (row) {
      this.$router.push({ name: 'ActMaterialMapping', query: { sourceId: row.id, sourceType: 'ACT', sourceName: row.name } })
    },
    // 赋值活动链接
    handleCopyActUrl (row) {
      let url = `${location.protocol}//${location.hostname}` +
        `/service/activity/act/access/redirect?` +
        `actId=${row.id}`
      if (row.location) {
        url += '&location=1'
      }
      this.$copyText(url).then(() => {
        this.$message.success('复制活动链接成功！')
      }, () => {
        this.$message.fail('复制活动链接失败！')
      })
    },
    // --- 活动模板修改
    handleTemplate (row) {
      let url = location.href.substr(0, location.href.indexOf('#')) + '#/template/page?actId=' + row.id + '&templateId=' + row.templateId
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scope>
.li{
  line-height: 1.6em;
  font-size: 1.15em;
}
.cascader_districtCode{
  width: 100%;
  max-height: 15vh;
  overflow-y: auto;
}
</style>
