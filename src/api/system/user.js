import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BOP_BASE_URL

/**
 * 当前用户信息
 */
export function info () {
  return request({
    url: BASE_URL + '/user/info',
    method: 'get'
  })
}
