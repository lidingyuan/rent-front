import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 新增
 * @param {Object} options
 *        {String} userId 必须：
 */

export function list (options) {
  return request({
    url: BASE_URL + '/core/base-user-area/list',
    method: 'get',
    params: options
  })
}

/**
 * 修改
 * @param {Object} options
 * 参数示例 {userId:'123',userAreas: [{userId:'123',areaId:'1'},{userId:123,areaId:'3'},{userId:123,areaId:'12'}]}
 *        {String} userId 必须：用户id
 *        {String} areaId 必须：公司ID
 */
export function update (options) {
  return request({
    url: BASE_URL + '/core/base-user-area/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
