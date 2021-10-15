import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout'
import ErrorPage404 from '@/views/error/ErrorPage404'

Vue.use(VueRouter)

export const defaultAliveAppList = ['Home', 'AppList']

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login'),
    name: '登录',
    meta: { title: '登录', icon: 'dashboard' }
  },
  {
    path: '/',
    name: '首页',
    isApp: true,
    component: Layout,
    redirect: '/home',
    meta: { icon: 'dashboard', id: '0', idPath: '0', hideSide: true, hideAppMenu: true, hideNav: true },
    children: [
      {
        path: '/home',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Home'),
        name: '',
        meta: { icon: 'dashboard', id: '0', idPath: '0' }
      }
    ]
  },
  {
    path: '/app-list-layout',
    name: '应用',
    isApp: true,
    component: Layout,
    redirect: '/app-list',
    meta: { icon: 'dashboard', id: '1', idPath: '1', hideSide: true, hideAppMenu: true, hideNav: true },
    children: [
      {
        path: '/app-list',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/AppList'),
        name: '',
        meta: { icon: 'dashboard', id: '1', idPath: '1' }
      }
    ]
  }
]

export const endRoutes = [
  // 404 page must be placed at the end !!!
  { path: '/404', component: ErrorPage404 },
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  // mode: 'history', //后端支持可开
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export function clearRouter () {
  router.matcher = new VueRouter({
    // mode: 'history', //后端支持可开
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  }).matcher
}

export default router
