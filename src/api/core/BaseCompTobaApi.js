import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 新增
 * @param {Object} options
 *        {Integer} compId 必须：
 */
export function list (queryParam = {}) {
  return request({
    url: BASE_URL + '/core/base-comp-toba/list',
    method: 'get',
    params: queryParam
  })
}
/**
 * 修改
 * @param {Object} options
 * 参数示例 {compId:123,[{compId:123,tobaId:1},{compId:123,tobaId:3},{compId:123,tobaId:12}]}
 *        {Integer} compId 必须：
 *        {Integer} tobaId 必须：
 *        {String} types 可选：
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/base-comp-toba/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
