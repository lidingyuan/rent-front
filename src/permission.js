import router from '@/core/router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { Message } from 'element-ui'
import { getToken } from '@/core/utils/auth'
import { initData } from '@/core/service/baseDataService'

import routes from '@/core/router/routes.json'
//
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
        store.dispatch('user/GetInfo').then(res => {
          const authority = res.data?.authority
          const filterRoutes = routes.filter(item => authority.includes(item.id))
          console.log(routes, authority)
          store.dispatch('router/GenerateRoutes', filterRoutes).then(() => {
            router.addRoutes(store.getters['router/addRoutes'])
            initData().then(() => {
              next({ ...to, replace: true })
            })
          })
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
