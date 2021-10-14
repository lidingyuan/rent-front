import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 查询
 * @param {Object} options
 *        {string} actId 必须：活动Id
 */

export function listByPage (options) {
  return request({
    url: BASE_URL + '/act/notice/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} code 必须：公告编号
 *        {String} title 必须：公告标题
 *        {String} content 必须：公告内容
 *        {LocalDateTime} beginTime 必须：开始时间
 *        {LocalDateTime} endTime 必须：结束时间
 *        {Integer} status 必须：0待发布，1已发布
 *        {LocalDateTime} publishTime 必须：发布时间
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/notice/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} code 必须：公告编号
 *        {String} title 必须：公告标题
 *        {String} content 必须：公告内容
 *        {LocalDateTime} beginTime 必须：开始时间
 *        {LocalDateTime} endTime 必须：结束时间
 *        {Integer} status 必须：0待发布，1已发布
 *        {LocalDateTime} publishTime 必须：发布时间
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/notice/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：公告id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/act/notice/remove/' + id,
    method: 'delete'
  })
}
