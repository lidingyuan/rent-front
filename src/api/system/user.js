import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_USERS_BASE_URL

/**
 * 当前用户信息
 */
export function info () {
  return request({
    url: BASE_URL + '/system/user/info',
    method: 'get'
  })
}

/**
 * 根据部门Id查询用户列表8t
 * @param {String} departId
 */
export function list (departId) {
  return request({
    url: BASE_URL + '/system/user/listByDeptId',
    method: 'get',
    params: { departId }
  })
}

/**
 * 部门人员树
 * @param {String} departId
 */
export function listTree () {
  return request.get(BASE_URL + '/system/user/listTree')
}

/**
 * 用户详情
 * @param {String} userId
 */
export function detail (userId) {
  return request({
    url: BASE_URL + '/system/user/detail',
    method: 'get',
    params: { userId }
  })
}

/**
 * 保存用户信息
 * @param {Object} user
 */
export function save (user) {
  return request({
    url: BASE_URL + '/system/user/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: { ...user }
  })
}

/**
 * 修改用户信息
 * @param {Object} user
 */
export function update (user) {
  return request({
    url: BASE_URL + '/system/user/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: { ...user }
  })
}

/**
 * 管理员重置密码
 * @param {Object} user
 */
export function resetPassword (userId, newPassword) {
  return request({
    url: BASE_URL + '/system/user/resetPassword',
    method: 'put',
    params: { userId, newPassword }
  })
}

/**
 * 用户修改密码
 * @param {Object} user
 */
export function changePassword (oldPassword, newPassword) {
  return request({
    url: BASE_URL + '/system/user/changePassword',
    method: 'put',
    params: { oldPassword, newPassword }
  })
}

/**
 * 删除用户信息
 * @param id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/system/user/remove/' + id,
    method: 'delete'
  })
}

/**
 * 人员选角色，已选中值
 * @param {String} userId
 */
export function listByUserId (userId) {
  return request({
    url: BASE_URL + '/system/user/listByUserId',
    method: 'get',
    params: { userId }
  })
}

/**
 * 人员选权限
 * @param {String} userId
 * @param {Array} roleIds
 */
export function roleByUserId (userId, roleIds) {
  return request({
    url: BASE_URL + '/system/user/roleByUserId',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: { userId, roleIds: roleIds.join(',') }
  })
}
