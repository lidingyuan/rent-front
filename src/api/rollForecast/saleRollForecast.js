import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

// 滚动预测保存
export function saveSaleRollForecast (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/save',
    method: 'post',
    data: options
  })
}

// 滚动预测修改
export function updateSaleRollForecast (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/update',
    method: 'put',
    data: options
  })
}

// 滚动预测删除
export function deleteSaleRollForecast (id) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/remove/' + id,
    method: 'delete'
  })
}

// 滚动预测通过id查看详情
export function getSaleRollForecastDetailById (id) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/detail/' + id,
    method: 'get'
  })
}

// 滚动预测列表查询
export function getSaleRollForecast (options) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/list',
    method: 'get',
    params: options
  })
}

// 滚动预测列表分页查询
export function getSaleRollForecastByPage (options) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/page',
    method: 'get',
    params: options
  })
}

// 滚动预测编号
export function getSaleRollForecastBillCode () {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/getBill',
    method: 'get'
  })
}

// 通过Id查看地市详情
export function getSaleRollForecastComp (id) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/detailByComp/' + id,
    method: 'get'
  })
}

// 通过Id查看卷烟详情
export function getSaleRollForecastToba (id) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/detailByToba/' + id,
    method: 'get'
  })
}

// 滚动预测发布
export function publishSaleRollForecast (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/publish',
    method: 'post',
    data: options
  })
}

// 滚动预测取消发布
export function cancelPublishSaleRollForecast (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/rollforecast/sale-rollforecast-main/noPublish',
    method: 'post',
    data: options
  })
}
