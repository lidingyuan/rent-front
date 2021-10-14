import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL
// const BASE_URL = ''

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 *        {string} name    非必须：物资名称
 */
export function listByPage (options) {
  return request({
    url: BASE_URL + '/goods/listPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} code 必须：物资编码
 *        {String} name 必须：物资名称
 *        {String} type 必须：物资类型,01-红包，02-积分，03-实物
 *        {BigDecimal} price 必须：价格
 *        {Integer} specs 必须：物资规格
 *        {String} unit 必须：物资单位
 *        {String} description 必须：物资详细描述
 */
export function save (options) {
  return request({
    url: BASE_URL + '/goods/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} code 必须：物资编码
 *        {String} name 必须：物资名称
 *        {String} type 必须：物资类型,01-红包，02-积分，03-实物
 *        {BigDecimal} price 必须：价格
 *        {Integer} specs 必须：物资规格
 *        {String} unit 必须：物资单位
 *        {String} description 必须：物资详细描述
 */
export function update (options) {
  return request({
    url: BASE_URL + '/goods/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：物资id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/goods/remove/' + id,
    method: 'delete'
  })
}

/**
 * 详情
 * @param {String} id 必要：物资id
 */
export function detail (id) {
  return request({
    url: BASE_URL + '/goods/detail/' + id,
    method: 'get'
  })
}
