<template>
  <table-wrapper :filterable="false" :excel="false" :expand="false" height="300px">
    <!-- 标签列表表头 -->
    <div slot="title">标签列表<span v-if="count > 0">(限选{{count}}个)</span></div>
    <template slot="operates">
      <el-select size="small" v-model="groupId" @change="handleSearch">
        <el-option value="" label="全部分组"></el-option>
        <el-option v-for="(item) in groupList" :key="item.id" :value="item.id" :label="item.name"></el-option>
      </el-select>
      <el-input size="small" placeholder="输入标签名称查询" v-model="searchKey" style="width:200px;" />
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
    </template>

    <!-- 标签列表 -->
    <el-table :data="dataList" ref="table" size="small" height="100%" border stripe>
      <el-table-column type="index" :index="page | listIndexFilter" width="50"></el-table-column>
      <el-table-column width="80" label="选择" align="center">
        <template slot-scope="scope">
          <el-switch :value="isSwitched(scope.row['id'])" @change="handleSwith(scope.row, scope.$index)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="标签Id" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tagName" width="250" label="标签"></el-table-column>
      <el-table-column prop="groupId" width="150" label="组名">
        <template slot-scope="scope">{{getGroupNameById(scope.row.groupId)}}</template>
      </el-table-column>
    </el-table>
    <!-- 标签列表end -->

    <!-- 标签列表页码 -->
    <template slot="footer">
      <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
        layout="total, prev, pager, next, jumper" >
      </el-pagination>
    </template>
  </table-wrapper>

</template>

<script>
import * as TagApi from '@/api/activityInfo/TagApi.js'
import TableWrapper from '@/components/TableWrapper'

const SWITCHED = 'SWITCHED'

export default {
  name: 'TagSelect',
  components: { TableWrapper },
  props: {
    // 初始值。
    value: {
      type: Object,
      default: () => {
        return {
          tagIds: [],
          tagNames: []
        }
      }
    },
    // 限定选择的个数，不传则不限制
    count: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 10
      },
      groupId: '',
      searchKey: '',
      // ---数据
      groupList: [],
      dataList: [],
      // ---
      tagIds: []
    }
  },
  created () {
    this.tagIds = this.value.tagIds.concat()
    TagApi.getGroupList().then(res => {
      this.groupList = res.data
    })
    // ---根据tagIds，查询tagNames
    if (this.tagIds.length > 0) {
      TagApi.listByIds(this.tagIds.join(',')).then(res => {
        let tagIds = this.tagIds
        let tagNames = res.data.map(item => item.tagName)
        this.$emit('change', { tagIds, tagNames })
      })
    }
    this.handleSearch()
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
      let options = Object.assign({}, this.page, { tagName: this.searchKey, groupId: this.groupId })
      TagApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        this.dataList = res.data.records
        this.dataList.map(data => {
          data[SWITCHED] = this.value.tagIds.indexOf(data.id) >= 0
        })
      })
    },
    // ---
    handleSwith (row, rowIndex) {
      let tagIds = this.tagIds
      let tagNames = this.value.tagNames.concat()
      if (!this.isSwitched(row.id)) { // 原未选中
        if (this.count === 0 || tagIds.length < this.count) {
          // 不限制选择
          tagIds.push(row.id)
          tagNames.push(row.tagName)
          this.$emit('change', { tagIds, tagNames })
        } else if (this.count === 1) {
          tagIds.length = 0
          tagNames.length = 0
          tagIds.push(row.id)
          tagNames.push(row.tagName)
          this.$emit('change', { tagIds, tagNames })
        } else if (tagIds.length === this.count) {
          const tip = `当前限选` + this.count + `个标签，您已选满`
          this.$message.info(tip)
        }
      } else {
        let idx = tagIds.indexOf(row.id)
        tagIds.splice(idx, 1)
        tagNames.splice(idx, 1)
        this.$emit('change', { tagIds, tagNames })
      }
    },
    // ---
    isSwitched (tagId) {
      return this.tagIds.indexOf(tagId) >= 0
    },
    getGroupNameById (groupId) {
      let group = this.groupList.find(item => item.id === groupId)
      if (group) {
        return group.name
      }
      return ''
    }
  }
}
</script>

<style>

</style>
