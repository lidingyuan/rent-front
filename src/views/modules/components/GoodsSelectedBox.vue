<template>
  <div>
  <!-- 物资选择组件 -->
  <table-wrapper :filterable="false" :excel="false" :expand="false" height="300px">
    <!-- 物资选择列表表头 -->
    <div slot="title">物资列表</div>
    <template slot="operates">
      <el-input size="mini" placeholder="请输入物资名称" v-model="goodsName" clearable style="width:260px"></el-input>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="handleSearch(1)">查询</el-button>
    </template>

    <!-- 活动列表 -->
    <el-table :data="dataList" size="small" border stripe height="100%">
      <el-table-column type="index" :index="page | listIndexFilter" width="50" align="center"></el-table-column>
      <el-table-column width="80" label="选择" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row['SWITCHED']" @change="handleSwitch(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" width="200" label="物资名称"></el-table-column>
      <el-table-column prop="type" width="80" label="物资类型" :formatter="formatGoodsType" align="center"></el-table-column>
      <el-table-column prop="price" width="80" label="价格" align="right"></el-table-column>
      <el-table-column prop="specs" width="100" label="物资规格" align="right"></el-table-column>
      <el-table-column prop="unit" width="80" label="物资单位" align="center"></el-table-column>
      <el-table-column prop="description" width="200" label="详细描述" show-overflow-tooltip=""></el-table-column>
      <el-table-column prop="orderTag" width="80" label="排序" align="right"></el-table-column>
    </el-table>
    <!-- 物资列表end -->

    <!-- 物资列表页码 -->
    <template slot="footer">
      <el-pagination @current-change="handleCurrentChange" :page-size="page.size" :current-page="page.current" :total="page.total"
        layout="total, prev, pager, next, jumper" >
      </el-pagination>
    </template>
  </table-wrapper>
  </div>
</template>

<script>
import * as ActGoodsApi from '@/api/baseInfo/ActGoodsApi.js'
import TableWrapper from '@/components/TableWrapper'

const SWITCHED = 'SWITCHED'

export default {
  name: 'GoodsSelect',
  components: { TableWrapper },
  props: [ 'selectedGoods' ],
  data () {
    return {
      // ---查询条件
      page: {
        current: 1,
        total: 0,
        size: 10
      },
      goodsName: '',
      // ---数据
      dataList: []
    }
  },
  computed: {
    goodsTypeList () {
      return this.$store.getters['baseData/goodsTypeList']
    }
  },
  created () {
    this.handleSearch()
  },
  watch: {},
  methods: {
    // 查询活动
    handleSearch (current) {
      this.page.current = current || this.page.current
      let options = Object.assign({}, this.page, { name: this.goodsName })
      ActGoodsApi.listByPage(options).then(res => {
        this.$objects.copyProperties(res.data, this.page)
        let records = res.data.records
        records.map(data => {
          data[SWITCHED] = false
          // 编辑的时候匹配活动id
          if (this.selectedGoods.goodsId === data.id) {
            data[SWITCHED] = true
          }
        })
        this.dataList = records
      })
    },
    // 翻页
    handleCurrentChange (current) {
      this.handleSearch(current)
    },
    // -------
    handleSwitch (row) {
      // 全部置为未选中
      let len = this.dataList.length
      for (let i = 0; i < len; i++) {
        if (this.dataList[i] === row) {
          continue
        }
        this.dataList[i][SWITCHED] = false
      }
      let goodsObj = { goodsId: '', goodsName: '', goodsType: '' }
      if (row[SWITCHED]) {
        goodsObj = { goodsId: row.id, goodsName: row.name, goodsType: row.type }
      }
      this.$emit('updateSelectedGoods', goodsObj)
    },
    // 格式输出物资类型
    formatGoodsType (row, col, cellValue) {
      if (!cellValue) return ''
      const type = this.goodsTypeList.find(type => type.value === cellValue)
      return type.label
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
