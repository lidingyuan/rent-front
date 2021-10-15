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
    url: BASE_URL + '/core/baseCompDeliveryInfo/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} receiveAddress 必须：收件地址
 *        {String} email 必须：email
 *        {String} receivePerson 必须：收件人姓名
 *        {String} receiveTel 必须：收件人电话
 *        {String} compId 必须：公司id
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/baseCompDeliveryInfo/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} receiveAddress 必须：收件地址
 *        {String} email 必须：email
 *        {String} receivePerson 必须：收件人姓名
 *        {String} receiveTel 必须：收件人电话
 *        {String} compId 必须：公司id
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/baseCompDeliveryInfo/update',
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
    url: BASE_URL + '/core/baseCompDeliveryInfo/remove/' + id,
    method: 'delete'
  })
}
