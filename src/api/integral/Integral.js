import request from '@/utils/request'

// const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 1.0 05根据Phone查信息
 * @param {Object} options
*        {string} userId    必须：用户ID
 */

export function integraPhone (phone) {
  return request({
    url: '/weixin/mp/user/getByPhone?phone=' + phone,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get'
  })
}

/**
 * 1.1 查询用户积分账户（服务端调用）
 * @param {Object} options
*        {string} userId    必须：用户ID
 */

export function integralList (userId) {
  return request({
    url: '/member/account/info?userId=' + userId,
    method: 'get'
  })
}

/**
 * 1.2 查询用户积分流水（服务端调用）
 * @param {Object} options
 *        {string} current 必须：当前页数
 *        {string} total   必须：查询到的总条数
 *        {string} size    必须：当前页的总条数
 *        {string} userId    必须：用户ID
 */

export function integralRecord (options) {
  return request({
    url: '/member/point/record',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    data: options
  })
}

/**
 * 1.3 增加积分
 * @param {Object} options
*         sourceId    string  必须  来源id
*         sourceType  string  必须  来源类型
*         sourceName  string  必须  来源名称
*         point       number  必须  积分数额
*         userId      string  必须  用户id
*         visible     string  非必须  0流水查询不可见,1流水查询可见,默认 1
 */

export function integrlAdd (options) {
  return request({
    url: '/member/point/manager-add',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    data: options
  })
}
/**
* 1.4 扣减积分
* @param {Object} options
*         sourceId    string  必须  来源id
*         sourceType  string  必须  来源类型
*         sourceName  string  必须  来源名称
*         point       number  必须  积分数额
*         userId      string  必须  用户id
*         visible     string  非必须  0流水查询不可见,1流水查询可见,默认 1
 */

export function integralReduce (options) {
  return request({
    url: '/member/point/manager-reduce',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    data: options
  })
}
