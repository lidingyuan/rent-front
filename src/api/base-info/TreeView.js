import request from '@/core/utils/request'

const BASE_URL = process.env.VUE_APP_BASE_URL

/**
 * 查询
 * @param {Object} options
 *        {int} industryCode 必须：工业公司国家局编码
 */

export function tobaTree (options) {
  return request({
    url: BASE_URL + '/core/TreeView/tobaTree',
    method: 'get',
    params: options
  })
}

/**
 * 查询
 */

export function cityTree () {
  return request({
    url: BASE_URL + '/core/TreeView/cityTree',
    method: 'get'
  })
}
