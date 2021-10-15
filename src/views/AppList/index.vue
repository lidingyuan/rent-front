<template>
  <div class="app-list">
    <div
      v-for="app in filterAppList"
      :key="app.path"
      class="app-list-item"
      @click="to(app)"
    >
      <div class="app-icon" />
      <div class="app-text">
        <div class="app-name">
          {{ app.name }}
        </div>
        <div class="app-description">
          应用简介
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppList',
  computed: {
    ...mapGetters('router', ['appList']),
    filterAppList () {
      return this.appList.filter(item => !item.meta.hideAppMenu)
    }
  },
  methods: {
    to (app) {
      this.$router.push({ path: app.path })
    }
  }
}
</script>

<style lang='scss' scoped>
.app-list{
  .app-list-item{
    width: 216px;
    height: 96px;
    background: #FFFFFF;
    border-radius: 4px;
    margin: 24px;
    padding: 0 21px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
    .app-icon{
      width: 32px;
      height: 32px;
      background-color: #D8D8D8;
    }
    .app-text{
      margin: 0 8px;
      .app-name{
        font-size: 16px;
        color: #333333;
        line-height: 16px;
        margin-bottom: 8px;
      }
      .app-description{
        font-size: 14px;
        color: #999999;
        line-height: 20px;
      }
    }
  }
}
</style>
