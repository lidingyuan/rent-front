<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" :max="8"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews () {
      return this.$store.getters['tagsView/cachedViews']
    },
    key () {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /* 50px = navbar  */
  /* 2rem = copy-right */
  min-height: calc(100vh - 80px - 2rem);
  position: relative;
  padding: 5px 10px;
  overflow: hidden;
  background-color: #eee;
}
</style>
