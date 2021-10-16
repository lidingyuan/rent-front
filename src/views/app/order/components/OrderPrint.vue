<template>
  <div
    v-if="value"
    class="orderP-print"
  >
    <div class="button">
      <el-button
        v-if="!printState"
        @click="print"
      >
        打印
      </el-button>
      <el-button
        v-if="!printState"
        @click="$emit('input',false)"
      >
        关闭
      </el-button>
    </div>
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
            v-for="material in materialList"
            :key="material.code"
          >
            <div>{{ material.name }}</div>
            <div>{{ form[material.code] }}</div>
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
  </div>
</template>

<script>
import * as MaterialApi from '@/api/MaterialApi.js'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderPrint',
  props: {
    value: Boolean,
    data: Object,
    findProjectName: Function
  },
  data () {
    return {
      printState: false,
      materialList: [],
      form: {}
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
      if (this.data.detail) {
        this.text = '修改'
        this.form = JSON.parse(this.data.detail)
      } else {
        this.text = '保存'
        this.form = {}
      }
    }
  },
  created () {
    MaterialApi.list().then(res => {
      this.materialList = res.data
    })
  },
  methods: {
    print () {
      this.printState = true
      this.$nextTick(() => {
        window.print()
        this.printState = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.orderP-print{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 141vw;
  background: #fff;
  z-index: 10000;
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
    height: 0;
    flex-grow: 1;
    .head{
      display: flex;
      justify-content: center;
      >div{
        display: flex;
        min-width: 30%;
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
        min-width: 30%;
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
}
</style>
