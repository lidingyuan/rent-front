import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_SCAN_BASE_URL
const WEIXIN_URL = process.env.VUE_APP_WEIXIN_BASE_URL

/**
 * 扫码数据-各省份扫码
 * @param {String} beginDate 必要：开始日期
 * @param {String} endDate 必要：结束日期
 */
export function listByProv (options) {
  return request({
    url: BASE_URL + '/statistics/listScansByProv',
    method: 'get',
    params: options
  })
}

/**
 * 扫码数据-某省份个城市扫码
 * @param {String} beginDate 必要：开始日期
 * @param {String} endDate 必要：结束日期
 * @param {String} provCode 必要：省份id
 */
export function listByCity (options) {
  return request({
    url: BASE_URL + '/statistics/listScansByCity',
    method: 'get',
    params: options
  })
}

/**
 * 扫码数据-按卷烟
 * @param {String} beginDate 必要：开始日期
 * @param {String} endDate 必要：结束日期
 */
export function listByToba (options) {
  return request({
    url: BASE_URL + '/statistics/listScansByToba',
    method: 'get',
    params: options
  })
}

/**
 * 扫码趋势
 */
export function trend (options) {
  return request({
    url: BASE_URL + '/statistics/listScanTrend',
    method: 'get'
  })
}

/**
 * 锁定用户列表
 */
export function lockUserList (options) {
  return request({
    url: BASE_URL + '/lock-user/listByPage',
    method: 'get',
    params: options
  })
}
/**
 * 1、查询粉丝列表
 * @param {int} current 必须：当前页数
 * @param {int} total 必须：查询到的总条数
 * @param {int} size 必须：当前页的总条数
 * @param {string} searchText 可选：粉丝ID、openID或手机号
 */
export function userListByPage (options) {
  return request({
    url: WEIXIN_URL + '/mp/user/listByPage',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options,
    params: { current: options.current, size: options.size, total: options.total }
  })
}
/**
 * 1、查询粉丝列表
 */
export function userListByIds (options) {
  return request({
    url: WEIXIN_URL + '/mp/user/listByIds',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 解锁
 */
export function unlock (options) {
  return request({
    url: BASE_URL + '/lock-user/unlock',
    method: 'post',
    params: options
  })
}
/**
 * 锁定
 */
export function lock (options) {
  return request({
    url: BASE_URL + '/lock-user/lock',
    method: 'post',
    params: options
  })
}
