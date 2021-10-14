import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 省份列表
 */

export function provList () {
  return request({
    url: BASE_URL + '/district/provList',
    method: 'get'
  })
}

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 *        {string} provCode    非必须：省份名称
 */
export function list (options) {
  return request({
    url: BASE_URL + '/district/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 查询全部省市。用在活动增加时查询全部的
 */
export function listAll (options) {
  return request({
    url: BASE_URL + '/district/list',
    method: 'get'
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} provCode 必须：省份编码
 *        {String} provName 必须：省份名称
 *        {String} cityCode 必须：地市编码
 *        {String} cityName 必须：地市名称
 *        {number} orderTag 非必须：排序
 *        {String} remarks 非必须：备注
 */
export function save (options) {
  return request({
    url: BASE_URL + '/district/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {string} id 必须：主键id
 *        {String} provCode 必须：省份编码
 *        {String} provName 必须：省份名称
 *        {String} cityCode 必须：地市编码
 *        {String} cityName 必须：地市名称
 *        {number} orderTag 非必须：排序
 *        {String} remarks 非必须：备注
 */
export function update (options) {
  return request({
    url: BASE_URL + '/district/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：主键id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/district/remove/' + id,
    method: 'delete'
  })
}
