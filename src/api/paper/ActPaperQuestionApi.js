import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 *        {string} paperId 必须：问卷id
 */

export function listByPage (options) {
  return request({
    url: BASE_URL + '/paper/question/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} paperId 必须：问卷ID
 *        {String} title 必须：题目
 *        {String} options 必须：选项
 *        {String} answer 必须：参考答案
 *        {String} type 必须：1单选，2多选，3问答题，4媒体类型
 *        {String} status 必须：1有效，0停用
 *        {integer} orderTag 必须：排序
 *        {string} remarks 必须：备注
 */
export function save (options) {
  return request({
    url: BASE_URL + '/paper/question/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} paperId 必须：问卷ID
 *        {String} title 必须：题目
 *        {String} options 必须：选项
 *        {String} answer 必须：参考答案
 *        {String} type 必须：1单选，2多选，3问答题，4媒体类型
 *        {String} status 必须：1有效，0停用
 *        {integer} orderTag 必须：排序
 *        {string} remarks 必须：备注
 */
export function update (options) {
  return request({
    url: BASE_URL + '/paper/question/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：题目id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/paper/question/remove/' + id,
    method: 'delete'
  })
}
