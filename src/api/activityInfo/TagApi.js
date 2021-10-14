import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_WEIXIN_BASE_URL

/**
 * 1、查询标签列表
 * @param {int} current 必须：当前页数
 * @param {int} total 必须：查询到的总条数
 * @param {int} size 必须：当前页的总条数
 */
export function listByPage (params) {
  return request({
    url: BASE_URL + '/mp/tag/listByPage',
    method: 'get',
    params: params
  })
}
/**
 * 2、查询粉丝标签接口
 * @param {String} userId 必要：一个userId
 */
export function listByUserId (userId) {
  return request({
    url: BASE_URL + '/mp/tag/listByUserId',
    method: 'get',
    params: {
      userId: userId
    }
  })
}
/**
 * 3、查询粉丝标签接口
 * @param {String} ids 必要：逗号分割的字符串
 */
export function listByIds (ids) {
  return request({
    url: BASE_URL + '/mp/tag/listByIds',
    method: 'get',
    params: {
      ids
    }
  })
}
/**
 * 4、组列表查询
 */
export function getGroupList () {
  return request({
    url: BASE_URL + '/mp/tag-group/list',
    method: 'get'
  })
}
