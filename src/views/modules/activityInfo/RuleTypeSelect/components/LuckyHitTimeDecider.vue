<template>
  <!-- 中奖时间约束 -->
  <el-row>
    <el-col :span="24">
      <el-button @click="handleParamAdd" type="success" class="el-icon-circle-plus" size="mini">增加一行</el-button>
      &nbsp;<a href="http://cron.qqe2.com" target="_blank" title="在线帮助"><i class="el-icon-info"></i>Cron在线帮助</a>
      <el-table :data="configList" border stripe size="mini" height="150" style="width: 100%;">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="奖项" prop="prizeId">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.prizeId" placeholder="请选择" @change="handleChange">
              <el-option v-for="item in prizeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="中奖时间" prop="cron" width="200">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.cron" placeholder="请输入cron表达式"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="danger"  size="mini" icon="el-icon-delete" circle title="删除" @click="handleParamDelete(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import * as ActLuckyPrizeApi from '@/api/lucky/ActLuckyPrizeApi.js'

export default {
  name: 'LuckyHitTimeDecider',
  components: {},
  props: {
    phaseId: {
      type: String,
      required: true
    },
    param: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      configList: [], // { prizeId, cron }
      prizeList: []
    }
  },
  created () {
    if (this.param) {
      this.configList = this.param.map(item => {
        return { ...item }
      })
    }
    ActLuckyPrizeApi.list(this.phaseId).then(res => {
      this.prizeList = res.data
      this.prizeList.unshift({ id: '_all', name: '全部奖项' })
    })
  },
  methods: {
    // -----------------表格操作
    handleParamAdd () {
      this.configList.push({ prizeId: '', cron: '' })
    },
    handleParamDelete (index) {
      this.configList.splice(index, 1)
      this.handleChange()
    },
    handleChange (value) {
      this.$emit('update:param', this.configList)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
