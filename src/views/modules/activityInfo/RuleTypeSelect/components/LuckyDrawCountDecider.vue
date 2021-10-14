<!-- 抽奖次数约束 -->

<template>
  <el-row>
    <el-col :span="24" style="">
      说明：值为-1时，表示不限制
    </el-col>
    <el-col :span="12">
      <el-form-item label="每日抽奖限次" label-width="100px">
        <el-input-number size="small" v-model="day" :min="-1" @change="handleChange"></el-input-number>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="每周抽奖限次" label-width="100px">
        <el-input-number size="small" v-model="week" :min="-1" @change="handleChange"></el-input-number>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="每月抽奖限次" label-width="100px">
        <el-input-number size="small" v-model="month" :min="-1" @change="handleChange"></el-input-number>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="累计抽奖限次" label-width="100px">
        <el-input-number size="small" v-model="fullLife" :min="-1" @change="handleChange"></el-input-number>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'DrawCountDecider',
  components: {},
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      day: -1,
      week: -1,
      month: -1,
      fullLife: -1
    }
  },
  created () {
    const temp = this.param || this.emptyParam()
    this.day = temp.day || -1
    this.week = temp.week
    this.month = temp.month || -1
    this.fullLife = temp.fullLife || -1
  },
  methods: {
    emptyParam () {
      return {
        day: -1,
        week: -1,
        month: -1,
        fullLife: -1
      }
    },
    handleChange () {
      let tempData = { day: this.day, week: this.week, month: this.month, fullLife: this.fullLife }
      this.$emit('update:param', tempData)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
