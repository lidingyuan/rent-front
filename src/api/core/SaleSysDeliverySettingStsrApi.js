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
    url: BASE_URL + '/core/saleSysDeliverySettingStsr/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} settingId 必须：配货设置ID
 *        {Integer} toabId 必须：卷烟ID
 *        {Integer} maxStsr 必须：最高存销比
 *        {Integer} minStsr 必须：最低存销比
 *        {Integer} maxCalcStsr 必须：计算最高存销比
 *        {Integer} minCalcStsr 必须：计算最低存销比
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/saleSysDeliverySettingStsr/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} settingId 必须：配货设置ID
 *        {Integer} toabId 必须：卷烟ID
 *        {Integer} maxStsr 必须：最高存销比
 *        {Integer} minStsr 必须：最低存销比
 *        {Integer} maxCalcStsr 必须：计算最高存销比
 *        {Integer} minCalcStsr 必须：计算最低存销比
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/saleSysDeliverySettingStsr/update',
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
    url: BASE_URL + '/core/saleSysDeliverySettingStsr/remove/' + id,
    method: 'delete'
  })
}
