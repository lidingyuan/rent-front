import request from '@/core/utils/request'

export function login (loginInfo) {
  return request({
    url: `/login?username=${loginInfo.username}&password=${loginInfo.password}&captcha=${loginInfo.checkcode}`,
    method: 'post'
  })
}

export function logout () {
  return request({
    url: '/logout',
    method: 'post'
  })
}
