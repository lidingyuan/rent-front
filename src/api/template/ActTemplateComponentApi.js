import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 */

export function listByTemplateId (templateId) {
  return request({
    url: BASE_URL + '/template/component/listByTemplateId',
    method: 'get',
    params: { templateId }
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} templateId 必须：模板ID
 *        {String} name 必须：名称
 *        {String} formId 必须：组件配置表单组件，优先于FORM_INFO
 *        {String} formInfo 必须：组件配置表单，可以是html，也可以是JSON字符串，前端反序列化渲染FORM
 */
export function save (options) {
  return request({
    url: BASE_URL + '/template/component/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} templateId 必须：模板ID
 *        {String} name 必须：名称
 *        {String} formId 必须：组件配置表单组件，优先于FORM_INFO
 *        {String} formInfo 必须：组件配置表单，可以是html，也可以是JSON字符串，前端反序列化渲染FORM
 */
export function update (options) {
  return request({
    url: BASE_URL + '/template/component/update',
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
    url: BASE_URL + '/template/component/remove/' + id,
    method: 'delete'
  })
}
