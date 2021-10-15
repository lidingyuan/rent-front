import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

// 获取地市上报情况
export function getAreaInfo (id) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-detail/listByComp/' + id,
    method: 'get'
  })
}

// 通过Id查看详情
export function getDetailById (rfid, compId) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-detail/detail/' + rfid + '/' + compId,
    method: 'get'
  })
}

// 添加
export function saveSaleRollForecastDetail (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/rollforecast/sale-rollforecast-detail/save',
    method: 'post',
    data: options
  })
}

// 修改
export function updateSaleRollForecastDetail (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/rollforecast/sale-rollforecast-detail/update',
    method: 'put',
    data: options
  })
}

// 分页查询
export function getSaleRollForecastDetailByPage (options) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-detail/page',
    method: 'get',
    params: options
  })
}

// 获取明细数据
export function getConsultDetailById (rfid, compId) {
  return request({
    url: BASE_URL + '/rollforecast/sale-rollforecast-consult/listByDetail/' + rfid + '/' + compId,
    method: 'get'
  })
}
