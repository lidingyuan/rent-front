/**
 * @description: 奖池模板
 * @author: LCX
 * @date: 2020-10-14 09:43:35
 * @version: V1.0.0
*/
import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL
/**
 * @description: 奖池模板列表
 * 分页
 * @param {String} luckyId 必须：抽奖id
 * @param {String} districtCode 必须：区域code
 * @param {String} prizeId 必须：奖项id
 * @author: LCX
 * @date: 2020-10-14 09:44:42
 * @version: V1.0.0
*/
export function listByPage (options) {
  return request({
    url: BASE_URL + '/lucky/pool/template/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object}
 *        {String} luckyId 必须：抽奖游戏ID
 *        {String} districtCode 必须：区域编码，支持全国、省份、地市
 *        {String} beginTime 必须：开始时间：时分秒
 *        {String} endTime 必须：结束时间
 *        {String} prizeId 必须：奖项ID
 *        {Integer} planNum 必须：预设数量
 */
export function save (options) {
  return request({
    url: BASE_URL + '/lucky/pool/template/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object}
 *        {String} actId 必须：活动ID
 *        {String} luckyId 必须：抽奖游戏ID
 *        {String} districtCode 必须：区域编码，支持全国、省份、地市
 *        {LocalDate} lastDate 必须：本周期截止日期
 *        {String} prizeId 必须：奖项ID
 *        {Integer} planNum 必须：预设数量
 *        {Integer} usedNum 必须：已中奖数量
 *        {Integer} preNum 必须：上期结余数量
 */
export function update (options) {
  return request({
    url: BASE_URL + '/lucky/pool/template/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {Array} ids 必要：奖池模板id数组
 */
export function del (ids) {
  return request({
    url: BASE_URL + '/lucky/pool/template/remove',
    method: 'put',
    data: ids,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

/**
 * 生成奖池：所有的奖项根据奖项各自的奖池模板生成奖池
 * @param {String} id 必要：抽奖id
 * @param {String} prizeDate 必要：日期
 */
export function generate (options) {
  return request({
    url: BASE_URL + '/lucky/pool/template/generate',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    method: 'post',
    data: options
  })
}

// -- V2.O
export function listForTransform (options) {
  return request({
    url: BASE_URL + '/lucky/pool/template/listForTransform',
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
    url: BASE_URL + '/lucky/pool/template/saveOrUpdateBatch',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: dataList
  })
}
