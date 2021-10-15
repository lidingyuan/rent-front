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
    url: BASE_URL + '/core/basePrefixConfig/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} resourceId 必须：业务场景id，也为权限id
 *        {String} prefix 必须：业务场景前缀
 *        {String} classUrl 必须：业务场景流程号service类的相对地址
 *        {String} methodName 必须：获取流水号方法名
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/basePrefixConfig/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} resourceId 必须：业务场景id，也为权限id
 *        {String} prefix 必须：业务场景前缀
 *        {String} classUrl 必须：业务场景流程号service类的相对地址
 *        {String} methodName 必须：获取流水号方法名
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/basePrefixConfig/update',
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
    url: BASE_URL + '/core/basePrefixConfig/remove/' + id,
    method: 'delete'
  })
}

/**
 * 初始化
 */
export function init () {
  return request({
    url: BASE_URL + '/core/basePrefixConfig/init',
    method: 'get'
  })
}
