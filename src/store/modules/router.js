import { endRoutes, constantRoutes } from '@/core/router'
import { getDynamicRoutes } from '@/core/router/dynamicRoutes'

/**
 * Use meta.auth to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (authorities, route) {
  if (route.meta && route.meta.auth) {
    return authorities.some(auth => route.meta.auth === auth)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, authorities) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(authorities, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authorities)
      }
      res.push(tmp)
    }
  })

  return res
}

const router = {
  namespaced: true,

  state: {
    routes: constantRoutes,
    addRoutes: null,
    appList: []
  },

  getters: {
    routes: state => state.routes,
    addRoutes: state => state.addRoutes,
    appList: state => state.appList
  },

  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes).concat(endRoutes)
      state.appList = state.routes.filter(item => item.isApp).map(route => {
        return {
          name: route.name,
          path: route.path,
          meta: route.meta,
          menuList: route.children || [],
          currentPage: route.redirect,
          activePageList: []
        }
      })
    }
  },
  actions: {
    GenerateRoutes ({ commit }, menus) {
      return new Promise(resolve => {
        const accessedRoutes = getDynamicRoutes(menus)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export default router
