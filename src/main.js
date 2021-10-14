import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'

import '@/styles/index.scss'

import VueClipboard from 'vue-clipboard2'
import App from './App.vue'
import router from './router'
import store from './store'
import Xcrud from 'xcrud'

import '@/permission'
import '@/icons'
import '@/utils'
import filters from '@/filters'

// 修改el-table属性，默认高亮显示当前选中行
ElementUI.Table.props.highlightCurrentRow.default = true

window.Vue = Vue
// --- end 编辑器配置

Vue.use(ElementUI).use(VueClipboard)
Vue.use(Xcrud)

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

Vue.config.productionTip = false

/**
 * 全局权限检查
 * 配合v-if使用  v-if="$auth('weixin:mp:tag:get')"
 */
Vue.prototype.$auth = code => {
  const authorities = store.getters['user/authorities'] || []
  return authorities.indexOf(code) >= 0
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
