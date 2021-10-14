<template>
  <!-- 奖池约束器表单 -->
  <el-row>
    <el-col :span="24" style="">
      &nbsp;
    </el-col>
    <el-col :span="12">
      <el-form-item label="地理位置获取方式" label-width="130px">
        <el-select v-model="areaType" @change="handleChange">
          <el-option value="gps" label="实时获取"></el-option>
          <el-option value="retailer" label="零售户归属地"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'DrawPoolDecider',
  components: {},
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      areaType: 'gps'
    }
  },
  created () {
    const temp = this.param || this.emptyParam()
    this.areaType = temp.areaType
  },
  methods: {
    emptyParam () {
      return { areaType: 'gps' }
    },
    handleChange () {
      this.$emit('update:param', { areaType: this.areaType })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
