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
    url: BASE_URL + '/sale/contract/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} sourceType 必须：源头单据类型
 *        {String} sourceId 必须：源头单据id
 *        {String} contractCode 必须：合同号
 *        {Integer} sellerId 必须：销售方id,系统内部
 *        {Integer} buyerId 必须：购买方id,系统内部id
 *        {String} status 必须：0 草稿 1离线上传 2离线导回 3合同鉴章 4合同确认 5下达物流
 *        {LocalDate} arriveDate 必须：要求到货日
 *        {LocalDateTime} orderDate 必须：订单日期
 *        {LocalDateTime} uploadDate 必须：离线上传时间
 *        {LocalDateTime} downloadDate 必须：离线导回时间
 *        {LocalDateTime} signedDate 必须：鉴章时间
 *        {LocalDateTime} confirmDate 必须：合同确认时间
 *        {LocalDateTime} transDate 必须：合同下达物流时间
 *        {String} protocolYear 必须：协议年
 *        {String} protocolHalf 必须：协议上下半年 0上1下
 *        {LocalDate} startDate 必须：合同有效期开始时间
 *        {LocalDate} endDate 必须：合同有效期结束时间
 *        {String} paymentCode 必须：付款方式
 *        {String} transType 必须：运输方式
 *        {String} transMean 必须：运输工具
 *        {String} destId 必须：到货仓库
 *        {BigDecimal} qtotal 必须：合同签订量 万支
 *        {String} contractType 必须：合同类型
 *        {String} originId 必须：合同发货地ID
 *        {String} memo 必须：交易网备注
 */
export function save (options) {
  return request({
    url: BASE_URL + '/sale/contract/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} sourceType 必须：源头单据类型
 *        {String} sourceId 必须：源头单据id
 *        {String} contractCode 必须：合同号
 *        {Integer} sellerId 必须：销售方id,系统内部
 *        {Integer} buyerId 必须：购买方id,系统内部id
 *        {String} status 必须：0 草稿 1离线上传 2离线导回 3合同鉴章 4合同确认 5下达物流
 *        {LocalDate} arriveDate 必须：要求到货日
 *        {LocalDateTime} orderDate 必须：订单日期
 *        {LocalDateTime} uploadDate 必须：离线上传时间
 *        {LocalDateTime} downloadDate 必须：离线导回时间
 *        {LocalDateTime} signedDate 必须：鉴章时间
 *        {LocalDateTime} confirmDate 必须：合同确认时间
 *        {LocalDateTime} transDate 必须：合同下达物流时间
 *        {String} protocolYear 必须：协议年
 *        {String} protocolHalf 必须：协议上下半年 0上1下
 *        {LocalDate} startDate 必须：合同有效期开始时间
 *        {LocalDate} endDate 必须：合同有效期结束时间
 *        {String} paymentCode 必须：付款方式
 *        {String} transType 必须：运输方式
 *        {String} transMean 必须：运输工具
 *        {String} destId 必须：到货仓库
 *        {BigDecimal} qtotal 必须：合同签订量 万支
 *        {String} contractType 必须：合同类型
 *        {String} originId 必须：合同发货地ID
 *        {String} memo 必须：交易网备注
 */
export function update (options) {
  return request({
    url: BASE_URL + '/sale/contract/update',
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
    url: BASE_URL + '/sale/contract/remove/' + id,
    method: 'delete'
  })
}
