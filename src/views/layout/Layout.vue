<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar/>
      <tags-view/>
      <app-main v-if="!forceChangePassword"/>
      <el-row class="copyright">
        <el-col :xs="24">杭州州力数据科技有限公司©2018</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain, Sidebar, TagsView } from './components'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: { Navbar, AppMain, Sidebar, TagsView },
  computed: {
    ...mapGetters('app', [
      'sidebar'
    ]),
    ...mapGetters('user', [
      'forceChangePassword'
    ]),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "@/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }

    .main-container {
      position: relative;
      padding-top: 80px;
    }

    .copyright {
      height: 2rem;
      font-size: 0.8rem;
      line-height: 2rem;
      text-align:center;
    }
  }
</style>
