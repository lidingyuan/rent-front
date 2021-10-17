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
      <div class="user-img" />
      <div class="user-name">
        Nicholas
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
            <div class="user-img" />
            <div>
              <div class="user-name">
                Nicholas
              </div>
              <div class="user-motto">
                编辑您的个人座右铭…
              </div>
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
            <div @click="dialogVisible = true;subMenuVisible = false">
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
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
    >
      <el-form
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="旧密码">
          <el-input
            v-model="passwordForm.oldpassword"
            type="password"
          />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="passwordForm.newpassword"
            type="password"
          />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input
            v-model="passwordForm.checkpassword"
            type="password"
          />
        </el-form-item>
        <el-button
          @click="changePassword"
        >
          更改密码
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { constantRoutes } from '@/core/router'
import { mapGetters, mapActions } from 'vuex'
import MD5 from 'crypto-js/md5'
import { changePassword } from '@/api/system/user'

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
      visibleSize: 0,
      dialogVisible: false,
      passwordForm: {
        oldpassword: '',
        newpassword: '',
        checkpassword: ''
      }
    }
  },
  computed: {
    ...mapGetters('router', ['appList']),
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
    },
    changePassword () {
      if (this.passwordForm.checkpassword !== this.passwordForm.newpassword) {
        return this.$message('新密码与确认新密码不同！')
      }
      if (this.passwordForm.oldpassword === this.passwordForm.newpassword) {
        return this.$message('新密码与旧密码相同！')
      }
      changePassword({
        oldpassword: MD5(this.passwordForm.oldpassword).toString(),
        newpassword: MD5(this.passwordForm.newpassword).toString()
      }).then(res => {
        this.dialogVisible = false
        this.$message('修改成功')
      })
    }
  }
}
</script>
