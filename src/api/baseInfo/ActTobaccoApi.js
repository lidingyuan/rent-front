import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL
// const BASE_URL = ''

/**
 * 查询
 */

export function list () {
  return request({
    url: BASE_URL + '/tobacco/list',
    method: 'get'
    // params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} code 必须：卷烟编码
 *        {String} name 必须：卷烟名称
 *        {String} brandCode 必须：品牌编码
 *        {String} brandName 必须：品牌名称
 *        {String} priceTypeCode 必须：价类编码
 *        {String} priceTypeName 必须：价类名称
 *        {String} tar 必须：焦油含量
 *        {String} nicotine 必须：烟气烟碱量
 *        {String} co 必须：烟气一氧化碳量
 *        {String} type 必须：卷烟类型
 *        {Integer} size 必须：单包支数
 *        {String} discribe 必须：卷烟描述
 *        {Integer} length 必须：卷烟长度(毫米)
 *        {String} xizhi 必须：是否细支，0-否，1-是
 *        {String} zhongzhi 必须：是否中支，0-否，1-是
 *        {String} duanzhi 必须：是否短支，0-否，1-是
 *        {String} baozhu 必须：是否爆珠，0-否，1-是
 *        {String} industryCode 必须：工业编码
 *        {String} industryName 必须：工业名称
 */
export function save (options) {
  return request({
    url: BASE_URL + '/tobacco/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} code 必须：卷烟编码
 *        {String} name 必须：卷烟名称
 *        {String} brandCode 必须：品牌编码
 *        {String} brandName 必须：品牌名称
 *        {String} priceTypeCode 必须：价类编码
 *        {String} priceTypeName 必须：价类名称
 *        {String} tar 必须：焦油含量
 *        {String} nicotine 必须：烟气烟碱量
 *        {String} co 必须：烟气一氧化碳量
 *        {String} type 必须：卷烟类型
 *        {Integer} size 必须：单包支数
 *        {String} discribe 必须：卷烟描述
 *        {Integer} length 必须：卷烟长度(毫米)
 *        {String} xizhi 必须：是否细支，0-否，1-是
 *        {String} zhongzhi 必须：是否中支，0-否，1-是
 *        {String} duanzhi 必须：是否短支，0-否，1-是
 *        {String} baozhu 必须：是否爆珠，0-否，1-是
 *        {String} industryCode 必须：工业编码
 *        {String} industryName 必须：工业名称
 */
export function update (options) {
  return request({
    url: BASE_URL + '/tobacco/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：卷烟id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/tobacco/remove/' + id,
    method: 'delete'
  })
}

/**
 * 详情
 * @param {String} id 必要：卷烟id
 */
export function detail (id) {
  return request({
    url: BASE_URL + '/tobacco/detail/' + id,
    method: 'get'
  })
}
