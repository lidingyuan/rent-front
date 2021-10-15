import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 新增
 * @param {Object} options
 *        {LocalDate} billDate 必须：单据日期
 *        {String} billCode 必须：单据编号
 *        {LocalDate} beginDate 必须：到货开始日期
 *        {LocalDate} endDate 必须：到货结束日期
 *        {Integer} compId 必须：公司
 *        {String} ifTray 必须：是否托盘 0否，1是
 *        {String} addressId 必须：到货地址
 *        {Json} detailList[{Integer} tobaId 必须 :卷烟id,{Double} firstHalf 必须:上半年需求,{Double} secondHalf 必须:下半年需求]
 */
export function save (options) {
  return request({
    url: BASE_URL + '/allot/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} billCode 必须：单据编号
 *        {LocalDate} beginDate 必须：到货开始日期
 *        {LocalDate} endDate 必须：到货结束日期
 *        {Integer} compId 必须：公司
 *        {String} ifTray 必须：是否托盘 0否，1是
 *        {String} addressId 必须：到货地址
 *        {Json} detailList[{Integer} tobaId 必须 :卷烟id,{Double} firstHalf 必须:上半年需求,{Double} secondHalf 必须:下半年需求]
 */
export function update (options) {
  return request({
    url: BASE_URL + '/allot/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

export function del (id) {
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('参数错误')
  }
  return request({
    url: BASE_URL + '/allot/remove?id=' + id,
    method: 'delete'
  })
}

/**
 * 提交
 * @param {String} id ID
 */
export function sub (id) {
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('参数错误')
  }
  return request({
    url: BASE_URL + '/allot/submit?id=' + id,
    method: 'put'
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
    url: BASE_URL + '/allot/detail?id=' + id,
    method: 'get'
  })
}
/**
 * 获取权限内商业公司
 *
 */

export function authComps () {
  return request({
    url: BASE_URL + '/core/tree/cityTreeAuth',
    method: 'get'
  })
}
/**
 * 获取上报人管辖地市
 * @param {*} planId 计划id
 */
export function getComp (planId) {
  if (!planId) {
    // eslint-disable-next-line no-console
    console.error('参数错误')
  }
  return request({
    url: BASE_URL + '/allocation/choice/getComp?planId=' + planId,
    method: 'get'
  })
}

/**
 * 填报分页查询
 * @param {Object} page
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 * @param {Object} queryParam
 */
export function page (page, queryParam = {}) {
  return request({
    url: BASE_URL + '/allot/page',
    method: 'get',
    params: { ...page, ...queryParam }
  })
}

/**
 * 卷烟
 * @param {Object} options
 *        {Integer} compId 必须：
 */
export function list (queryParam = {}) {
  return request({
    url: BASE_URL + '/core/base-comp-toba/list',
    method: 'get',
    params: queryParam
  })
}

/**
 * 审批
 * @param {String} id ID
 */
export function approve (id) {
  return request({
    url: BASE_URL + '/allot/audit/approve?ids=' + id,
    method: 'put'
  })
}

/**
 * 驳回
 * @param {String} id ID
 */
export function reject (id) {
  return request({
    url: BASE_URL + '/allot/audit/reject?id=' + id,
    method: 'put'
  })
}

/**
 * 获取状态
 */
export function getState () {
  return request({
    url: BASE_URL + '/allot/audit/getState',
    method: 'get'
  })
}
