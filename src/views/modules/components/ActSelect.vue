<template>
  <!-- 活动选择组件·新版: 集合input，添加删除事件 20201021 -->
  <el-popover placement="bottom" trigger="click">
    <el-input slot="reference" readonly :value="selectedActName" size="small"
      :style="{width: width}" placeholder="请选择活动">
      <el-button slot="append" class="el-icon-delete" @click.stop="handleClear()"></el-button>
    </el-input>
      <!-- 活动选择弹窗 -->
      <div style="width:650px;">
        <!-- 活动选择组件 -->
        <table-wrapper :filterable="false" :excel="false" :expand="false" height="300px">
          <!-- 活动选择列表表头 -->
          <div slot="title">活动列表</div>
          <template slot="operates">
            <el-input size="small" placeholder="输入活动名称查询" v-model="searchActName" style="width:200px;" />
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch(1)">查询</el-button>
          </template>

          <!-- 活动列表 -->
          <el-table :data="dataList" size="small" border stripe>
            <el-table-column type="index" :index="page | listIndexFilter" width="50"></el-table-column>
            <el-table-column prop="id" label="活动Id" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" width="200" label="活动名称" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="status" width="80" label="状态">
              <template slot-scope="scope">
                {{actStatus[scope.row.status]}}
              </template>
            </el-table-column>
            <el-table-column width="80" label="选择" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row['SWITCHED']" @change="handleSwith(scope.row)"></el-switch>
              </template>
            </el-table-column>
          </el-table>
          <!-- 活动列表end -->

          <!-- 活动列表页码 -->
          <template slot="footer">
            <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
              layout="total, prev, pager, next, jumper" >
            </el-pagination>
          </template>
        </table-wrapper>
      </div>
  </el-popover>
</template>

<script>
import * as ActConfigApi from '@/api/activityInfo/ActConfigApi.js'
import TableWrapper from '@/components/TableWrapper'

const SWITCHED = 'SWITCHED'

export default {
  name: 'ActSelect',
  components: { TableWrapper },
  props: {
    width: {
      type: String,
      default: '300px'
    },
    actId: {
      type: String,
      default: ''
    },
    actName: {
      type: String,
      default: ''
    },
    actInfo: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 20
      },
      dataList: [],
      actStatus: ['草稿', '启用', '停用'],
      // 创建actId防止出现直接修改父组件该值警告
      selectedActId: '',
      selectedActName: '',
      // 列表查询的活动名称
      searchActName: '',
      dialogVisible: true,
      loading: false
    }
  },
  created () {
    this.selectedActId = this.actId
    this.selectedActName = this.actName
    this.searchActName = this.actName
    this.handleSearch()
  },
  watch: {
    // 解决input在readonly模式下，点击append的事件无法修改绑定的活动名称值
    selectedActId (newVal) {
      if (!newVal) {
        this.selectedActName = ''
      }
    }
  },
  methods: {
    // 查询活动
    handleSearch (current) {
      this.page.current = !current ? this.page.current : current
      this.page.total = !current ? this.page.total : 0
      let options = Object.assign({}, this.page, { name: this.searchActName })
      ActConfigApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        let records = res.data.records
        records.map(data => {
          data[SWITCHED] = false
          // 编辑的时候匹配活动id
          if (this.selectedActId !== '' && data.id === this.selectedActId) {
            data[SWITCHED] = true
            this.selectedActName = data.name
          }
        })
        this.loading = false
        this.dataList = records
      })
    },
    // 翻页
    handleCurrentChange (current) {
      this.handleSearch(current)
    },
    // -------
    handleSwith (row) {
      // 全部置为未选中
      let len = this.dataList.length
      for (let i = 0; i < len; i++) {
        this.dataList[i][SWITCHED] = false
      }
      // 选中的置为已选中
      row[SWITCHED] = true
      this.selectedActName = row.name
      this.selectedActId = row.id
      this.$emit('update:actId', this.selectedActId)
      this.$emit('update:selectedActName', this.selectedActName)
      this.$emit('update:actInfo', row)
    },
    // 清空选中的活动
    handleClear () {
      this.selectedActId = ''
      // 因为该事件在input中，无法在readonly模式下修改此值，改在监听watch中实现
      // this.searchActName = ''
      let len = this.dataList.length
      for (let i = 0; i < len; i++) {
        this.dataList[i][SWITCHED] = false
      }
      this.$emit('update:actId', '')
      this.$emit('update:selectedActName', '')
      this.$emit('update:actInfo', null)
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog-act {
  height: 600px;
  overflow-y: auto;
}
.item-act {
  line-height: 30px;
  overflow: hidden;
  border-radius: 10px;
}
.item-active {
  background: rgba($color: #409EFF, $alpha: 0.5);
}
.item-act:hover {
  background: rgba($color: #409EFF, $alpha: 0.3);
  transition: all 0.2s;
}
.item-row1 {
  display: flex;
  justify-content: space-between;
  .act-name {
    font-weight: bolder;
    font-size: 1.3em;
    color: #409EFF;
  }
  .act-status {
    width: 50px;
  }
}
.item-row2 {
  display: flex;
  border-bottom: 1px solid #C0C4CC;
  .act-id {
    width: 35%;
  }
  .act-remarks {
    width: 60%;
    overflow: hidden;
    text-overflow: ex;
  }
}
.txt-green {
  color: #67C23A;
}
</style>
