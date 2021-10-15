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
    url: BASE_URL + '/core/tobacco/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {Integer} tobaId 必须：卷烟ID
 *        {String} tobaName 必须：卷烟名称
 *        {String} tobaCode 必须：卷烟条码
 *        {Integer} brandId 必须：品牌ID
 *        {String} etpCode 必须：内部编码
 *        {String} industryCode 必须：工业编码
 *        {String} isActive 必须：是否停用 0停用 1启用
 *        {String} priceType 必须：价类
 *        {String} packType 必须：包装类型
 *        {String} produceType 必须：制作类型
 *        {BigDecimal} tar 必须：焦油含量
 *        {String} filterType 必须：过滤嘴类型
 *        {String} importFlag 必须：进出口标识 0内产内销 1内产外销 2进口
 *        {BigDecimal} nicotine 必须：烟碱含量
 *        {BigDecimal} filterLength 必须：过滤嘴长度
 *        {BigDecimal} length 必须：烟支长度
 *        {BigDecimal} totalLength 必须：总长度
 *        {BigDecimal} girth 必须：烟支周长
 *        {BigDecimal} allocatePrice 必须：含税万支调拨价
 *        {BigDecimal} allocatePriceNotax 必须：不含税万支调拨价
 *        {BigDecimal} retailPrice 必须：条零售价
 *        {BigDecimal} wholesalePrice 必须：条批发价
 *        {String} isMain 必须：大小牌号标识 1大牌号 0小牌号
 *        {String} priceAttr 必须：
 *        {String} tobaType 必须：
 */
export function save (options) {
  return request({
    url: BASE_URL + '/core/tobacco/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {Integer} tobaId 必须：卷烟ID
 *        {String} tobaName 必须：卷烟名称
 *        {String} tobaCode 必须：卷烟条码
 *        {Integer} brandId 必须：品牌ID
 *        {String} etpCode 必须：内部编码
 *        {String} industryCode 必须：工业编码
 *        {String} isActive 必须：是否停用 0停用 1启用
 *        {String} priceType 必须：价类
 *        {String} packType 必须：包装类型
 *        {String} produceType 必须：制作类型
 *        {BigDecimal} tar 必须：焦油含量
 *        {String} filterType 必须：过滤嘴类型
 *        {String} importFlag 必须：进出口标识 0内产内销 1内产外销 2进口
 *        {BigDecimal} nicotine 必须：烟碱含量
 *        {BigDecimal} filterLength 必须：过滤嘴长度
 *        {BigDecimal} length 必须：烟支长度
 *        {BigDecimal} totalLength 必须：总长度
 *        {BigDecimal} girth 必须：烟支周长
 *        {BigDecimal} allocatePrice 必须：含税万支调拨价
 *        {BigDecimal} allocatePriceNotax 必须：不含税万支调拨价
 *        {BigDecimal} retailPrice 必须：条零售价
 *        {BigDecimal} wholesalePrice 必须：条批发价
 *        {String} isMain 必须：大小牌号标识 1大牌号 0小牌号
 *        {String} priceAttr 必须：
 *        {String} tobaType 必须：
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/tobacco/update',
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
    url: BASE_URL + '/core/tobacco/remove/' + id,
    method: 'delete'
  })
}
