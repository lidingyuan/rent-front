<template>
  <!-- 抽奖类型约束 -->
  <el-row>
    <el-col :span="24" style="">
      抽奖类型
    </el-col>
    <el-col :span="24">
     <el-form-item>
      <el-select v-model="lukcyType" multiple :multiple-limit="1" @change="handleChange">
        <el-option label="积分抽奖" value="POINT_LUCKY"></el-option>
        <el-option label="兑换券抽奖" value="COUPON_LUCKY"></el-option>
      </el-select>
    </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'QrCodeValidateDecider',
  props: {
    param: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      lukcyType: []
    }
  },
  created () {
    try {
      this.lukcyType = this.param
    } catch (error) {
      this.lukcyType = []
    }
  },
  methods: {
    handleChange () {
      const param = JSON.stringify(this.lukcyType)
      this.$emit('update:param', param)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
