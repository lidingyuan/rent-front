<template>
  <div class="page-list">
    <el-tabs tab-position="left">
      <el-tab-pane v-for="page in pageList" :key="page.id">
        <div style="width: 140px;text-align: center;" slot="label" @click="changePage(page)">{{page.name}}</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as ActTemplatePageApi from '@/api/template/ActTemplatePageApi'
export default {
  name: 'PageList',
  data () {
    return {
      //
      id: this.$route.query.templateId,
      pageList: [],
      formVisible: false
    }
  },
  created () {
    //
    ActTemplatePageApi.listByTemplateId(this.id).then(res => {
      this.pageList = res.data
      if (this.pageList.length) {
        this.$emit('activeUrlChange', this.pageList[0].url)
      }
    })
  },
  methods: {
    //
    changePage (page) {
      this.$emit('activeUrlChange', page.url)
    }
  }
}
</script>

<style lang='scss' scoped>
.page-list {
  padding: 20px 0 ;
  text-align: center;
}
</style>
