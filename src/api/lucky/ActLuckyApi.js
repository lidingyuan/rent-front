import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 *        {string} actId    不必须：活动ID
 */

export function listByPage (options) {
  return request({
    url: BASE_URL + '/lucky/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 列表查询，不包括已结束或终止的抽奖
 */

export function listNonTerminated () {
  return request({
    url: BASE_URL + '/lucky/listNonTerminated',
    method: 'get'
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} code 必须：抽奖游戏编码
 *        {String} name 必须：抽奖游戏名称
 *        {LocalDateTime} beginTime 必须：开始时间
 *        {LocalDateTime} endTime 必须：结束时间
 *        {String} refreshPoolPre 必须：上期结余处理，1顺延，0不顺延。只在首次刷新时处理
 *        {BigDecimal} refreshPoolRatio 必须：首次刷新比例
 *        {String} status 必须：0-草稿，1-生效，2-中止
 *        {Number} orderTag 非必须
 */
export function save (options) {
  return request({
    url: BASE_URL + '/lucky/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} code 必须：抽奖游戏编码
 *        {String} name 必须：抽奖游戏名称
 *        {LocalDateTime} beginTime 必须：开始时间
 *        {LocalDateTime} endTime 必须：结束时间
 *        {String} refreshPoolPre 必须：上期结余处理，1顺延，0不顺延。只在首次刷新时处理
 *        {BigDecimal} refreshPoolRatio 必须：首次刷新比例
 *        {String} status 必须：0-草稿，1-生效，2-中止
 */
export function update (options) {
  return request({
    url: BASE_URL + '/lucky/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id 必要：抽奖id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/lucky/remove/' + id,
    method: 'delete'
  })
}

/**
 * 详情
 * @param {String} id 必要：抽奖id
 */
export function detail (id) {
  return request({
    url: BASE_URL + '/lucky/detail/' + id,
    method: 'get'
  })
}

/**
 * 根据时间段查询
 * @param {String} beginDate 必要：开始日期
 * @param {String} endDate 必要：结束日期
 */
export function listByCondition (options) {
  return request({
    url: BASE_URL + '/lucky/listByCondition',
    method: 'get',
    params: options
  })
}
