import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 查询
 */

export function list () {
  return request({
    url: BASE_URL + '/act/rule/type/list',
    method: 'get'
  })
}
