import request from '@/core/utils/request'

const BASE_URL = '/rent/user'
/**
 * 当前用户信息
 */
export function info () {
  return request({
    url: BASE_URL + '/info',
    method: 'get'
  })
}

export function changePassword (data) {
  return request({
    url: BASE_URL + '/changePassword',
    method: 'post',
    data
  })
}
