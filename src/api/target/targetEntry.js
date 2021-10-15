import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

// 目标录入查询
export function getTargetEntryList (options) {
  return request({
    url: BASE_URL + '/target/pc-targetentry-main/list',
    method: 'get',
    params: options
  })
}

// 目标模板查询
export function getListByDev (options) {
  return request({
    url: BASE_URL + '/target/pc-targetentry-main/getListByDev',
    method: 'get',
    params: options
  })
}

// 目标录入保存
export function addtargetEntry (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targetentry-main/save',
    method: 'post',
    data: options
  })
}

// 目标录入明细查询
export function getTargetEntryDetail (id) {
  return request({
    url: BASE_URL + '/target/pc-targetentry-main/getListByDetail',
    method: 'get',
    params: {
      id
    }
  })
}

// 目标录入模板明细查询
export function getTargetTemplateDetail (id) {
  return request({
    url: BASE_URL + '/target/pc-targettemplate-detail/list',
    method: 'get',
    params: {
      mainId: id
    }
  })
}

// 目标录入修改
export function updatetargetEntry (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targetentry-main/updateByAll',
    method: 'post',
    data: options
  })
}

// 目标调整
export function updatetargetEntryByEditor (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targetentry-main/updateByEditor',
    method: 'post',
    data: options
  })
}

// 目标发布
export function publishtargetEntry (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targetentry-main/publish',
    method: 'post',
    data: options
  })
}

// 目标编号录入
export function getTargetEntryCode () {
  return request({
    url: BASE_URL + '/target/pc-targetentry-main/getBill',
    method: 'get'
  })
}

// 目标取消发布
export function cancelPublishtargetEntry (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targetentry-main/noPublish',
    method: 'post',
    data: options
  })
}
