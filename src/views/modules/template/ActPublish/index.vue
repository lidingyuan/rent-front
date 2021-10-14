<template>
  <div>
    <table-wrapper :filterable="false" :excel="false">
      <!-- 标题 -->
      <div slot="title">活动列表</div>
      <template slot="operates">
        <el-input size="small" v-model="searchKey.name" placeholder="请输入活动名称" style="width: 300px"></el-input>
        <el-select size="small" v-model="searchKey.status" placeholder="请选择状态">
          <el-option label="全部" :value="-99"></el-option>
          <el-option label="未开始" :value="2"></el-option>
          <el-option label="进行中" :value="1"></el-option>
          <el-option label="已结束" :value="0"></el-option>
        </el-select>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </template>

      <!-- 列表 -->
      <div class="act-list">
        <div v-for="item in dataList" :key="item.id" class="act-item">
          <!-- 活动信息展示 -->
          <div class="act-info">
            <div class="act-name" :title="item.name">{{item.name}}</div>
            <div class="act-time">{{item.beginTime | formatTime}} ~ {{item.endTime | formatTime}}</div>
            <div class="act-status">
              {{item.target | formatTarget}}&emsp;
              <span :class="`status-${item.status}`">{{item.status | formatStatus}}中</span>
              <!-- <span class="act-detail">详情</span> -->
            </div>
          </div>
          <!-- 活动操作栏 -->
          <div class="act-operate">
            <el-button v-if="$auth('activity:activity:config:mod')" circle type="success" size="mini" :disabled="!!item.status" class="el-icon-finished" @click.native="handleUpdate(item)" title="发布">
            </el-button>
            <el-button v-if="$auth('activity:activity:config:mod')" circle type="primary" size="mini" class="el-icon-edit" @click.native="handleTemplate(item)" title="编辑"></el-button>
            <el-button v-if="$auth('activity:activity:config:del')" circle type="danger" size="mini" class="el-icon-delete" @click.native="handleDelete(item)" title="删除"></el-button>
            <el-button v-if="$auth('activity:activity:config:del')" circle type="primary" size="mini" class="el-icon-share" @click.native="handleCopyActUrl(item)" title="复制活动链接"></el-button>
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

    <!-- TODO 活动详情 -->
  </div>
</template>

<script>
import * as ActConfigApi from '@/api/activityInfo/ActConfigApi.js'
import * as ActTemplateApi from '@/api/template/ActTemplateApi'

import TableWrapper from '@/components/TableWrapper'

export default {
  name: 'ActConfig',
  components: { TableWrapper },
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
      // 查询条件
      searchKey: {
        name: '',
        status: 1
      }
    }
  },
  created () {
    this.handleSearch()
  },
  filters: {
    // 格式化输出活动状态。0-草稿，1-启用，2-停用
    formatStatus (value) {
      if (value === '0' || value === 0) {
        return '草稿'
      } else if (value === '1' || value === 1) {
        return '启用'
      } else if (value === '2' || value === 2) {
        return '停用'
      } else {
        return '未知'
      }
    },
    // 参与对象，01-零售户，02-消费者
    formatTarget (value) {
      if (value === '01') {
        return '零售户'
      } else if (value === '02') {
        return '消费者'
      } else {
        return '未知'
      }
    },
    formatTime (value) {
      return value.substr(0, 10)
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
    handleUpdate (row) {
      ActTemplateApi.publish(row.id).then(res => {
        this.$message('发布成功')
      })
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
    // ---管理素材
    // 赋值活动链接
    handleCopyActUrl (row) {
      let url = `${process.env.VUE_APP_DOMAIN_NAME}` +
        `/service/activity/act/access/redirect?noAuth=1` +
        `&actId=${row.id}`
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
      const { href } = this.$router.resolve({
        name: 'templatePage',
        query: { templateId: row.templateId, actId: row.id }
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="scss" scope>
.act-list {
  display: flex;
  flex-wrap: wrap;
  font-size: 0.85em;
  .act-item {
    margin: 30px 30px 0 0;
    padding: 20px;
    border-radius: 15px;
    background: #fff;
    .act-info {
      line-height: 1.8em;
      width: 260px;
      .act-name {
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .act-time {
        font-size: 0.95em;
        opacity: 0.8;
      }
      .act-status {
        opacity: 0.8;
        font-size: 0.9em;
        .status-0 { color: #909399; }
        .status-1 { color: #409EFF; }
        .status-2 { color: #F56C6C; }
      }
      .act-detail {
        margin-left: 10px;
        color: #67C23A;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .act-info::after {
      display: block;
      margin-top: 10px;
      content: '';
      height: 1px;
      width: 100%;
      background: #ccc;
    }
    .act-operate {
      position: relative;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}
</style>
