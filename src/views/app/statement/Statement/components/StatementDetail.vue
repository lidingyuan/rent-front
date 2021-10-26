<template>
  <el-dialog
    class="statement-detail"
    :visible.sync="statementDetailVisible"
    fullscreen
    @update:visible="val=>this.$emit('update:visible', val)"
  >
    <el-form>
      <el-form-item>结算日期：{{ statementDetail.date }}</el-form-item>
      <el-form-item>上次结算日期：{{ statementDetail.lastDate }}</el-form-item>
    </el-form>
    <div>
      上次结余：
      <div
        v-for="(material,index) in statementDetail.detailMaterialLast"
        :key="index"
      >
        {{ material.materialTypeId | filterType }}
        {{ material.date }}
        {{ material | filterNum }}
      </div>
    </div>
    <div>
      本次结算：
      <div
        v-for="(material,index) in statementDetail.detailMaterial"
        :key="index"
      >
        {{ material.materialTypeId | filterType }}
        {{ material.date }}
        {{ material | filterNum }}
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
    filterNum (material) {
      if (material.type === 3) {
        return '结余' + material.num
      }

      if (material.type === 2) {
        return '归还' + material.num
      }

      if (material.type === 1) {
        return '出租' + material.num
      }
    },
    filterType (id) {
      const type = baseData.materialTypeList.find(type => type.id === id) || {}
      return type.materialTypeName
    }
  },
  props: {
    id: Number
  },
  data () {
    return {
      materialTypeList: [],
      statementDetail: {},
      statementDetailVisible: false
    }
  },
  watch: {
    id () {
      this.statementDetailVisible = true
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

</style>
