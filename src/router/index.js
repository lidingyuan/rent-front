import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout.vue'
import blank from '@/views/blank'

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             optional
 * meta : {
     roles: ['admin','editor']    will control the page roles (you can set multiple roles)
     title: 'title'               the name show in submenu and breadcrumb (recommend set)
     icon: 'svg-name'             the icon show in the sidebar
     noCache: true                if true, the page will no be cached(default is false)
     breadcrumb: true             if false, the item will hidden in breadcrumb(default is true)
     auth: 'authCode'             auth settings
   }
 */

/**
 * constant routes
 * no permission required
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: '登录',
    meta: { title: '登录', icon: 'dashboard' }
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import(/* webpackChunkName: "documentationIndex" */ '@/views/home'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard' }
      },
      { path: '/404', component: () => import(/* webpackChunkName: "errorPage" */ '@/views/errorPage/404'), hidden: true, meta: { title: '404' } },
      { path: '/403', component: () => import(/* webpackChunkName: "errorPage" */ '@/views/errorPage/403'), hidden: true, meta: { title: '403' } }
    ]
  }
]

/**
 * dynamic routes
 * permission required
 */
export const dynamicRoutes = [
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/manage',
    meta: { title: '活动清单', icon: 'activity' },
    children: [
      {
        path: '/activity/manage',
        name: 'ActConfig',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/activityInfo/ActConfig'),
        meta: { title: '活动清单', icon: 'activityList', auth: 'activity:activity:config:get' }
      },
      {
        hidden: true,
        path: '/activity/notice',
        name: 'ActNotice',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/activityInfo/ActNotice'),
        meta: { title: '活动公告', icon: 'dashboard' }
      },
      {
        hidden: true,
        path: '/activity/configRule',
        name: 'ActConfigRule',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/activityInfo/ActConfigRule'),
        meta: { title: '活动约束', icon: 'dashboard' }
      },
      {
        hidden: true,
        path: '/activity/phase',
        name: 'ActPhase',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/activityInfo/ActPhase'),
        meta: { title: '活动环节', icon: 'dashboard' }
      },
      {
        hidden: true,
        path: '/activity/phaseRule',
        name: 'ActPhaseRule',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/activityInfo/ActPhaseRule'),
        meta: { title: '约束列表', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/activityConfig',
    component: Layout,
    redirect: '/activity/lucky',
    meta: { title: '活动配置', icon: 'integral' },
    children: [
      {
        path: '/activityConfig/lucky',
        component: blank,
        redirect: '/activityConfig/lucky/manage',
        meta: { title: '扫码抽奖', icon: 'component' },
        children: [
          {
            path: '/activityConfig/lucky/manage',
            name: 'ActLucky',
            component: () => import(/* webpackChunkName: "lucky" */ '@/views/modules/lucky/ActLucky'),
            meta: { title: '扫码抽奖', icon: 'fans', auth: 'activity:lucky:lucky:get' }
          },
          {
            hidden: true,
            path: '/activityConfig/lucky/prize',
            name: 'ActLuckyPrize',
            component: () => import(/* webpackChunkName: "lucky" */ '@/views/modules/lucky/ActLuckyPrize'),
            meta: { title: '奖项管理', icon: 'folder' }
          },
          {
            hidden: true,
            path: '/activityConfig/lucky/spy',
            name: 'ActLuckySpy',
            component: () => import(/* webpackChunkName: "lucky" */ '@/views/modules/lucky/ActLuckySpy'),
            meta: { title: '名单管理', icon: 'user' }
          }
        ]
      },
      {
        path: '/paper',
        component: blank,
        meta: { title: '问卷调查', icon: 'component' },
        redirect: '/activityConfig/paper/manage',
        children: [
          {
            path: '/activityConfig/paper/manage',
            name: 'ActPaper',
            component: () => import(/* webpackChunkName: "paper" */ '@/views/modules/paper/ActPaper'),
            meta: { title: '问卷调查', icon: 'form', auth: 'activity:paper:paper:get' }
          },
          {
            hidden: true,
            path: '/activityConfig/paper/question',
            name: 'ActPaperQuestion',
            component: () => import(/* webpackChunkName: "paper" */ '@/views/modules/paper/ActPaperQuestion'),
            meta: { title: '问题管理', icon: 'dashboard', auth: 'activity:paper:question:get' }
          }
        ]
      },
      {
        path: '/activityConfig/tuike',
        name: 'ActTuike',
        component: () => import(/* webpackChunkName: "tuike" */ '@/views/modules/tuike/ActTuike'),
        meta: { title: '推荐激励', icon: 'form', auth: 'scan:tuike:rule:get' }
      },
      {
        path: '/activityConfig/box-collect',
        name: 'ActBoxCollect',
        component: () => import(/* webpackChunkName: "box-collect" */ '@/views/modules/boxCollect/ActBoxCollect'),
        meta: { title: '扫码集盒', icon: 'form', auth: 'scan:collect:rule:get' }
      },
      {
        path: '/1/DisplayIncentive',
        name: 'DisplayIncentive',
        component: blank,
        meta: { title: '陈列激励', icon: 'form', auth: 'scan:collect:rule:get' }
      },
      {
        path: '/activityConfig/DisplayCompetition',
        name: 'DisplayCompetition',
        component: blank,
        meta: { title: '陈列竞赛', icon: 'form', auth: 'scan:collect:rule:get' }
      }
    ]
  },
  {
    path: '/displayManage',
    component: Layout,
    redirect: '/displayManage/incentiveAudit',
    meta: { title: '陈列活动管理', icon: 'component' },
    children: [
      {
        path: '/displayManage/incentiveAudit',
        name: 'displayIncentiveAudit',
        component: blank,
        meta: { title: '陈列激励审核', icon: 'form' }
      },
      {
        path: '/displayManage/incentiveReview',
        name: 'displayIncentiveReview',
        component: blank,
        meta: { title: '陈列激励复核', icon: 'form' }
      },
      {
        path: '/displayManage/competeAudit',
        name: 'displayCompeteAudit',
        component: blank,
        meta: { title: '陈列竞赛审核', icon: 'form' }
      },
      {
        path: '/displayManage/competeReview',
        name: 'displayCompeteReview',
        component: blank,
        meta: { title: '陈列竞赛筛选', icon: 'form' }
      }
    ]
  },
  {
    path: '/track',
    component: Layout,
    meta: { title: '数据查询', icon: 'component' },
    redirect: '/track/scan',
    children: [
      {
        path: '/track/scanluck',
        name: 'ActScanluck',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/track/ActScanluck'),
        meta: { title: '扫码抽奖活动开展情况', icon: 'activityList', auth: 'activity:activity:config:get' }
      },
      {
        path: '/track/scanbox',
        name: 'ActScanbox',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/track/ActScanbox'),
        meta: { title: '扫码集盒活动开展情况', icon: 'activityList', auth: 'activity:activity:config:get' }
      },
      {
        path: '/track/recommend',
        name: 'Recommend',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/track/Recommend'),
        meta: { title: '推荐激励活动开展情况', icon: 'activityList', auth: 'activity:activity:config:get' }
      },
      {
        path: '/track/scanmember',
        name: 'ActScanmember',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/track/ActScanmember'),
        meta: { title: '扫码抽奖活动会员参与情况', icon: 'activityList', auth: 'activity:activity:config:get' }
      },
      {
        path: '/track/paper',
        name: 'Actpaper',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/track/Actpaper'),
        meta: { title: '问卷调查活动开展情况', icon: 'activityList', auth: 'activity:activity:config:get' }
      },
      {
        path: '/track/paperStatistics',
        name: 'ActpaperStatistics',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/track/ActpaperStatistics'),
        meta: { title: '问卷调查活动答题次数统计', icon: 'activityList', auth: 'activity:activity:config:get' }
      },
      {
        path: '/track/pointStatistics',
        name: 'MemberPointStatistics',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/track/MemberPointStatistics'),
        meta: { title: '用户积分变动监控', icon: 'activityList', auth: 'member:point:record:get' }
      }
    ]
  },
  {
    path: '/material',
    component: Layout,
    meta: { title: '素材管理', icon: 'component' },
    redirect: '/material/manage',
    children: [
      {
        path: '/material/manage',
        name: 'ActMaterial',
        component: () => import(/* webpackChunkName: "material" */ '@/views/modules/material/ActMaterial'),
        meta: { title: '素材管理', icon: 'example', auth: 'activity:material:oss:get' }
      },
      {
        hidden: true,
        path: '/material/mapping',
        name: 'ActMaterialMapping',
        component: () => import(/* webpackChunkName: "material" */ '@/views/modules/material/ActMaterialMapping'),
        meta: { title: '素材关联', icon: 'link' }
      }
    ]
  },
  {
    path: '/pubCode',
    component: Layout,
    hidden: true,
    meta: { title: '活动规则配置', icon: 'component' },
    redirect: '/pubCode/add',
    children: [
      {
        path: '/pubCode/list',
        name: 'pubCodeList',
        component: () => import(/* webpackChunkName: "pubCode" */ '@/views/modules/pubCode'),
        meta: { title: '活动规则配置', icon: 'example' }
      },
      {
        path: '/pubCode/add',
        name: 'pubCodeAdd',
        // hidden: true,
        component: () => import(/* webpackChunkName: "pubCodeAdd" */ '@/views/modules/pubCode/components/EditPub.vue'),
        meta: { title: '活动规则配置新增', icon: 'example' }
      }
    ]
  },
  {
    path: '/template/page',
    name: 'templatePage',
    component: () => import(/* webpackChunkName: "pubCode" */ '@/views/modules/template/TemplatePage'),
    meta: { title: '模板应用', icon: 'example' }
  },

  {
    path: '/documentation',
    component: Layout,
    meta: { title: '使用说明', icon: 'component' },
    hidden: true,
    redirect: '/documentation/index',
    children: [
      {
        path: '/documentation/index',
        component: () => import(/* webpackChunkName: "documentationIndex" */ '@/views/documentation'),
        name: 'DocumentationIndex',
        meta: { title: '使用说明', icon: 'share' }
      }
    ]
  },
  {
    path: '/scan',
    component: Layout,
    redirect: '/scan/manage',
    meta: { title: '异常扫码管理', icon: 'component' },
    children: [
      {
        path: '/scan/manage',
        name: 'ScanRule',
        component: () => import(/* webpackChunkName: "scan" */ '@/views/modules/scan/ScanRule'),
        meta: { title: '异常扫码管理', icon: 'tobacco', auth: 'scan:lock:user:get' }
      }
    ]
  },
  {
    path: '/baseInfo',
    component: Layout,
    redirect: '/baseInfo/tobacco',
    meta: { title: '基础信息设置', icon: 'component' },
    children: [
      {
        path: '/baseInfo/tobacco',
        name: 'ActTobacco',
        component: () => import(/* webpackChunkName: "baseInfo" */ '@/views/modules/baseInfo/ActTobacco'),
        meta: { title: '卷烟管理', icon: 'tobacco', auth: 'activity:basics:tobacco:get' }
      },
      {
        hidden: true,
        path: '/baseInfo/tobaccoSkin',
        name: 'ActTobaccoSkin',
        component: () => import(/* webpackChunkName: "baseInfo" */ '@/views/modules/baseInfo/ActTobaccoSkin'),
        meta: { title: '卷烟皮肤', icon: 'tobacco' }
      },
      {
        path: '/baseInfo/district',
        name: 'ActDistrict',
        component: () => import(/* webpackChunkName: "baseInfo" */ '@/views/modules/baseInfo/ActDistrict'),
        meta: { title: '区域管理', icon: 'district', auth: 'activity:basics:district:get' }
      },
      {
        path: '/baseInfo/goods',
        name: 'ActGoods',
        component: () => import(/* webpackChunkName: "baseInfo" */ '@/views/modules/baseInfo/ActGoods'),
        meta: { title: '物资管理', icon: 'goods', auth: 'activity:basics:goods:get' }
      },
      {
        path: '/activity/type',
        name: 'ActType',
        component: () => import(/* webpackChunkName: "activity" */ '@/views/modules/activityInfo/ActType'),
        meta: { title: '活动类型', icon: 'activityType', auth: 'activity:activity:type:get' }
      },
      {
        path: '/integral/manage',
        name: 'ActIntegral',
        component: () => import(/* webpackChunkName: "integral" */ '@/views/modules/integral/ActIntegral'),
        meta: { title: '积分管理', icon: 'integral' }
      },
      {
        path: '/template',
        component: blank,
        meta: { title: '模板活动管理', icon: 'component' },
        redirect: '/template/list',
        children: [
          {
            path: '/template/list',
            name: 'TemplateList',
            component: () => import(/* webpackChunkName: "template" */ '@/views/modules/template/TemlpateList'),
            meta: { title: '模板列表', icon: 'example' }
          },
          {
            path: '/template/ActTemplate',
            name: 'ActTemplate',
            component: () => import(/* webpackChunkName: "pubCode" */ '@/views/modules/template/ActTemplate'),
            meta: { title: '模板管理', icon: 'example' }
          }
        ]
      },
      {
        path: '/act/publish',
        name: 'ActPublish',
        component: () => import(/* webpackChunkName: "actPublish" */ '@/views/modules/template/ActPublish'),
        meta: { title: '活动管理新', icon: 'promotion' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
