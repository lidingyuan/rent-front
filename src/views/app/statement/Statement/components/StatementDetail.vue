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
import * as StatementApi from '@/api/StatementApi.js'
export default {
  name: 'StatementDetail',
  props: {
    id: Number
  },
  data () {
    return {
      statementDetail: {}
    }
  },
  created () {
    StatementApi.detail(this.id).then(res => {
      this.statementDetail = res.data
    })
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
