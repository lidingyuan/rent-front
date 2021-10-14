
<!--路由重定向？？-->

<script>
export default {
  beforeCreate () {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  // 字符串模板的代替方案，允许你发挥 JavaScript 最大的编程能力。该渲染函数接收一个 createElement 方法作为第一个参数用来创建 VNode
  render: function (h) {
    return h() // avoid warning message
  }
}
</script>
