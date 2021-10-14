/**
 * 异步路由。
 *
 * 远程调用服务端获取用户菜单列表，根据菜单列表，动态生成路由信息
 */

import { constantRoutes } from '@/router' // 获取组件的方法
import Layout from '@/views/layout/Layout.vue'
import _import from '@/router/_import'
import { arrayToTree } from '@/utils/arrays.js'
import { isExternal } from '@/utils/strings.js'

/**
 * 递归构建路由表
 * vue store==vuex提供了全局的状态信息
 *
 * @param routes asyncRouteMap
 * @param roles
 */
function filterAsyncRoutes (asyncRouteMap) { // 遍历后台传来的路由信息，构建组件对象
  const accessedRoutes = asyncRouteMap.map(route => {
    const newRoute = { path: route.path }
    if (route.component) {
      if (route.component === 'Layout') { // Layout组件特殊处理
        newRoute.component = Layout
      } else if (!isExternal(route.path)) {
        newRoute.component = _import(route.component)
      }
    }
    if (route.redirect && route.redirect !== 'noredirect') {
      newRoute.redirect = route.redirect
    }

    newRoute.meta = { title: route.name, icon: route.icon, noCache: route.keepAlive === '0' }

    if (route.children && route.children.length) {
      newRoute.children = filterAsyncRoutes(route.children)
    }
    return newRoute
  })
  return accessedRoutes
}

const router = {
  namespaced: true,

  state: {
    routes: constantRoutes,
    addRoutes: []
  },

  getters: {
    routes: state => state.routes,
    addRoutes: state => state.addRoutes
  },

  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      const asyncRoutes = data.menus || []
      return new Promise(resolve => {
        let accessedRoutes = filterAsyncRoutes(arrayToTree(asyncRoutes, { key: 'id', parentKey: 'pid', children: 'children' }))
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve()
      })
    }
  }
}

export default router
