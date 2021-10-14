<template>
  <div class="dashboard-page">
    <el-tabs type="border-card">
      <el-tab-pane lazy>
        <span slot="label"><i class="el-icon-tickets"></i> 活动查询</span>
        <!-- <keep-alive></keep-alive> -->
        <div class="tab-component">
          <act-tab></act-tab>
        </div>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label"><i class="el-icon-document-checked"></i> 问卷查询</span>
        <!-- <keep-alive></keep-alive> -->
        <div class="tab-component">
          <paper-tab></paper-tab>
        </div>
      </el-tab-pane>
      <el-tab-pane lazy>
        <span slot="label"><i class="el-icon-present"></i> 抽奖查询</span>
        <div class="tab-component">
          <lucky-tab></lucky-tab>
        </div>
      </el-tab-pane>
      <el-tab-pane lazy >
        <span slot="label"><i class="el-icon-camera"></i> 扫码查询</span>
        <div class="tab-component">
          <scan-tab></scan-tab>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ActTab from './components/ActTab'
import PaperTab from './components/PaperTab'
import LuckyTab from './components/LuckyTab'
import ScanTab from './components/ScanTab'

export default {
  name: 'dashboard',
  components: {
    ActTab,
    PaperTab,
    LuckyTab,
    ScanTab
  },
  props: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  methods: {},
  computed: {},
  watch: {},
  beforeDestroy () {
    // TODO是否销毁缓存在session的值
  }
}
</script>

<style lang='scss' scoped>
.dashboard-page{
  height: 100%;
}
.tab-component{
  width: 100%;
  overflow: auto;
  height: calc(100vh - 170px - 2rem);
}
</style>
