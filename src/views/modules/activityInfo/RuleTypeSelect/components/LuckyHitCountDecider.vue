<template>
  <!-- 中奖次数约束 -->
  <el-row>
    <el-col :span="24">
      <el-button @click="handleParamAdd" type="success" class="el-icon-circle-plus" size="mini">增加一行</el-button>
      &nbsp;说明：值为-1时，表示不限制
      <el-table :data="configList" border stripe size="mini" height="150" style="width: 100%;">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="奖项" prop="prizeId">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.prizeId" placeholder="请选择" @change="handleChange">
              <el-option v-for="item in prizeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="每日" prop="day" width="80">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.day" size="mini" @change="handleChange"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="每周" prop="week" width="80">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.week" size="mini" @change="handleChange"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="每月" prop="month" width="80">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.month" size="mini" @change="handleChange"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="累计" prop="fullLife" width="80">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.fullLife" size="mini" @change="handleChange"></el-input>
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
  name: 'HitCountDecider',
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
      configList: [], // { prizeId, day, week, month, fullLife }
      prizeList: [],
      temp: { day: -1, week: -1, month: -1, fullLife: -1 }
    }
  },
  created () {
    if (this.param) {
      this.configList = this.param.map(item => {
        return Object.assign({}, this.temp, item)
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
      this.configList.push({ prizeId: '', ...this.temp })
    },
    handleParamDelete (index) {
      this.configList.splice(index, 1)
    },
    handleChange (value) {
      this.$emit('update:param', this.configList)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
