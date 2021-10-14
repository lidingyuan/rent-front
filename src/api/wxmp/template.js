
import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_WEIXIN_BASE_URL

/**
 * 模板列表查询接口
 */
export function list () {
  return request({
    url: BASE_URL + '/mp/template/list',
    method: 'get'
  })
}
/**
 * 步模板列表接口，返回true表示成功
 */
export function sync () {
  return request({
    url: BASE_URL + '/mp/template/sync',
    method: 'post'
  })
}
