import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_SCAN_BASE_URL

/**
 * 分页查询
 * @param {Object} options
 *        {int} current 必须：当前页数
 *        {int} total   必须：查询到的总条数
 *        {int} size    必须：当前页的总条数
 *        {string} actId    不必须：活动ID
 */

export function listByPage (options) {
  return request({
    url: BASE_URL + '/tuike/rule/listByPage',
    method: 'get',
    params: options
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} name 必须：名称
 *        {Integer} firstOnly 必须：1只奖励一次， 0奖励多次
 *        {Integer} rewardsPoint 非必须：用户奖励积分数量，默认0
 *        {String} rewardsMessage 非必须：用户奖励模板消息
 *        {Integer} inviterPoint 非必须：邀请人奖励积分数量，默认0
 *        {String} inviterMessage 非必须：邀请人奖励模板消息
 *        {Integer} inviterAreaStrict 非必须：邀请人奖励限制区域，1是，0否。严格（零售户）区域设置，与扫码区域保持一致
 *        {String} inviterType 非必须：邀请人类型，02消费者、01零售户
 *        {Integer} followPoint 非必须：关注的人奖励积分数量，默认0
 *        {String} followMessage 非必须：关注的人奖励模板消息
 *        {Integer} followAreaStrict 非必须：关注的人奖励限制区域，1是，0否。严格（零售户）区域设置，与扫码区域保持一致
 *        {String} followType 非必须：关注的类型，02消费者、01零售户
 *        {String} enable 必须：1启用，0停用，默认1
 *        {Number} orderTag 非必须
 *        {String} remarks 非必须
 */
export function save (options) {
  return request({
    url: BASE_URL + '/tuike/rule/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 修改
 * @param {Object} options
 *        {String} id 必须：ID
 *        {String} actId 必须：活动ID
 *        {String} name 必须：名称
 *        {Integer} firstOnly 必须：1只奖励一次， 0奖励多次
 *        {Integer} rewardsPoint 非必须：用户奖励积分数量，默认0
 *        {String} rewardsMessage 非必须：用户奖励模板消息
 *        {Integer} inviterPoint 非必须：邀请人奖励积分数量，默认0
 *        {String} inviterMessage 非必须：邀请人奖励模板消息
 *        {Integer} inviterAreaStrict 非必须：邀请人奖励限制区域，1是，0否。严格（零售户）区域设置，与扫码区域保持一致
 *        {String} inviterType 非必须：邀请人类型，02消费者、01零售户
 *        {Integer} followPoint 非必须：关注的人奖励积分数量，默认0
 *        {String} followMessage 非必须：关注的人奖励模板消息
 *        {Integer} followAreaStrict 非必须：关注的人奖励限制区域，1是，0否。严格（零售户）区域设置，与扫码区域保持一致
 *        {String} followType 非必须：关注的类型，02消费者、01零售户
 *        {String} enable 必须：1启用，0停用，默认1
 *        {Number} orderTag 非必须
 *        {String} remarks 非必须
 */
export function update (options) {
  return request({
    url: BASE_URL + '/tuike/rule/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 删除
 * @param {String} id 必要：抽奖id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/tuike/rule/remove/' + id,
    method: 'delete'
  })
}
