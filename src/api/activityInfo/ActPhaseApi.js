import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {string} actId 必须：活动id
 */

export function list (options) {
  return request({
    url: BASE_URL + '/act/phase/mapping/listByActId',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} phaseId 必须：环节ID
 *        {String} sourceType 必须：环节类型
 *        {String} entryUrl 必须：环节入口地址
 *        {Integer} status 必须：0停用，1启用
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/phase/mapping/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} phaseId 必须：环节ID
 *        {String} sourceType 必须：环节类型
 *        {String} entryUrl 必须：环节入口地址
 *        {Integer} status 必须：0停用，1启用
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/phase/mapping/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id 必要：环节id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/act/phase/mapping/remove/' + id,
    method: 'delete'
  })
}

/**
 * 删除
 * @param {String} id 必要：环节id
 */
export function trend (phaseId) {
  return request({
    url: BASE_URL + '/act/phase/participation/statisticsTrend',
    method: 'get',
    params: { phaseId }
  })
}

/**
 * 批量更新
 * @param {Array} 必要：更新的环节列表
 *    @param {String} 必要 id：环节id
 *    @param {String} 必要 actId：活动id
 *    @param {String} 必要 entryUrl：入口地址
 *    @param {Number} 必要 orderTag：排序
 *    @param {String} 必要 phaseName：环节名称
 */
export function updateBatch (options) {
  return request({
    url: BASE_URL + '/act/phase/mapping/updateBatch',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    method: 'put',
    data: options
  })
}
