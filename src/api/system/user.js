import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BOP_BASE_URL

/**
 * 当前用户信息
 */
export function info () {
  return request({
    url: BASE_URL + '/uc/user/info',
    method: 'get',
    headers: { 'X-App-Delegate': '1436152338003546113' },
    params: { website: process.env.VUE_APP_SITE }
  })
}
