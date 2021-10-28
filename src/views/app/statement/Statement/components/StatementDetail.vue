<template>
  <el-dialog
    class="statement-detail"
    :visible.sync="statementDetailVisible"
    fullscreen
    @update:visible="val=>this.$emit('update:visible', val)"
  >
    <div>结算日期：{{ statementDetail.date }}</div>
    <div>上次结算日期：{{ statementDetail.lastDate }}</div>
    <div>
      上次结余：
      <div
        v-for="(material,index) in statementDetail.detailMaterialLast"
        :key="index"
        class="row"
      >
        <div>{{ material.date }}</div>
        <div>{{ material.materialTypeId | filterType }}</div>
        <div>{{ material | filterState }}</div>
        <div>{{ material.num }}</div>
        <div>{{ material.money | filterMoney }}</div>
      </div>
    </div>
    <div>
      结余本期结算：
      <div
        v-for="(material,index) in detailMaterialLastStatement"
        :key="index"
        class="row"
      >
        <div>{{ material.date }}</div>
        <div>{{ material.materialTypeId | filterType }}</div>
        <div>{{ material | filterState }}</div>
        <div>{{ material.num }}</div>
        <div>{{ material.money | filterMoney }}</div>
      </div>
    </div>
    <div>
      本次结算：
      <div
        v-for="(material,index) in detailMaterial"
        :key="index"
        class="row"
      >
        <div>{{ material.date }}</div>
        <div>{{ material.materialTypeId | filterType }}</div>
        <div>{{ material | filterState }}</div>
        <div>{{ material.num }}</div>
        <div>{{ material.money | filterMoney }}</div>
      </div>
    </div>
    <div>
      本次结余：
      <div
        v-for="(material,index) in detailMaterialCount"
        :key="index"
        class="row"
      >
        <div>{{ material.date }}</div>
        <div>{{ material.materialTypeId | filterType }}</div>
        <div>{{ material | filterState }}</div>
        <div>{{ material.num }}</div>
        <div>{{ material.money | filterMoney }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as StatementApi from '@/api/StatementApi.js'
import baseData from '@/core/service/baseDataService'
export default {
  name: 'StatementDetail',
  filters: {
    filterState (material) {
      if (material.type === 3) {
        return '结余'
      }

      if (material.type === 2) {
        return '归还'
      }

      if (material.type === 1) {
        return '出租'
      }

      if (material.type === 4) {
        return '结余'
      }
    },
    filterMoney (money) {
      if (money > 0) {
        return '应收' + (-1 * money)
      } else {
        return '应收' + (-1 * money)
      }
    },
    filterType (id) {
      const type = baseData.materialTypeList.find(type => type.id === id) || {}
      return type.materialTypeName
    }
  },
  props: {
    id: Number,
    visible: Boolean
  },
  data () {
    return {
      materialTypeList: [],
      detailMaterialLast: [],
      statementDetail: {},
      statementDetailVisible: false,
      materialTypeMap: {}
    }
  },
  computed: {
    detailMaterial () {
      return this.statementDetail.detailMaterial?.filter(item => item.type === 1 || item.type === 2)
    },
    detailMaterialCount () {
      return this.statementDetail.detailMaterial?.filter(item => item.type === 3)
    },
    detailMaterialLastStatement () {
      return this.statementDetail.detailMaterial?.filter(item => item.type === 4)
    }
  },
  watch: {
    visible (val) {
      this.statementDetailVisible = val
    },
    statementDetailVisible (val) {
      this.$emit('update:visible', val)
    },
    id () {
      StatementApi.detail(this.id).then(res => {
        this.statementDetail = res.data
      })
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.row{
  display: flex;
  width: 100%;
  >div{
    width: 0;
    flex-grow: 1;
  }
}
</style>
