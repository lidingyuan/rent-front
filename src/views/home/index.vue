<template>
  <div class="home">
    <div
      style="flex-grow:3;width:3px;"
      class="column"
    >
      <div class="row">
        <div
          style="flex-grow:1;width:1px;"
          class="column"
        >
          <ToDo />
          <MsgCenter />
        </div>
        <NewsCenter />
      </div>
      <ToDoDetail />
    </div>
    <Navigation />
  </div>
</template>

<script>
import ToDo from './components/ToDo.vue'
import ToDoDetail from './components/ToDoDetail.vue'
import NewsCenter from './components/NewsCenter.vue'
import Navigation from './components/Navigation.vue'
import MsgCenter from './components/MsgCenter.vue'
export default {
  name: 'Home',
  components: { ToDo, ToDoDetail, NewsCenter, Navigation, MsgCenter },
  data () {
    return {
      //
    }
  },
  created () {
    //
  },
  methods: {
    //
  }
}
</script>

<style lang='scss' scoped>
.home{
  width: 100%;
  height: 100%;
  display: flex;
  .row{
    display: flex;
    width: 100%;
  }
  .column{
    display: flex;
    flex-direction: column;
  }
}
</style>
