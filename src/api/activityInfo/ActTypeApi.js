import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 查询
 */

export function list () {
  return request({
    url: BASE_URL + '/act/type/list',
    method: 'get'
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} code 必须：编码
 *        {String} name 必须：名称
 *        {String} config 必须：配置内容
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/type/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} code 必须：编码
 *        {String} name 必须：名称
 *        {String} config 必须：配置内容
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/type/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：活动类型id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/act/type/remove/' + id,
    method: 'delete'
  })
}
