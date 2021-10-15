import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

// 目标分类列表
export function getTargetClassList () {
  return request({
    url: BASE_URL + '/target/pc-target-class/list',
    method: 'get'
  })
}

// 分页查询目标分类
export function getTargetClassListByPage (params) {
  return request({
    url: BASE_URL + '/target/pc-target-class/page',
    method: 'get',
    params
  })
}

// 目标明细查询
export function getTargetDetail (id) {
  return request({
    url: BASE_URL + '/target/pc-target-class/listById',
    method: 'get',
    params: {
      id
    }
  })
}

// 目标卷烟规格
export function getTargetTobaList (id) {
  return request({
    url: BASE_URL + '/target/pc-target-class/listByToba',
    method: 'get',
    params: {
      id
    }
  })
}

// 目标分类保存
export function addTargetClass (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-target-class/save',
    method: 'post',
    data: options
  })
}

// 目标分类发布
export function postTargetClass (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-target-class/publish',
    method: 'post',
    data: options
  })
}

// 目标分类取消发布
export function cancelPostTargetClass (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-target-class/noPublish',
    method: 'post',
    data: options
  })
}

// 目标分类作废
export function revokeTargetClass (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-target-class/revoked',
    method: 'post',
    data: options
  })
}

// 目标分类修改
export function updateTargetClass (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-target-class/update',
    method: 'post',
    data: options
  })
}

// 目标分类编号
export function getTargetClassCode () {
  return request({
    url: BASE_URL + '/target/pc-target-class/getBill',
    method: 'get'
  })
}
