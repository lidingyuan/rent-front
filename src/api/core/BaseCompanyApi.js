import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 获取商业公司
 * @param {Object} options
 *
 */

export function list (options) {
  return request({
    url: BASE_URL + '/core/company/compList',
    method: 'get',
    params: options
  })
}

/**
 * 获取权限内商业公司
 *
 */

export function authComps () {
  return request({
    url: BASE_URL + '/core/company/authComps',
    method: 'get'
  })
}

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 */

export function page (options) {
  return request({
    url: BASE_URL + '/core/company/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} areaCode 必须：区域编码
 *        {String} areaName 必须：区域名称
 *        {String} parentId 必须：父级ID
 *        {Integer} compId 必须：
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/company/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} areaCode 必须：区域编码
 *        {String} areaName 必须：区域名称
 *        {String} parentId 必须：父级ID
 *        {Integer} compId 必须：
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/company/update',
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
    url: BASE_URL + '/core/company/remove/' + id,
    method: 'delete'
  })
}
