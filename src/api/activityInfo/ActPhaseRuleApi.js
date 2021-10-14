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
    url: BASE_URL + '/act/phase/rule/listByPhaseId',
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
 *        {String} position 必须：1-前置约束，2-后置约束
 *        {String} beanName 必须：规则bean名称
 *        {String} content 必须：规则内容
 *        {String} enabled 必须：是否启用，0否，1是
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/phase/rule/save',
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
 *        {String} position 必须：1-前置约束，2-后置约束
 *        {String} beanName 必须：规则bean名称
 *        {String} content 必须：规则内容
 *        {String} enabled 必须：是否启用，0否，1是
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/phase/rule/update',
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
    url: BASE_URL + '/act/phase/rule/remove/' + id,
    method: 'delete'
  })
}
