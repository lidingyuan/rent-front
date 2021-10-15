import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BOP_BASE_URL

/**
 * 获取页面最新版本
 */
export function latestOne (menuId) {
  return request({
    url: BASE_URL + '/uc/page-release/latestOne',
    method: 'get',
    headers: { 'X-App-Delegate': '1436152338003546113' },
    params: {
      menuId
    }
  })
}

/**
 * 获取页面最新版本
 */
export function menuList () {
  return request({
    url: BASE_URL + '/uc/menu/list',
    method: 'get',
    headers: { 'X-App-Delegate': '1436152338003546113' },
    params: { site: process.env.VUE_APP_SITE }
  })
}
