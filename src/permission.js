import router from './router/index'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
// white list, will not redirect
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  console.log(getToken())
  NProgress.start()
  // 直接跳转到登录界面
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      if (!store.getters['user/name']) {
        // 拉取用户信息
        store.dispatch('user/GetInfo').then(res => {
          const authorities = store.getters['user/authorities']
          store.dispatch('router/GenerateRoutes', authorities).then(() => {
            router.addRoutes(store.getters['router/addRoutes'])
          })
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          initData().then(() => {
            next({ ...to, replace: true })
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

// 基础数据
function initData () {
  return new Promise((resolve, reject) => {
    const promises = [
      store.dispatch('baseData/SearchAreaList'),
      store.dispatch('baseData/SearchTobaList'),
      store.dispatch('baseData/SearchActType'),
      store.dispatch('baseData/SearchRuleList')
    ]
    Promise.all(promises).then(() => {
      resolve()
    }).catch(err => {
      reject(err)
    })
  })
}
