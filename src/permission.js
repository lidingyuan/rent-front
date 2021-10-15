import router from '@/core/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { Message } from 'element-ui'
import { getToken } from '@/core/utils/auth'
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
      next()
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
