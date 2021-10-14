import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 */

export function listByPage (options) {
  return request({
    url: BASE_URL + '/template/page',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} name 必须：模板名称
 *        {String} url 必须：访问地址
 *        {String} defaultStyle 必须：默认活动配置样式
 *        {String} defaultData 必须：默认活动配置数据
 *        {String} phaseInfo 必须：模板包含的环节信息
 */
export function save (options) {
  return request({
    url: BASE_URL + '/template/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} name 必须：模板名称
 *        {String} url 必须：访问地址
 *        {String} defaultStyle 必须：默认活动配置样式
 *        {String} defaultData 必须：默认活动配置数据
 *        {String} phaseInfo 必须：模板包含的环节信息
 */
export function update (options) {
  return request({
    url: BASE_URL + '/template/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：标签id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/template/remove/' + id,
    method: 'delete'
  })
}

/**
 * 发布
 * @param {String} id 必要：标签id
 */
export function publish (actId) {
  return request({
    url: BASE_URL + '/act/config/publish',
    method: 'put',
    params: { actId }
  })
}

/**
 * 基于模板创建活动
 */
export function saveWithTemplate (options) {
  return request({
    url: BASE_URL + '/act/config/saveWithTemplate',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
