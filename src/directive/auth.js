/**
 * Deprecated !!!
 */
import Vue from 'vue'
import store from './store'

/**
 * 权限指令
 * eg：v-auth="'weixin:mp:tag:get'"
 * Deprecated，指令执行的时机，不适合处理权限问题，而且在某些情形下会直接Error
 */
Vue.directive('auth', {
  bind (el, binding) {
    const authorities = store.getters['user/authorities'] || []
    if (!authorities.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})
