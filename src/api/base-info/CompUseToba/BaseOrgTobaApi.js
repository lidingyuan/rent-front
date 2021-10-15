import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 */

export function page (options) {
  return request({
    url: BASE_URL + '/core/baseOrgtoba/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {Integer} compId 必须：
 *        {Integer} tobaId 必须：
 *        {String} types 必须：
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/baseOrgtoba/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {Integer} compId 必须：
 *        {Integer} tobaId 必须：
 *        {String} types 必须：
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/baseOrgtoba/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：标签id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/core/baseOrgtoba/remove/' + id,
    method: 'delete'
  })
}
