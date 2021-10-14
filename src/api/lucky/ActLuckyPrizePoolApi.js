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
    url: BASE_URL + '/lucky/pool/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object}
 *        {String} luckyId 必须：抽奖游戏ID
 *        {String} districtCode 必须：区域编码，支持全国、省份、地市
 *        {String} beginTime 必须：开始时间
 *        {String} endTime 必须：截止时间
 *        {String} prizeId 必须：奖项ID
 *        {Integer} planNum 必须：预设数量
 */
export function save (options) {
  return request({
    url: BASE_URL + '/lucky/pool/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object}
 *        {String} id 必须：ID
 *        {String} luckyId 必须：抽奖游戏ID
 *        {String} districtCode 必须：区域编码，支持全国、省份、地市
 *        {LocalDate} lastDate 必须：本周期截止日期
 *        {String} prizeId 必须：奖项ID
 *        {Integer} planNum 必须：预设数量
 */
export function update (options) {
  return request({
    url: BASE_URL + '/lucky/pool/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {Array} ids 必要：奖池id数组
 */
export function del (ids) {
  return request({
    url: BASE_URL + '/lucky/pool/remove',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: ids
  })
}

// -- V2.O
export function listForTransform (options) {
  return request({
    url: BASE_URL + '/lucky/pool/listForTransform',
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
    url: BASE_URL + '/lucky/pool/saveOrUpdateBatch',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: dataList
  })
}
