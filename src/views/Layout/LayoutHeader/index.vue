<template>
  <div class="layout-header">
    <div
      ref="head-menu"
      class="head-menu"
    >
      <div
        v-for="route in constantRoutes"
        :key="route.path"
        class="menu-item"
        :class="{active:route.meta.id === currentApp.meta.id}"
        @click="to({
          currentPage:route.redirect || route.path
        })"
      >
        {{ route.name }}
      </div>
      <!-- 热门应用 -->
      <div
        v-for="app in favoriteAppList"
        :key="app.name"
        class="menu-item"
        :class="{active:app.meta.id === currentApp.meta.id}"
        @click="to(app)"
      >
        {{ app.name }}
      </div>
      <!-- 活跃应用 -->
      <template v-if="activeAppList.length">
        <div class="divider" />
        <div
          v-for="(app,index) in activeAppList"
          v-show="visibleSize>index"
          :key="app.name"
          class="menu-item"
          :class="{active:app.meta.id === currentApp.meta.id}"
          @click="to(app)"
          @dblclick="closeThis(index)"
        >
          {{ app.name }}
        </div>
        <div
          class="menu-item"
          :style="{visibility: visibleSize >= activeAppList.length?'hidden':''}"
          @click.stop="showMoreItems = !showMoreItems"
        >
          ···
        </div>
        <div
          v-transition:height="showMoreItems"
          class="more-items-transition"
          style="transition: all 0.3s"
          @click.stop=""
        >
          <div class="more-items">
            <div
              v-for="(app,index) in activeAppList.slice(visibleSize)"
              :key="app.name"
              class="menu-item"
              :class="{active:app.meta.id === currentApp.meta.id}"
              @click="to(app)"
              @dblclick="closeThis(index)"
            >
              {{ app.name }}
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="head-search" />
    <div class="head-news" />
    <div
      class="head-user"
      @click.stop="subMenuVisible = !subMenuVisible"
    >
      <div class="user-name">
        {{ userName }}
      </div>
      <div class="user-expand" />
      <div
        v-transition:height="subMenuVisible"
        class="head-sub-menu-transition"
        style="transition: all 0.3s"
        @click.stop=""
      >
        <div class="head-sub-menu">
          <div class="user-info">
            <div>
              <div class="user-name">
                {{ userName }}
              </div>
              <div class="user-motto" />
            </div>
          </div>
          <div class="user-theme">
            <div
              style="background: #3385FF;"
              @click="changeTheme('#3385FF')"
            />
            <div
              style="background: #009EAE;"
              @click="changeTheme('#009EAE')"
            />
            <div
              style="background: #5641A3;"
              @click="changeTheme('#5641A3')"
            />
            <div
              style="background: #FF702A;"
              @click="changeTheme('#FF702A')"
            />
            <div
              style="background: #F72C5B;"
              @click="changeTheme('#F72C5B')"
            />
          </div>
          <div class="user-operation">
            <div>
              <div class="change-info" />
              完善信息
            </div>
            <div>
              <div class="change-password" />
              修改密码
            </div>
            <div @click="logout">
              <div class="logout" />
              安全退出
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { constantRoutes } from '@/core/router'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LayoutHeader',
  props: {
    activeAppList: Array,
    currentApp: Object
  },
  data () {
    return {
      //
      favoriteAppList: [],
      position: [0, 0],
      constantRoutes: constantRoutes.filter(item => item.isApp),
      subMenuVisible: false,
      showMoreItems: false,
      visibleSize: 0
    }
  },
  computed: {
    ...mapGetters('router', ['appList']),
    ...mapGetters('user', { userName: 'name' }),
    filterAppList () {
      return this.appList.filter(item => !item.meta.hideAppMenu)
    }
  },
  watch: {
    activeAppList () {
      this.visibleSize = this.activeAppList.length
    },
    visibleSize () {
      this.$nextTick(() => {
        if (this.$refs['head-menu'].clientWidth !== this.$refs['head-menu'].scrollWidth && this.visibleSize > 0) {
          this.visibleSize--
        }
        if (this.visibleSize === this.activeAppList.length) {
          this.visibleSize = 99999
        }
      })
    }
  },
  created () {
    window.addEventListener('resize', this.resize)
    window.addEventListener('click', this.clear, false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('click', this.clear)
  },
  methods: {
    //
    ...mapActions('user', ['FedLogout']),
    to (app) {
      const path = app.currentPage || app.path
      if (this.$route.path !== path) {
        this.$router.push({ path })
      }
    },
    closeThis (index) {
      const list = [...this.activeAppList]
      list.splice(index, 1)
      const nextIndex = index ? index - 1 : 0
      this.$emit('update:activeAppList', list)
      list.length && this.$router.push({ path: list[nextIndex].currentPage })
    },
    logout () {
      this.FedLogout().then(() => {
        this.$router.push({ path: '/login' })
      })
    },
    resize () {
      this.visibleSize = this.activeAppList.length
    },
    changeTheme (color) {
      document.documentElement.setAttribute('newsale-theme', color)
    },
    clear () {
      this.subMenuVisible = false
      this.showMoreItems = false
    }
  }
}
</script>
<style lang="scss" scoped>
.layout-header{
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  .head-menu{
    position: relative;
    width: 0;
    height: 100%;
    flex-grow: 1;
    flex-shrink: 0;
    margin: 0 24px;
    display: flex;
    align-items: center;
    .menu-item{
      flex-shrink: 0;
      height: 100%;
      font-size: 16px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .divider{
      flex-shrink: 0;
      width: 1px;
      height: 36px;
      background: linear-gradient(rgba(255,255,255,0),rgba(255,255,255,1),rgba(255,255,255,0));
    }
    .more-items-transition{
      position: absolute;
      z-index: 1;
      top: 100%;
      right: 0;
      width: 336px;
      border-radius: 0 0 8px 8px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      .more-items{
        width: 336px;
        .menu-item{
          height: 56px;
          display: inline-flex;
          margin: 10px;
        }
      }
    }
  }
  .head-search{
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin: 18px;
    background: url('~@/assets/img/head-search.png') no-repeat center/100%;
    user-select: none;
    cursor: pointer;
  }
  .head-news{
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin: 18px;
    background: url('~@/assets/img/head-news.png') no-repeat center/100%;
    user-select: none;
    cursor: pointer;
  }
  .head-user{
    position: relative;
    display: flex;
    align-items: center;
    margin: 12px 20px;
    user-select: none;
    .user-img{
      width: 32px;
      height: 32px;
      border-radius: 16px;
      background-color: #ccc;
      cursor: pointer;
    }
    .user-name{
      font-size: 16px;
      color: #FFF;
      padding: 0 8px;
      cursor: pointer;
    }
    .user-expand{
      width: 14px;
      height: 14px;
      background: url('~@/assets/img/expand.png') no-repeat center/100%;
      cursor: pointer;
    }
    .head-sub-menu-transition{
      position: absolute;
      z-index: 99999;
      top: 100%;
      right: 0;
      margin-top: 12px;
      width: 336px;
      height: 300px;
      border-radius: 0 0 8px 8px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
    .head-sub-menu{
      width: 336px;
      height: 300px;
      background: url('~@/assets/img/head/head-sub-menu-background.png') no-repeat top center/100%;
      .user-info{
        height: 96px;
        padding: 0 24px;
        display: flex;
        align-items: center;
        .user-img{
          width: 48px;
          height: 48px;
          border-radius: 24px;
          background-color: #ccc;
        }
        .user-name{
          font-size: 18px;
          color: #333;
        }
        .user-motto{
          font-size: 12px;
          padding: 0 8px;
          color: #999;
        }
      }
      .user-theme{
        height: 64px;
        margin: 0 24px;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-around;
        align-items: center;
        >div{
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 4px;
        }
      }
      .user-operation{
        height: 132px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        >div{
          cursor: pointer;
          width: 96px;
          height: 92px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          &:hover{
            background: #f3f3f3;
          }
        }
        .change-info{
          width: 30px;
          height: 30px;
          background: url('~@/assets/img/head/change-info.png') no-repeat center;
          padding-bottom: 10px;
        }
        .change-password{
          width: 30px;
          height: 30px;
          background: url('~@/assets/img/head/change-password.png') no-repeat center;
          padding-bottom: 10px;
        }
        .logout{
          width: 30px;
          height: 30px;
          background: url('~@/assets/img/head/logout.png') no-repeat center;
          padding-bottom: 10px;
        }
      }
    }
  }
  .app-menu{
    width:80px;
    height:100px;
    font-size: 12px;
    transform-origin: top;
  }
  .app-menu-item{
    padding: 0 10px;
    line-height: 2em;
    user-select: none;
    cursor: pointer;
    &:hover{
      background: #ccc;
    }
  }
}
</style>
