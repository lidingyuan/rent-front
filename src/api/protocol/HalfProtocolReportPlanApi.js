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
    url: BASE_URL + '/protocol/reportPlan/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} halfYear 必须：年份
 *        {String} halfType 必须：半年标识，0上半年 1下半年
 *        {String} title 必须：标题
 *        {String} code 必须：编码
 *        {String} version 必须：版本号
 *        {String} status 必须：状态 0草稿 1发布
 *        {LocalDate} deadline 必须：上报截止时间
 */
export function save (options) {
  return request({
    url: BASE_URL + '/protocol/reportPlan/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} halfYear 必须：年份
 *        {String} halfType 必须：半年标识，0上半年 1下半年
 *        {String} title 必须：标题
 *        {String} code 必须：编码
 *        {String} version 必须：版本号
 *        {String} status 必须：状态 0草稿 1发布
 *        {LocalDate} deadline 必须：上报截止时间
 */
export function update (options) {
  return request({
    url: BASE_URL + '/protocol/reportPlan/update',
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
    url: BASE_URL + '/protocol/reportPlan/remove/' + id,
    method: 'delete'
  })
}

/**
 * 获取单据编号
 */
export function getCode () {
  return request({
    url: BASE_URL + '/protocol/reportPlan/getCode',
    method: 'get'
  })
}

/**
 * 初始化参数集
 */
export function init () {
  return request({
    url: BASE_URL + '/protocol/reportPlan/init',
    method: 'get'
  })
}

/**
 * 发布
 * @param {String} id 必要：标签id
 */
export function pub (id) {
  return request({
    url: BASE_URL + '/protocol/reportPlan/publish/' + id,
    method: 'post'
  })
}
