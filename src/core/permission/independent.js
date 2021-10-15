import router, { clearRouter, endRoutes } from '../router/index'

import store from '../../store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import menus from './routes.json'

let generate = false

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (!generate) {
    generateRoutes(menus).then(() => {
      generate = true
      // router.replace(to)
      next(to)
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

async function generateRoutes (menus) {
  await store.dispatch('router/GenerateRoutes', menus)
  const routes = store.getters['router/addRoutes'].concat(endRoutes)
  clearRouter()
  routes.forEach(route => {
    router.addRoute(route)
  })
}
