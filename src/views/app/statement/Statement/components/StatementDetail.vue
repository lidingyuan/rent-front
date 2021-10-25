<template>
  <el-dialog
    class="statement-detail"
    :visible.sync="statementDetailVisible"
    fullscreen
    @update:visible="val=>this.$emit('update:visible', val)"
  >
    <el-form>
      结算日期：{{ statementDetail.date }}
    </el-form>
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
      statementDetail: {},
      statementDetailVisible: false
    }
  },
  watch: {
    id () {
      this.statementDetailVisible = true
      StatementApi.detail(this.id).then(res => {
        this.statementDetail = res.data
      })
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
