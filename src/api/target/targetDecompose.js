import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

// 分解分页查询
export function getTargetDecomposeList (options) {
  return request({
    url: BASE_URL + '/target/pc-tardecompose-detail/list',
    method: 'get',
    params: options
  })
}

// 分解保存
export function saveTargetDecompose (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-tardecompose-detail/save',
    method: 'post',
    data: options
  })
}

// 分解发布
export function publishtargetDecompose (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-tardecompose-detail/publish',
    method: 'post',
    data: options
  })
}

// 分解取消发布
export function cancelPublishtargetDecompose (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-tardecompose-detail/noPublish',
    method: 'post',
    data: options
  })
}

// 分解修改
export function updatetargetDecompose (options) {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: BASE_URL + '/target/pc-tardecompose-detail/update',
    method: 'post',
    data: options
  })
}

// 获取人员权限下级单位(填报)
export function getPersonAuthForm (id) {
  return request({
    url: BASE_URL + '/target/pc-tardecompose-detail/getComp',
    method: 'get',
    params: {
      id
    }
  })
}

// 获取人员权限下级单位(明细)
export function getPersonAuthDetail (id) {
  return request({
    url: BASE_URL + '/target/pc-tardecompose-detail/getByDetail',
    method: 'get',
    params: {
      id
    }
  })
}
