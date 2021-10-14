import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 *        {string} type 必须：素材类型
 *        {string} srcName 不必须：素材名称
 */
export function listByPage (options) {
  return request({
    url: BASE_URL + '/material/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 * @param {String} srcName 必须：文件标题
 * @param {file} file 必须：上传的文件
 *        {String} type 必须：ICON | THUMB | POSTER | VOICE | VIDEO
 * @param {String} remarks 必须：备注
 */
export function save (options) {
  let formData = new FormData()
  formData.append('srcName', options.srcName)
  formData.append('type', options.type)
  formData.append('remarks', options.remarks)
  formData.append('file', options.file)

  return request({
    url: BASE_URL + '/material/save',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: formData
  })
}

/**
 * 修改，只能修改素材名称和备注
 * @param {Object} options
 * @param {String} id 必须：素材id
 * @param {String} srcName 必须：文件标题
 * @param {file} file 必须：上传的文件
 *        {String} type 必须：ICON | THUMB | POSTER | VOICE | VIDEO
 * @param {String} remarks 必须：备注
 */
export function update (options) {
  let formData = new FormData()
  formData.append('id', options.id)
  formData.append('srcName', options.srcName)
  formData.append('type', options.type)
  formData.append('remarks', options.remarks)
  formData.append('file', options.file)

  return request({
    url: BASE_URL + '/material/update',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: formData
  })
}

/**
 * 删除
 * @param {String} id 必要：素材映射id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/material/remove/' + id,
    method: 'delete'
  })
}
