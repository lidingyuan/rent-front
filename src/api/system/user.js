import request from '@/core/utils/request'

/**
 * 当前用户信息
 */
export function info () {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function changePassword (data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data
  })
}
