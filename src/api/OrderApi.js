import request from '@/core/utils/request'

/**
 * 新增
 * @param {Object} options
 *        {Integer} projectId 必须：项目id
 *        {LocalDate} date 必须：日期
 *        {String} type 必须：类型
 *        {String} detail 必须：详细信息
 */
export function save (options) {
  return request({
    url: '/order/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {Integer} projectId 必须：项目id
 *        {LocalDate} date 必须：日期
 *        {String} type 必须：类型
 *        {String} detail 必须：详细信息
 */
export function update (options) {
  return request({
    url: '/order/update',
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
    url: '/order/remove/' + id,
    method: 'delete'
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
    url: '/order/detail/' + id,
    method: 'get'
  })
}

/**
 * 查询
 * @param {Object} queryParam
 */
export function list (queryParam = {}) {
  return request({
    url: '/order/list',
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
    url: '/order/page',
    method: 'get',
    params: { ...page, ...queryParam }
  })
}
