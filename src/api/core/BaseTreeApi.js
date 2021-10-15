import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 卷烟树
 * @param {Object} options
 */

export function tobaTree () {
  return request({
    url: BASE_URL + '/core/tree/tobaTree',
    method: 'get'
  })
}

/**
 * 公司树
 * @param {Object} options
 */

export function cityTree () {
  return request({
    url: BASE_URL + '/core/tree/cityTree',
    method: 'get'
  })
}

/**
 * 营销区域树
 * @param {Object} options
 */

export function areaTree () {
  return request({
    url: BASE_URL + '/core/tree/areaTree',
    method: 'get'
  })
}

/**
 * 人员组织树
 * @param {Object} options
 */

export function orgUserList () {
  return request({
    url: BASE_URL + '/core/tree/orgUserList',
    method: 'get'
  })
}

/**
 * 应用角色树
 * @param {Object} options
 */

export function sysRoleList () {
  return request({
    url: BASE_URL + '/core/tree/sysRoleList',
    method: 'get'
  })
}
