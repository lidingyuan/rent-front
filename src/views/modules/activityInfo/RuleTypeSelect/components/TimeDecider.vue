<template>
  <!-- 时间约束 -->
  <el-row>
    <el-col :span="24" style="">
      CRON表达式：
    </el-col>
    <el-col :span="24">
      <el-form-item >
        <el-input v-model="cron" placeholder="请输入cron表达式,例如:* * 10 ? * 2,4" @input="handleChange">
          <a slot="append" href="http://cron.qqe2.com" target="_blank" title="在线帮助"><i class="el-icon-info"></i></a>
        </el-input>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TimeDecider',
  components: {},
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      cron: ''
    }
  },
  created () {
    const temp = this.param || this.emptyParam()
    console.log(this.param, temp)
    this.cron = temp.cron
  },
  methods: {
    emptyParam () {
      return { cron: '' }
    },
    handleChange () {
      this.$emit('update:param', { cron: this.cron })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
