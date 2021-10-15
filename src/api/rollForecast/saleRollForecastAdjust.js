import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

// 添加
export function saveSaleRollForecastAdjust (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/rollforecast/sale-rollforecast-adjust/save',
    method: 'post',
    data: options
  })
}

// 修改
export function updateSaleRollForecastAdjust (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/rollforecast/sale-rollforecast-adjust/update',
    method: 'put',
    data: options
  })
}

// 通过Id查看详情
export function getDetailById (rfid) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-adjust/detail/' + rfid,
    method: 'get'
  })
}

// 获取列表
export function getSaleRollForecastAdjustList () {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-adjust/list',
    method: 'get'
  })
}

// 分页查询
export function getSaleRollForecastAdjustByPage (options) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-adjust/page',
    method: 'get',
    params: options
  })
}
