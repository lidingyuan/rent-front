import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 查询
 * @param {Object} options
 *        {string} actId 必须：活动id
 */

export function listByPage (options) {
  return request({
    url: BASE_URL + '/act/visible/rule/listByActId',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} type 必须： 1-可见规则，2-参与规则。（现在无该字段）
 *        {String} beanName 必须：规则bean
 *        {String} content 必须：规则内容
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/visible/rule/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} beanName 必须：规则bean
 *        {String} content 必须：规则内容
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/visible/rule/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：活动可见约束id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/act/visible/rule/remove/' + id,
    method: 'delete'
  })
}
