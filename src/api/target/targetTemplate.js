import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

// 分页查询目标模板
export function getTargetTemplateListByPage (params) {
  return request({
    url: BASE_URL + '/target/pc-targettemplate-main/page',
    method: 'get',
    params
  })
}

// 目标模板明细查询
export function getTargetDetail (id) {
  return request({
    url: BASE_URL + '/target/pc-targettemplate-main/listById',
    method: 'get',
    params: {
      id
    }
  })
}

// 目标模板保存
export function addTargetTemplate (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targettemplate-main/save',
    method: 'post',
    data: options
  })
}

// 目标模板发布
export function postTargetTemplate (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targettemplate-main/publish',
    method: 'post',
    data: options
  })
}

// 目标模板取消发布
export function cancelPostTargetTemplate (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targettemplate-main/noPublish',
    method: 'post',
    data: options
  })
}

// 目标模板作废
export function revokeTargetTemplate (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targettemplate-main/revoked',
    method: 'post',
    data: options
  })
}

// 目标模板修改
export function updateTargetTemplate (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-targettemplate-main/update',
    method: 'post',
    data: options
  })
}

// 目标模板编号
export function getTargetTemplateCode () {
  return request({
    url: BASE_URL + '/target/pc-targettemplate-main/getBill',
    method: 'get'
  })
}
