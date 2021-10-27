import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import router from './modules/router'
import project from './modules/project'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    router,
    user,
    project
  }
})

export default store
