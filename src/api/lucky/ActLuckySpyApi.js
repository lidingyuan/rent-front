import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 */

export function listByPage (options) {
  return request({
    url: BASE_URL + '/lucky/spy/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} luckyId 必须：抽奖游戏ID
 *        {String} userId 必须：用户ID
 *        {LocalDateTime} beginTime 必须：生效开始时间
 *        {LocalDateTime} endTime 必须：截止时间
 *        {String} type 必须：1-白名单，2-黑名单
 */
export function save (options) {
  return request({
    url: BASE_URL + '/lucky/spy/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} luckyId 必须：抽奖游戏ID
 *        {String} userId 必须：用户ID
 *        {LocalDateTime} beginTime 必须：生效开始时间
 *        {LocalDateTime} endTime 必须：截止时间
 *        {String} type 必须：1-白名单，2-黑名单
 */
export function update (options) {
  return request({
    url: BASE_URL + '/lucky/spy/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：黑（白）名单id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/lucky/spy/remove/' + id,
    method: 'delete'
  })
}
