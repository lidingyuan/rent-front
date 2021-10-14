import request from '@/utils/request'

export function signature () {
  return request({ url: '/activity/oss/signature', method: 'get' })
}
