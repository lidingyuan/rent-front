import router, { clearRouter, endRoutes } from '../router/index'

import store from '../../store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { Message } from 'element-ui'
import { getToken } from '@/core/utils/auth'
import { initData } from '@/core/service/baseDataService'
// white list, will not redirect
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  // 直接跳转到登录界面
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      if (!store.getters['user/name']) {
        // clearRouter()
        // 拉取用户信息
        store.dispatch('user/GetInfo').then(res => {
          const menus = store.getters['user/menus']
          generateRoutes(menus).then(() => {
            // set the replace: true, so the navigation will not leave a history record
            initData().then(() => {
              next({ ...to, replace: true })
              // router.replace(to)
            })
          })
        }).catch((err) => {
          console.log(err)
          // store.dispatch('user/FedLogout').then(() => {
          //   // Message.error(err || '身份信息失效, 请尝试重新登录')
          //   next({ path: '/' })
          // })
          NProgress.done()
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.find(item => to.path.startsWith(item))) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
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
