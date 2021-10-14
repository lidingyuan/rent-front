import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 查询物资图片
 * @param {string} sourceType 源类型
 * @param {string} sourceId 源ID
 */

export function listBySourceId (sourceType, sourceId) {
  return request({
    url: BASE_URL + '/material/mapping/listBySourceId',
    method: 'get',
    params: { sourceType, sourceId }
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} sourceId 必须：源ID
 *        {String} sourceType 必须：源类型
 *        {String} materialId 必须：素材ID
 *        {String} type 必须：ICON-图标
 *                           THUMB-缩略图
 *                           POSTER-海报
 *                           VOICE-语音
 *                           VIDEO-视频
 *        {int} orderTag 必须：排序
 */
export function save (options) {
  return request({
    url: BASE_URL + '/material/mapping/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改排序
 * @param {Object} options
 *        {String} id 必须：主键ID
 *        {int} orderTag 必须：排序
 */
export function update (options) {
  return request({
    url: BASE_URL + '/material/mapping/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id 必要：素材映射id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/material/mapping/remove/' + id,
    method: 'delete'
  })
}
