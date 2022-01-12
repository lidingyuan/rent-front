import request from '@/core/utils/request'

const BASE_URL = '/rent'
export function login (loginInfo) {
  return request({
    url: BASE_URL + '/login',
    method: 'post',
    data: loginInfo
  })
}

export function logout () {
  return request({
    url: BASE_URL + '/logout',
    method: 'post'
  })
}
