import { dynamicRoutes, constantRoutes } from '@/router'

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
    GenerateRoutes ({ commit }, authorities) {
      return new Promise(resolve => {
        let accessedRoutes
        if (authorities.includes('admin')) {
          accessedRoutes = dynamicRoutes
        } else {
          accessedRoutes = filterAsyncRoutes(dynamicRoutes, authorities)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export default router
