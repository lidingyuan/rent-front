<template>
  <PrintPage ref="print">
    <div class="page">
      <div class="title">
        {{ compName }}
      </div>
      <div class="sub-title">
        租赁材料发货单
      </div>
      <div class="sub-info">
        <div>承租单位：{{ projectName }}</div>
        <div>日期：{{ data.date }}</div>
      </div>
      <div class="table">
        <div class="head">
          <div
            v-for="number in 3"
            :key="number"
          >
            <div>名称</div>
            <div>数量</div>
            <div style="width:32px;">
              单位
            </div>
          </div>
        </div>
        <div class="body">
          <div
            v-for="material in dataList"
            :key="material.materialCode"
          >
            <div>{{ material.name }}</div>
            <div>{{ material.num }}</div>
            <div style="width:32px;">
              {{ material.unit }}
            </div>
          </div>
        </div>
      </div>

      <div class="foot-sign">
        <div>发货人：<div class="sign" /></div>
        <div>收货人：<div class="sign" /></div>
      </div>
    </div>
  </PrintPage>
</template>

<script>
import baseData from '@/core/service/baseDataService'
import PrintPage from '@/core/components/PrintPage'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderPrint',
  components: { PrintPage },
  props: {
    data: Object,
    findProjectName: Function
  },
  data () {
    return {
      printState: false,
      materialList: [],
      dataList: []
    }
  },
  computed: {
    ...mapGetters('user', ['compName']),
    projectName () {
      return this.findProjectName(this.data.projectId)
    }
  },
  watch: {
    data () {
      if (this.data?.detail) {
        this.text = '修改'
        this.dataList = this.data.detail.map(item => {
          const material = this.materialList.find(material => material.code === item.materialCode) || {}
          return {
            ...item,
            name: material.name,
            unit: material.unit
          }
        })
        console.log(this.dataList)
      } else {
        this.text = '保存'
        this.dataList = []
      }
    }
  },
  created () {
    this.materialList = baseData.materialList
  },
  methods: {
    print () {
      this.$refs.print.print()
    }
  }
}
</script>

<style lang='scss' scoped>
.page{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
.table{
  .head{
    display: flex;
    justify-content: center;
    >div{
      display: flex;
      >div{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.5em;
        width: 100px;
        flex-shrink: 0;
        border: 1px solid #ccc;
      }
    }
  }
  .body{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    >div{
      display: flex;
      >div{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.5em;
        width: 100px;
        flex-shrink: 0;
        border: 1px solid #ccc;
      }
    }
  }
}
</style>
