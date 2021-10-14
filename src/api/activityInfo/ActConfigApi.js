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
    url: BASE_URL + '/act/config/listPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} code 必须：活动编号
 *        {String} name 必须：活动名称
 *        {LocalDateTime} advanceTime 必须：活动预热时间
 *        {LocalDateTime} beginTime 必须：活动开始时间
 *        {LocalDateTime} endTime 必须：活动结束时间
 *        {LocalDateTime} expiredTime 必须：活动失效时间
 *        {String} tobaId 必须：活动卷烟
 *        {String} districtCode 必须：活动区域
 *        {String} type 必须：活动类型
 *        {String} target 必须：零售户01，消费者02
 *        {String} linkUrl 必须：活动链接
 *        {String} tagId 必须：活动标签
 *        {String} pop 必须：是否是热门活动，0否，1是
 *        {Integer} status 必须：0-草稿，1-生效，2-中止
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/config/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} code 必须：活动编号
 *        {String} name 必须：活动名称
 *        {LocalDateTime} advanceTime 必须：活动预热时间
 *        {LocalDateTime} beginTime 必须：活动开始时间
 *        {LocalDateTime} endTime 必须：活动结束时间
 *        {LocalDateTime} expiredTime 必须：活动失效时间
 *        {String} tobaId 必须：活动卷烟
 *        {String} districtCode 必须：活动区域
 *        {String} type 必须：活动类型
 *        {String} target 必须：零售户01，消费者02
 *        {String} linkUrl 必须：活动链接
 *        {String} tagId 必须：活动标签
 *        {String} pop 必须：是否是热门活动，0否，1是
 *        {Integer} status 必须：0-草稿，1-生效，2-中止
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/config/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * @description: 修改活动状态
 * @param {String} actId 必须：活动id
 * @param {Number} status 必须：状态
 * @author: LCX
 * @date: 2021-04-12 14:41:47
 * @version: V1.0.0
*/
export function updateStatus (options) {
  return request({
    url: BASE_URL + '/act/config/status',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id 必要：活动id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/act/config/remove/' + id,
    method: 'delete'
  })
}

/**
 * 根据活动id查询活动详情
 * @param {String} actId 必要：活动id
 */
export function detail (id) {
  return request({
    url: BASE_URL + '/act/config/detail/' + id,
    method: 'get'
  })
}

/**
 * 首页-筛选活动
 * @param {String} beginDate 必要：开始日期
 * @param {String} endDate 必要：结束日期
 * @param {String} districtCode 必要：区域id
 * @param {String} tobaId 必要：卷烟id
 */
export function listByCondition (options) {
  return request({
    url: BASE_URL + '/act/config/listByCondition',
    method: 'get',
    params: options
  })
}
