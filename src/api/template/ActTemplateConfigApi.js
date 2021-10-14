import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 */

export function detail (id) {
  return request({
    url: BASE_URL + '/template/config/detail/' + id,
    method: 'get'
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} templateId 必须：模板ID
 *        {String} style 必须：样式数据，json序列化
 *        {String} data 必须：素材列表或其它数据，json序列化
 */
export function update (options) {
  return request({
    url: BASE_URL + '/template/config/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
