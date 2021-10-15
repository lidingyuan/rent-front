<template>
  <div class="layout-navbar">
    <ScrollBox>
      <div style="display:flex;align-items: center;height: 100%;">
        <ZlTag
          v-for="(page,index) in activePageList"
          :key="page.path"
          style="height: 100%;margin: 0 16px;flex-shrink:0;"
          :class="{active:$route.path === page.path}"
          @contextmenu="contextmenu($event,index)"
          @click="changePage(page)"
          @close="closeThis(index)"
        >
          {{ page.name }}
        </ZlTag>
      </div>
    </ScrollBox>
    <FollowMenu
      :active.sync="menuVisible"
      :position="position"
      class="navbar-menu"
    >
      <div
        class="menu-item"
        @click="menuVisible=false;refresh(currentIndex)"
      >
        刷新
      </div>
      <div
        class="menu-item"
        @click="menuVisible=false;closeThis(currentIndex)"
      >
        关闭
      </div>
      <div
        class="menu-item"
        @click="menuVisible=false;closeOther(currentIndex)"
      >
        关闭其他
      </div>
      <div
        class="menu-item"
        @click="menuVisible=false;closeAll(currentIndex)"
      >
        关闭全部
      </div>
    </FollowMenu>
  </div>
</template>

<script>
export default {
  name: 'LayoutNavbar',
  props: {
    activePageList: Array
  },
  data () {
    return {
      menuVisible: false,
      position: [0, 0],
      currentIndex: null
    }
  },
  watch: {
    activePageList () {
      if (!this.activePageList.length) {
        this.returnParentPage()
      }
    }
  },
  methods: {
    changePage (page) {
      this.$emit('openPage', page)
    },
    closeThis (index) {
      const list = [...this.activePageList]
      list.splice(index, 1)
      const nextIndex = index ? index - 1 : 0
      list.length && this.$emit('openPage', list[nextIndex])
      this.$emit('update:activePageList', list)
    },
    closeOther (index) {
      const list = [this.activePageList[index]]
      list.length && this.$emit('openPage', list[0])
      this.$emit('update:activePageList', list)
    },
    closeAll () {
      this.$emit('update:activePageList', [])
    },
    refresh (index) {
      const page = this.activePageList[index]
      if (page.path !== this.$route.path) {
        this.$router.push({ path: page.path })
      }
      this.$emit('refreshPage')
    },
    contextmenu (event, index) {
      this.menuVisible = true
      this.position = [event.pageX, event.pageY]
      this.currentIndex = index
    },
    returnParentPage () {
      const matched = this.$route.matched
      const parent = matched[matched.length - 2]
      if (!parent.redirect) {
        this.$router.push({ path: parent.path })
        return
      }
      if (parent.redirect !== this.$route.path) {
        this.$router.push({ path: parent.redirect })
        return
      }
      // 路由不改变，没有添加活跃page，补偿一个
      this.$emit('update:activePageList', [this.$route])
    }
  }
}
</script>
