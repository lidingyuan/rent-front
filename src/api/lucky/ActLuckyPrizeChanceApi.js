/**
 * @description: 中奖率接口文件
 * @author: LCX
 * @date: 2020-10-14 09:52:03
 * @version: V1.0.0
*/
import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * @description: 中奖率列表
 * 分页参数
 * @param {String} luckyId 必须：抽奖id
 * @param {String} districtCode 必须：区域code
 * @param {String} prizeId 必须：奖项id
 * @author: LCX
 * @date: 2020-10-14 09:52:30
 * @version: V1.0.0
*/
export function listByPage (options) {
  return request({
    url: BASE_URL + '/lucky/chance/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} luckyId 必须：抽奖游戏ID
 *        {String} districtCode 必须：区域编码，支持全国、省份、地市
 *        {String} beginTime 必须：开始时间：时分秒
 *        {String} endTime 必须：结束时间
 *        {String} prizeId 必须：奖项ID
 *        {Number} chance 必须：中奖率
 */
export function save (options) {
  return request({
    url: BASE_URL + '/lucky/chance/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 */
export function update (options) {
  return request({
    url: BASE_URL + '/lucky/chance/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {Array} ids 必要：中奖率id数组
 */
export function del (ids) {
  return request({
    url: BASE_URL + '/lucky/chance/remove',
    method: 'put',
    data: ids,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

/**
 * 中奖率检查
 * @param {String} luckyId 必要：抽奖id
 */
export function check (luckyId) {
  return request({
    url: BASE_URL + '/lucky/chance/check',
    method: 'get',
    params: { luckyId }
  })
}

// -- V2.O
export function listForTransform (options) {
  return request({
    url: BASE_URL + '/lucky/chance/listForTransform',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Array} [{},{}]
 *        {String} luckyId 必须：抽奖游戏ID
 *        {String} districtCode 必须：区域编码，支持全国、省份、地市
 *        {String} beginTime 必须：开始时间
 *        {String} endTime 必须：截止时间
 *        {String} prizeId 必须：奖项ID
 *        {Integer} planNum 必须：预设数量
 */
export function saveOrUpdateBatch (dataList) {
  return request({
    url: BASE_URL + '/lucky/chance/saveOrUpdateBatch',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: dataList
  })
}
