import request from '@/core/utils/request'

/**
 * 新增
 * @param {Object} options
 *        {String} name 必须：客户名称
 *        {Integer} userId 必须：用户id
 */
export function save (options) {
  return request({
    url: '/customer/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} name 必须：客户名称
 *        {Integer} userId 必须：用户id
 */
export function update (options) {
  return request({
    url: '/customer/update',
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
    url: '/customer/remove',
    method: 'delete',
    params: { id }
  })
}

/**
 * 详情
 * @param {String} id ID
 */
export function detail (id) {
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('参数错误')
  }
  return request({
    url: '/customer/detail/' + id,
    method: 'get'
  })
}

/**
 * 查询
 * @param {Object} queryParam
 */
export function list (queryParam = {}) {
  return request({
    url: '/customer/list',
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
    url: '/customer/page',
    method: 'get',
    params: { ...page, ...queryParam }
  })
}
