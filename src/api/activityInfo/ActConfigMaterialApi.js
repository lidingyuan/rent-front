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
    url: BASE_URL + '/act/config/material/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} url 必须：图片地址
 *        {String} type 必须：ICON-图标，
THUMB-缩略图，
POSTER-海报,
VOICE-语音，
VIDEO-视频
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/config/material/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} url 必须：图片地址
 *        {String} type 必须：ICON-图标，
THUMB-缩略图，
POSTER-海报,
VOICE-语音，
VIDEO-视频
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/config/material/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：素材id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/act/config/material/remove/' + id,
    method: 'delete'
  })
}
