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
    url: BASE_URL + '/core/sys-process-setting/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} resourceId 必须：资源ID
 *        {String} authId 必须：角色/用户ID
 *        {String} powerId 必须：操作权限ID
 *        {String} oprationType 必须：操作类型 1 PASS 0 CANCLE
 *        {String} preState 必须：操作前置状态
 *        {String} nextState 必须：操作通过状态
 *        {String} ifSupper 必须：操作通过是否影响上级
 *        {String} haveAll 必须：是否前置状态完全满足 1完全 0 具有
 *        {String} backState 必须：操作驳回状态
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/sys-process-setting/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} resourceId 必须：资源ID
 *        {String} authId 必须：角色/用户ID
 *        {String} powerId 必须：操作权限ID
 *        {String} oprationType 必须：操作类型 1 PASS 0 CANCLE
 *        {String} preState 必须：操作前置状态
 *        {String} nextState 必须：操作通过状态
 *        {String} ifSupper 必须：操作通过是否影响上级
 *        {String} haveAll 必须：是否前置状态完全满足 1完全 0 具有
 *        {String} backState 必须：操作驳回状态
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/sys-process-setting/update',
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
    url: BASE_URL + '/core/sys-process-setting/remove/' + id,
    method: 'delete'
  })
}
/**
 * 加载初始化数据
 *
 */
export function resourceList () {
  return request({
    url: BASE_URL + '/core/sys-process-setting/resourceList',
    method: 'get'
  })
}

/**
 * 获取授权对象集合
 * @param {String} setId 必要：配置id
 */
export function getAuths (setId) {
  return request({
    url: BASE_URL + '/core/sys-process-setting/authList/' + setId,
    method: 'get'
  })
}
