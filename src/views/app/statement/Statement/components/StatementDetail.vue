<template>
  <el-dialog
    class="statement-detail"
    :visible.sync="statementDetailVisible"
    fullscreen
    @update:visible="val=>this.$emit('update:visible', val)"
  >
    <el-button @click="print">
      打印
    </el-button>
    <PrintPage ref="print">
      <div class="title">
        {{ compName }}
      </div>
      <div class="sub-title">
        结算单
      </div>
      <div class="sub-info">
        <div>承租单位：{{ projectName }}</div>
        <div>结算日期：{{ statementDetail.date }}</div>
        <div>上次结算日期：{{ statementDetail.lastDate }}</div>
      </div>
      <div class="head">
        <div class="row">
          <div>日期</div>
          <div>材料类型</div>
          <div>类型</div>
          <div>数量</div>
          <div>应收金额</div>
        </div>
      </div>
      <div class="body">
        <div
          v-if="statementDetail.detailMaterialLast && statementDetail.detailMaterialLast.length"
          class="row"
        >
          上次结余：
        </div>
        <div
          v-for="material in statementDetail.detailMaterialLast"
          :key="material.id"
          class="row"
        >
          <div>{{ material.date }}</div>
          <div>{{ material.materialTypeId | filterType }}</div>
          <div>{{ material | filterState }}</div>
          <div>{{ material.num | filterNum }}</div>
          <div>{{ material.money *-1| filterNum }}</div>
        </div>
        <div class="row">
          本次结算：
        </div>
        <div
          v-for="material in detailMaterialLastStatement"
          :key="material.id"
          class="row"
        >
          <div>{{ material.date }}</div>
          <div>{{ material.materialTypeId | filterType }}</div>
          <div>{{ material | filterState }}</div>
          <div>{{ material.num | filterNum }}</div>
          <div>{{ material.money *-1| filterNum }}</div>
        </div>
        <div
          v-for="material in detailMaterial"
          :key="material.id"
          class="row"
        >
          <div>{{ material.date }}</div>
          <div>{{ material.materialTypeId | filterType }}</div>
          <div>{{ material | filterState }}</div>
          <div>{{ material.num | filterNum }}</div>
          <div>{{ material.money *-1| filterNum }}</div>
        </div>
        <div class="row">
          本次结余：
        </div>
        <div
          v-for="material in detailMaterialCount"
          :key="material.id"
          class="row"
        >
          <div>{{ material.date }}</div>
          <div>{{ material.materialTypeId | filterType }}</div>
          <div>{{ material | filterState }}</div>
          <div>{{ material.num | filterNum }}</div>
          <div>{{ material.money *-1| filterNum }}</div>
        </div>
      </div>
      <div class="foot-sign">
        <div>承租单位签字：<div class="sign" /></div>
      </div>
    </PrintPage>
  </el-dialog>
</template>

<script>
import * as StatementApi from '@/api/StatementApi.js'
import baseData from '@/core/service/baseDataService'
import { mapGetters } from 'vuex'
import PrintPage from '@/core/components/PrintPage'
export default {
  name: 'StatementDetail',
  components: { PrintPage },
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
    filterType (id) {
      const type = baseData.materialTypeList.find(type => type.id === id) || {}
      return type.materialTypeName
    },
    filterNum (num) {
      return Math.round(num * 100) / 100
    }
  },
  props: {
    id: Number,
    projectId: Number,
    findProjectName: Function,
    visible: Boolean
  },
  data () {
    return {
      statementDetail: {},
      statementDetailVisible: false,
      materialTypeMap: {}
    }
  },
  computed: {
    ...mapGetters('user', ['compName']),
    projectName () {
      return this.findProjectName(this.projectId)
    },
    detailMaterial () {
      return this.statementDetail.detailMaterial?.filter(item => item.type === 1 || item.type === 2).sort((a, b) => {
        if (a.type - b.type) {
          return a.type - b.type
        }
        if (a.date > b.date) {
          return 1
        }
        if (a.date < b.date) {
          return -1
        }
        return 0
      })
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
    print () {
      this.$refs.print.print()
    }
  }
}
</script>

<style lang='scss' scoped>
.head,.body{
  border: 1px solid #ccc;
  width: 100%;
}
.row{
  display: flex;
  margin: 0 40px;
  >div{
    width: 0;
    flex-grow: 1;
  }
}

.title{
  margin-top: 40px;
  font-size: 32px;
  text-align: center;
}
.sub-title{
  font-size: 32px;
  text-align: center;
}
.sub-info{
  margin: 0 40px;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
}
.foot-sign{
  margin: 0 40px;
  margin-top: 20px;
  margin-bottom: 80px;
  display: flex;
  justify-content: space-between;
  .sign{
    width: 200px;
  }
}
</style>
