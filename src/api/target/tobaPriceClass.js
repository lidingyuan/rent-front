import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

// 卷烟价类获取
export function getTobaPriceClass () {
  return request({
    url: BASE_URL + '/target/pc-class/list',
    method: 'get'
  })
}

// 指标获取
export function getPcIndex () {
  return request({
    url: BASE_URL + '/target/pc-index/list',
    method: 'get'
  })
}

// 单位获取
export function getBaseUnits () {
  return request({
    url: BASE_URL + '/core/base-units/list',
    method: 'get'
  })
}
