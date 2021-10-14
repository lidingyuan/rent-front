import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import router from './modules/router'
import tagsView from './modules/tagsView'
import baseData from './modules/baseData'
import flowData from './modules/flowData'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    router,
    tagsView,
    baseData,
    flowData
  }
})

// const debug = process.env.NODE_ENV !== 'production'
// if (debug) {
//   console.log(store)
// }

export default store
