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
    url: BASE_URL + '/paper/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} code 必须：问卷编码
 *        {String} name 必须：问卷名称
 *        {LocalDateTime} beginTime 必须：开始时间
 *        {LocalDateTime} endTime 必须：结束时间
 *        {Integer} itemNum 必须：问题个数，当需要从题库中随机挑选问题时，使用此字段。为-1时不挑选，使用全部问题
 *        {Integer} type 必须：1-抽奖型问卷，2-普通问卷
 *        {String} completed 必须：是否必须填写完整，0否，1是
 *        {String} rewritable 必须：是否允许重复保存,0否，1是
 *        {String} open 必须：0固定人员填写，1开放式填写
 *        {String} verify 必须：是否校验回答准确性，0否，1是
 *        {String} status 必须：0-草稿，1-生效，2-中止
 */
export function save (options) {
  return request({
    url: BASE_URL + '/paper/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} code 必须：问卷编码
 *        {String} name 必须：问卷名称
 *        {LocalDateTime} beginTime 必须：开始时间
 *        {LocalDateTime} endTime 必须：结束时间
 *        {Integer} itemNum 必须：问题个数，当需要从题库中随机挑选问题时，使用此字段。为-1时不挑选，使用全部问题
 *        {Integer} type 必须：1-抽奖型问卷，2-普通问卷
 *        {String} completed 必须：是否必须填写完整，0否，1是
 *        {String} rewritable 必须：是否允许重复保存,0否，1是
 *        {String} open 必须：0固定人员填写，1开放式填写
 *        {String} verify 必须：是否校验回答准确性，0否，1是
 *        {String} status 必须：0-草稿，1-生效，2-中止
 */
export function update (options) {
  return request({
    url: BASE_URL + '/paper/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id 必要：问卷id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/paper/remove/' + id,
    method: 'delete'
  })
}

/**
 * 详情
 * @param {String} id 必要：问卷id
 */
export function detail (id) {
  return request({
    url: BASE_URL + '/paper/detail/' + id,
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
    url: BASE_URL + '/paper/listByCondition',
    method: 'get',
    params: options
  })
}

/**
 * 查询回答人数和人次
 * @param {String} beginDate 必要：开始日期
 * @param {String} endDate 必要：结束日期
 */
export function answerStatisticsTrend (paperId) {
  return request({
    url: BASE_URL + '/paper/answer/statisticsTrend',
    method: 'get',
    params: { paperId }
  })
}

/**
 * 查询总的参与人数和人次
 * @param {String} beginDate 必要：开始日期
 * @param {String} endDate 必要：结束日期
 */
export function answerStatistics (paperId) {
  return request({
    url: BASE_URL + '/paper/answer/statistics',
    method: 'get',
    params: { paperId }
  })
}
