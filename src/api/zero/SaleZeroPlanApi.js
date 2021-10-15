import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 新增
 * @param {Object} options
 *        {String} planCode 必须：计划编号
 *        {String} planTitle 必须：计划标题
 *        {LocalDate} endDate 必须：计划上报截止日
 *        {String} planYear 必须：计划年
 *        {String} state 必须：计划状态 0未发布 ，1已发布
 */
export function save (options) {
  return request({
    url: BASE_URL + '/allocation/zeroPlan/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} planCode 必须：计划编号
 *        {String} planTitle 必须：计划标题
 *        {LocalDate} endDate 必须：计划上报截止日
 *        {String} planYear 必须：计划年
 *        {String} state 必须：计划状态 0未发布 ，1已发布
 */
export function update (options) {
  return request({
    url: BASE_URL + '/allocation/zeroPlan/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 发布
 * @param {String} id ID
 */
export function submit (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/zeroPlan/submit',
    method: 'put',
    params: queryParam
  })
}

/**
 * 取消发布
 * @param {String} id ID
 */
export function cancel (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/zeroPlan/cancel',
    method: 'put',
    params: queryParam
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
    url: BASE_URL + '/allocation/zeroPlan/remove/' + id,
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
    url: BASE_URL + '/allocation/zeroPlan/detail/' + id,
    method: 'get'
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
    url: BASE_URL + '/allocation/zeroPlan/page',
    method: 'get',
    params: { ...page, ...queryParam }
  })
}
