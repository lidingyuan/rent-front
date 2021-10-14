import request from '@/utils/request'

/**
 * 当前API文件已弃，未使用
 */
const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 查询
 */

export function listByPage () {
  return request({
    url: BASE_URL + '/act/phase/type/list',
    method: 'get'
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} code 必须：环节编码
 *        {String} name 必须：环节名称
 *        {String} entryUrl 必须：入口地址
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/phase/type/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} code 必须：环节编码
 *        {String} name 必须：环节名称
 *        {String} entryUrl 必须：入口地址
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/phase/type/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：环节类型id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/act/phase/type/remove/' + id,
    method: 'delete'
  })
}
