/**
 * @description: 模板接口
 * @author: LCX
 * @date: 2021-03-10 16:36:21
 * @version: V1.0.0
*/
import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_GODSPEN_BASE_URL

/**
 * @description: 模板分页查询
 * @param {Number} total 非必须
 * @param {Number} size 非必须
 * @param {Number} current 非必须
 * @param {Number} name 非必须
 * @param {Number} status 非必须
 *
 * @author: LCX
 * @date: 2021-03-10 16:36:55
 * @version: V1.0.0
*/
export function list (options) {
  return request({
    url: BASE_URL + '/template/page',
    method: 'get',
    params: options
  })
}

/**
 * @description: 模板详情
 * @param {String} id 必须：模板id
 * @author: LCX
 * @date: 2021-03-11 10:31:54
 * @version: V1.0.0
*/
export function detail (id) {
  return request({
    url: BASE_URL + '/template/detail/' + id,
    method: 'get'
  })
}

/**
 * @description: 模板保存
 * @param {Number} paramName 必须：参数名称
 * @author: LCX
 * @date: 2021-03-11 10:37:23
 * @version: V1.0.0
*/
export function save (options) {
  return request({
    url: BASE_URL + '/template/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: options
  })
}

/**
 * @description: 模板更新
 * @param {Number} paramName 必须：参数名称
 * @author: LCX
 * @date: 2021-03-11 10:37:23
 * @version: V1.0.0
*/
export function update (options) {
  return request({
    url: BASE_URL + '/template/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: options
  })
}

/**
 * @description: 模板删除
 * @param template 必须：模板id
 * @author: LCX
 * @date: 2021-03-11 10:37:23
 * @version: V1.0.0
*/
export function remove (id) {
  return request({
    url: BASE_URL + '/template/remove/' + id,
    method: 'delete'
  })
}
