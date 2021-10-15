import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 零点行动可上报日期
 * @param {*} planId 计划id
 * @param {*} compId 公司id
 */
export function getDate (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/zeroDemand/getDate',
    method: 'get',
    params: queryParam
  })
}

/**
 * 新增
 * @param {Object} options
 *      {json} zeroMainList:[
 *        {String} planId 必须：零点行动计划id
 *        {String} billCode 必须：单据编号
 *        {LocalDate} arrivalDate 必须：到货日期
 *        {Integer} compId 必须：公司ID
 *        {String} ifTray 必须：是否托盘 0否，1是
 *        {String} addressId 必须：到货地址
 *        {json} zeroDetailList:[
 *          {Integer} tobaId 必须：卷烟ID
 *          {number} secondHalf 非必须：使用本年下半年需求
 *          {number} firstHalf 非必须：使用明年下半年需求
 *    ]
 * ]
 */
export function save (options) {
  return request({
    url: BASE_URL + '/allocation/zeroDemand/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *    {json} zeroMainList:[
 *        {String} id 必须：零点行动需求id
 *        {String} planId 必须：零点行动计划id
 *        {String} billCode 必须：单据编号
 *        {LocalDate} arrivalDate 必须：到货日期
 *        {Integer} compId 必须：公司ID
 *        {String} ifTray 必须：是否托盘 0否，1是
 *        {String} addressId 必须：到货地址
 *        {json} zeroDetailList:[
 *        {Integer} tobaId 必须：卷烟ID
 *        {number} secondHalf 非必须：使用本年下半年需求
 *        {number} firstHalf 非必须：使用明年下半年需求
 *    ]
 * ]
 */
export function update (options) {
  return request({
    url: BASE_URL + '/allocation/zeroDemand/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 获取填报单据
 * @param {String} planId 计划id
 */
export function billList (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/zeroDemand/billList',
    method: 'get',
    params: queryParam
  })
}

/**
 * 详情
 * @param {String} id 单据id
 */
export function detail (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/zeroDemand/detail',
    method: 'get',
    params: queryParam
  })
}

/**
 * 零点行动需求提交
 * @param {String} planId 计划id
 * @param {Integer} compId 公司id

 */
export function submit (queryParam = {}) {
  return request({
    url: BASE_URL + '/allocation/zeroDemand/submit',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    params: queryParam
  })
}

/**
 * 查询公司
 * @param {String} planId
 */
export function getComp (planId) {
  return request({
    url: BASE_URL + '/allocation/zeroDemand/getComp?planId=' + planId,
    method: 'get'
  })
}

/**
 * 零点行动填报计划列表
 * @param {*} year 年
 */
export function list (year) {
  return request({
    url: BASE_URL + '/allocation/zeroDemand/list',
    method: 'get',
    params: { year }
  })
}
/**
 * 卷烟
 * @param {Object} options
 *        {Integer} compId 必须：
 */
export function tobalist (queryParam = {}) {
  return request({
    url: BASE_URL + '/core/base-comp-toba/list',
    method: 'get',
    params: queryParam
  })
}
