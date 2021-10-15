import request from '@/core/utils/request'

export function login (loginInfo) {
  return request({
    url: '/login',
    method: 'post',
    data: loginInfo
  })
}

export function logout () {
  return request({
    url: '/logout',
    method: 'post'
  })
}
