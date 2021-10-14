/**
 * @description: 页面接口
 * @author: LCX
 * @date: 2021-03-10 16:36:21
 * @version: V1.0.0
*/
import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_GODSPEN_BASE_URL

/**
 * @description:页面分页查询
 * @author: LCX
 * @date: 2021-03-10 16:36:55
 * @version: V1.0.0
*/
export function page (options) {
  return request({
    url: BASE_URL + '/page/page',
    method: 'get',
    params: options
  })
}

/**
 * @description:页面列表查询，根据模板id
 * @author: LCX
 * @date: 2021-03-10 16:36:55
 * @version: V1.0.0
*/
export function listByTemplateId (id) {
  return request({
    url: BASE_URL + '/page/listByTemplateId',
    method: 'get',
    params: { templateId: id }
  })
}

/**
 * @description: 页面详情
 * @param {String} id 必须：页面id
 * @author: LCX
 * @date: 2021-03-11 10:31:54
 * @version: V1.0.0
*/
export function detail (id) {
  return request({
    url: BASE_URL + '/page/detail/' + id,
    method: 'get'
  })
}

/**
 * @description: 页面保存
 * @param {Number} paramName 必须：参数名称
 * @author: LCX
 * @date: 2021-03-11 10:37:23
 * @version: V1.0.0
*/
export function save (options) {
  return request({
    url: BASE_URL + '/page/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: options
  })
}

/**
 * @description: 页面更新
 * @param {Number} paramName 必须：参数名称
 * @author: LCX
 * @date: 2021-03-11 10:37:23
 * @version: V1.0.0
*/
export function update (options) {
  return request({
    url: BASE_URL + '/page/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: options
  })
}

/**
 * @description: 页面删除
 * @param page 必须：页面id
 * @author: LCX
 * @date: 2021-03-11 10:37:23
 * @version: V1.0.0
*/
export function remove (id) {
  return request({
    url: BASE_URL + '/page/remove/' + id,
    method: 'delete'
  })
}
