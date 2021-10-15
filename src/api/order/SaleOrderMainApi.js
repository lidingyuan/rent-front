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
    url: BASE_URL + '/order/saleOrderMain/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {Integer} compId 必须：要货单位id,即买方id
 *        {LocalDate} orderDate 必须：订单日,即商业到货日
 *        {String} protocolCode 必须：协议号
 *        {String} protocolYear 必须：协议年份
 *        {String} protocolHalf 必须：协议半年 0上半年 1下半年
 *        {String} warehouseIn 必须：到货仓库
 *        {String} destId 必须：到货地址
 *        {String} sourceType 必须：上游业务类型：日常调拨(10非网配、11网配)、 零点行动(20)、 提前移库(30)
 *        {String} sourceCode 必须：源单据编号
 *        {LocalDate} arriveDate 必须：要求到货日期
 *        {String} transportType 必须：运输方式：联运 、直运
 *        {String} transportMeans 必须：运输类型：汽运、空运、铁路
 *        {String} balanceType 必须：结算方式：款到发货、货到付款
 *        {String} status 必须：状态：0初始状态 1 部分拆分 2 完成拆分
 */
export function save (options) {
  return request({
    url: BASE_URL + '/order/saleOrderMain/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {Integer} compId 必须：要货单位id,即买方id
 *        {LocalDate} orderDate 必须：订单日,即商业到货日
 *        {String} protocolCode 必须：协议号
 *        {String} protocolYear 必须：协议年份
 *        {String} protocolHalf 必须：协议半年 0上半年 1下半年
 *        {String} warehouseIn 必须：到货仓库
 *        {String} destId 必须：到货地址
 *        {String} sourceType 必须：上游业务类型：日常调拨(10非网配、11网配)、 零点行动(20)、 提前移库(30)
 *        {String} sourceCode 必须：源单据编号
 *        {LocalDate} arriveDate 必须：要求到货日期
 *        {String} transportType 必须：运输方式：联运 、直运
 *        {String} transportMeans 必须：运输类型：汽运、空运、铁路
 *        {String} balanceType 必须：结算方式：款到发货、货到付款
 *        {String} status 必须：状态：0初始状态 1 部分拆分 2 完成拆分
 */
export function update (options) {
  return request({
    url: BASE_URL + '/order/saleOrderMain/update',
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
    url: BASE_URL + '/order/saleOrderMain/remove/' + id,
    method: 'delete'
  })
}
