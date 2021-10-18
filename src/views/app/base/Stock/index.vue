<template>
  <ZlQueryContainer
    ref="tableWrapper"
    title="列表"
  >
    <ScrollBox style="height:calc(100vh - 140px);">
      <div class="head">
        <div
          v-for="number in 8"
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
          <div>
            <el-input
              v-model="form[material.code]"
              size="small"
            />
          </div>
          <div style="width:32px;">
            {{ material.unit }}
          </div>
        </div>
      </div>
    </ScrollBox>
  </ZlQueryContainer>
</template>

<script>
import * as StockApi from '@/api/StockApi.js'
import * as MaterialApi from '@/api/MaterialApi.js'

export default {
  name: 'Stock',
  data () {
    return {
      materialList: [],
      form: {}
    }
  },
  watch: {
  },
  created () {
    StockApi.list().then(res => {
      const str = res.data[0]
      if (str) {
        this.form = JSON.parse(str)
      }
    })
    MaterialApi.list().then(res => {
      this.materialList = res.data
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scope>

.head{
  display: flex;
  flex-wrap: wrap;
  height: 3em;
  overflow: hidden;
  >div{
    display: flex;
    min-width: 20%;
    >div{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 3em;
      width: 100px;
    }
  }
}
.body{
  display: flex;
  flex-wrap: wrap;
  >div{
    display: flex;
    min-width: 20%;
    >div{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 3em;
      width: 100px;
    }
  }
}
</style>
