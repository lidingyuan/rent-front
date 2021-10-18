import Vue from 'vue'
import App from './App.vue'
import router from './core/router'
import store from './store'

import ElementUI from 'element-ui'

import '@/core/directive'
import '@/core/mixin/zlMixin'

import '@/core/components/globalComp'

import '@/core/utils'

import '@/permission'

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
