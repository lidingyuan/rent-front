<template>
  <el-dialog
    class="statement-detail"
    :visible="orderDetailVisible"
    fullscreen
    @update:visible="val=>this.$emit('update:visible', val)"
  >
    123
  </el-dialog>
</template>

<script>
export default {
  name: 'StatementDetail',
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
