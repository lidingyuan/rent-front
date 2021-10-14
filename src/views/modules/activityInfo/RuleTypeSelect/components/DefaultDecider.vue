<template>
  <!-- 默认的约束编辑 没有特定写对应组件，则到这个编辑中 -->
  <div class="page">
    <el-input type="textarea" :rows="6" v-model="text" placeholder="请填入配置" @change="handleChange"></el-input>
    参考样例：{{ruleParamExample}}
  </div>
</template>

<script>

export default {
  name: 'DefaultDecider',
  components: {},
  props: {
    param: {
      default: ''
    },
    ruleParamExample: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      text: ''
    }
  },
  created () {
    if (this.param) {
      try {
        if (typeof this.param !== 'string') {
          this.text = JSON.stringify(this.param)
        } else {
          this.text = this.param
        }
      } catch (error) {
        this.text = ''
      }
    }
  },
  methods: {
    handleChange () {
      this.$emit('update:param', JSON.parse(this.text))
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
