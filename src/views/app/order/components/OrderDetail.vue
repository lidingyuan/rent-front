<template>
  <el-dialog
    class="order-detail"
    :visible="orderDetailVisible"
    fullscreen
    @update:visible="val=>this.$emit('update:visible', val)"
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

    <el-button @click="save">
      {{ text }}
    </el-button>
  </el-dialog>
</template>

<script>
import * as MaterialApi from '@/api/MaterialApi.js'
export default {
  name: 'OrderDetail',
  props: {
    visible: Boolean,
    data: String
  },
  data () {
    return {
      orderDetailVisible: false,
      materialList: [],
      form: {},
      text: ''
    }
  },
  watch: {
    visible () {
      this.orderDetailVisible = this.visible
    },
    data () {
      if (this.data) {
        this.text = '修改'
        this.form = {}
        this.data.forEach(item => {
          this.form[item.materialCode] = item.num
        })
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
    this.orderDetailVisible = this.visible
  },
  methods: {
    save () {
      this.$emit('update:data', Object.keys(this.form).map(key => {
        return {
          materialCode: key,
          num: this.form[key]
        }
      }).filter(item => item.num))
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang='scss' scoped>
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
