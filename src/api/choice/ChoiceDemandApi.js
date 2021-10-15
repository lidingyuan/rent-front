import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 查询计划列表
 * @param {*} year 年
 * @param {*} state 状态
 */
export function list (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/choice/list',
    method: 'get',
    params: queryParam
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} planId 必须：计划id,关联sale_choice_plan
 *        {LocalDate} billDate 必须：单据日期
 *        {String} billCode 必须：单据编号
 *        {Integer} compId 必须：公司id
 *        {LocalDate} beginDate 必须：开始日期
 *        {LocalDate} endDate 必须：结束日期
 *        {String} addressId 必须：到货地址
 *        {String} email 必须：
 *        {String} consignee 必须：收件人
 *        {String} phone 必须：电话
 *        {String} receiveAddress 必须：收到地址
 *        {String} ifTray 必须：是否托盘 0否 1是
 */
export function save (options) {
  return request({
    url: BASE_URL + '/allocation/choice/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} planId 必须：计划id,关联sale_choice_plan
 *        {LocalDate} billDate 必须：单据日期
 *        {String} billCode 必须：单据编号
 *        {Integer} compId 必须：公司id
 *        {LocalDate} beginDate 必须：开始日期
 *        {LocalDate} endDate 必须：结束日期
 *        {String} addressId 必须：到货地址
 *        {String} email 必须：
 *        {String} consignee 必须：收件人
 *        {String} phone 必须：电话
 *        {String} receiveAddress 必须：收到地址
 *        {String} ifTray 必须：是否托盘 0否 1是
 */
export function update (options) {
  return request({
    url: BASE_URL + '/allocation/choice/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 详情
 * @param {*} planId 计划id
 * @param {*} addressId 公司地址id
 */
export function detail (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/choice/detail',
    method: 'get',
    params: queryParam
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
 * 备货需求提报
 * @param {*} planId 备货计划id
 * @param {*} compId 公司id
 */
export function submit (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/choice/submit',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    params: queryParam
  })
}
