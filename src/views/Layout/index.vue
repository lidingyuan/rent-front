<template>
  <div
    layout
    class="layout-container"
  >
    <LayoutHeader
      :active-app-list.sync="activeAppList"
      :current-app.sync="currentApp"
    />
    <div class="layout-body">
      <LayoutSiderbar
        v-if="!currentApp.meta.hideSide"
        :menu-list="currentApp.menuList"
        @openPage="openPage"
      />
      <div class="layout-content">
        <LayoutNavbar
          v-if="!currentApp.meta.hideNav"
          :active-page-list.sync="currentApp.activePageList"
          @openPage="openPage"
          @refreshPage="refreshPage"
        />
        <div class="layout-page">
          <keep-alive
            :include="alivePageList"
            :exclude="temporaryPageList"
            :max="10"
          >
            <component
              :is="currentPage"
              v-if="componentShow"
            />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LayoutHeader from './LayoutHeader'
import LayoutSiderbar from './LayoutSiderbar'
import LayoutNavbar from './LayoutNavbar'
import EmptyPage from './EmptyPage'
import { mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: { LayoutHeader, LayoutSiderbar, LayoutNavbar },
  data () {
    return {
      //
      activeAppList: [],
      currentApp: null,

      temporaryPageList: [],
      componentShow: true
    }
  },
  computed: {
    ...mapGetters('router', ['appList']),
    alivePageList () {
      const alivePageList = ['Home', 'AppList']
      this.activeAppList.forEach(app => {
        app.activePageList.forEach(page => {
          const name = page.matched[page.matched.length - 1].components?.default?.name
          name && alivePageList.push(name)
        })
      })
      return alivePageList
    },
    currentPage () {
      const components = this.$route.matched[this.$route.matched.length - 1].components?.default
      if (components && components.name !== 'Layout') {
        return components
      }
      return EmptyPage
    }
  },
  watch: {
    $route: {
      handler (route) {
        this.currentApp = this.appList.find(app => app.meta.id === this.$route.meta.idPath.split(',')[0]) || { meta: {}, activePageList: [] }
        if (!this.activeAppList.some(item => item === this.currentApp) && !this.currentApp.meta.hideAppMenu) {
          this.activeAppList.push(this.currentApp)
        }

        if (route.path !== this.currentApp.path) {
          this.currentApp.currentPage = route.path
          if (!this.currentApp.activePageList.some(item => item.path === route.path)) {
            this.currentApp.activePageList.push(route)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    //
    openPage (page) {
      if (this.$route.path !== page.path) {
        this.$router.push(page.path)
      }
    },
    refreshPage () {
      this.temporaryPageList.push(this.$route.matched[this.$route.matched.length - 1].components.default.name)
      this.componentShow = false
      this.$nextTick(() => {
        this.temporaryPageList.pop()
        this.componentShow = true
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.layout-container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .layout-body{
    height: 0;
    flex-grow: 1;
    display: flex;
    .layout-content{
      width: 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .layout-page{
        background: #F3F4F5;
        width: 100%;
        height: 0;
        flex-grow: 1;
      }
    }
  }
}
</style>
