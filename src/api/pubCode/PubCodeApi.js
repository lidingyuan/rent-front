/*
 *@description: 配置信息接口
 *@author: LCX
 *@date: 2020-09-03 15:48:13
 *@version: V1.0.1
*/
import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 按照活动查询
 * @param {Object} options
 */

export function listByActId (actId) {
  return request({
    url: BASE_URL + '/act/pub-code/listByActId',
    method: 'get',
    params: { actId }
  })
}

/**
 * @description: 按照活动，编码查询(唯一值)
 * @params {string} actId 必须：活动id
 * @params {string} code 必须：编码
 * @author: LCX
 * @date: 2020-09-16 10:08:22
 * @version: V1.0.0
*/
export function getByCode (options) {
  return request({
    url: BASE_URL + '/act/pub-code/getByCode',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 */
export function save (options) {
  return request({
    url: BASE_URL + '/act/pub-code/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *
 */
export function update (options) {
  return request({
    url: BASE_URL + '/act/pub-code/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id 必要：公共代码id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/act/pub-code/remove/' + id,
    method: 'delete'
  })
}
