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
    url: BASE_URL + '/core/base-dest/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {int} compId 必须：公司id
 *        {String} destName 必须：到货点名称
 *        {String} destAddress 必须：到货点地址
 *        {String} destCode 必须：到货点国家局编码
 *        {String} isActive 必须：是否启用 1启用 0 停用
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/base-dest/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} compId 必须：公司id
 *        {String} destName 必须：到货点名称
 *        {String} destAddress 必须：到货点地址
 *        {String} destCode 必须：到货点国家局编码
 *        {String} isActive 必须：是否启用 1启用 0 停用
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/base-dest/update',
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
    url: BASE_URL + '/core/base-dest/remove/' + id,
    method: 'delete'
  })
}

/**
 * 根据地市ID获取到货地址
 * @param {Object} options
 *        {int} compId 必要：公司ID
 */
export function listByCompId (compId) {
  return request({
    url: BASE_URL + '/core/base-dest/listByCompId?compId=' + compId,
    method: 'get'
  })
}
