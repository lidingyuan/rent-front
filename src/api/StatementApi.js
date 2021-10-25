import request from '@/core/utils/request'

/**
 * 新增
 * @param {Object} options
 *        {Integer} projectId 必须：项目id
 *        {LocalDate} beginDate 必须：日期
 *        {LocalDate} endDate 必须：日期
 *        {Integer} userCompId 必须：用户公司id
 *        {Integer} state 必须：状态
 *        {Integer} connectId 必须：关联结算单id
 *        {Integer} lastId 必须：上次结算单id
 *        {LocalDateTime} addTime 必须：添加时间戳
 *        {Integer} addUser 必须：添加用户id
 *        {LocalDateTime} modTime 必须：修改时间戳
 *        {Integer} modUser 必须：修改用户id
 */
export function save (options) {
  return request({
    url: '/statement/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {Integer} projectId 必须：项目id
 *        {LocalDate} beginDate 必须：日期
 *        {LocalDate} endDate 必须：日期
 *        {Integer} userCompId 必须：用户公司id
 *        {Integer} state 必须：状态
 *        {Integer} connectId 必须：关联结算单id
 *        {Integer} lastId 必须：上次结算单id
 *        {LocalDateTime} addTime 必须：添加时间戳
 *        {Integer} addUser 必须：添加用户id
 *        {LocalDateTime} modTime 必须：修改时间戳
 *        {Integer} modUser 必须：修改用户id
 */
export function update (options) {
  return request({
    url: '/statement/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id ID
 */
export function del (id) {
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('参数错误')
  }
  return request({
    url: '/statement/remove/' + id,
    method: 'delete'
  })
}

/**
 * 详情
 * @param {String} id ID
 */
export function detail (id) {
  if (!id) {
    // eslint-disable-next-line no-console
    console.error('参数错误')
  }
  return request({
    url: '/statement/detail',
    method: 'get',
    params: { id }
  })
}

/**
 * 查询
 * @param {Object} queryParam
 */
export function list (queryParam = {}) {
  return request({
    url: '/statement/list',
    method: 'get',
    params: queryParam
  })
}

/**
 * 分页查询
 * @param {Object} page
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 * @param {Object} queryParam
 */
export function page (page, queryParam = {}) {
  return request({
    url: '/statement/page',
    method: 'get',
    params: { ...page, ...queryParam }
  })
}
