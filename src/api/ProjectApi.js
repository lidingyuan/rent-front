import request from '@/core/utils/request'

/**
 * 新增
 * @param {Object} options
 *        {String} name 必须：项目名称
 *        {Integer} customerId 必须：客户id
 */
export function save (options) {
  return request({
    url: '/project/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} name 必须：项目名称
 *        {Integer} customerId 必须：客户id
 */
export function update (options) {
  return request({
    url: '/project/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id ID
 */
export function del (id) {
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('参数错误')
  }
  return request({
    url: '/project/remove',
    method: 'delete',
    params: { id }
  })
}

/**
 * 查询
 * @param {Object} queryParam
 */
export function list (queryParam = {}) {
  return request({
    url: '/project/list',
    method: 'get',
    params: queryParam
  })
}

/**
 * 查询
 * @param {Object} queryParam
 */
export function projectPriceList (queryParam = {}) {
  return request({
    url: '/project/projectPriceList',
    method: 'get',
    params: queryParam
  })
}

/**
 * 分页查询
 * @param {Object} page
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 * @param {Object} queryParam
 */
export function page (page, queryParam = {}) {
  return request({
    url: '/project/page',
    method: 'get',
    params: { ...page, ...queryParam }
  })
}
