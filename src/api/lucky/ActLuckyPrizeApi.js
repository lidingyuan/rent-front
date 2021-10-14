import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 分页查询
 * @param {string} luckyId 抽奖ID
 */

export function list (luckyId) {
  return request({
    url: BASE_URL + '/lucky/prize/list',
    method: 'get',
    params: { luckyId }
  })
}

/**
 * 新增
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} luckyId 必须：抽奖游戏唯一标识
 *        {String} name 必须：奖项名称
 *        {Integer} rank 必须：奖项排名，从1开始排序
 *        {Float} chance 必须：抽奖概率，中奖概率累计为1
 *        {Integer} type 必须：奖项类别，1是可中奖的奖项，0是非中奖项，例如谢谢参与
 *        {String} img 必须：奖项图片URL，JSON数组，注意顺序
 *        {String} goodsId 必须：物资ID
 *        {String} goodsName 必须：物资名称
 *        {Integer} goodsNum 必须：每份奖项包含该奖品的个数
 *        {String} goodsType 必须：物资类型，01红包，02积分，03实物
 *        {Integer} position 必须：转盘序号，从0开始编号
 *        {String} standby 必须：是否是备用奖项，0-否，1-是，每个活动只能指定一个备用选项，用于抽奖约束自动更换奖项
 *        {String} enabled 必须：该奖项是否启用，0-否，1-是
 */
export function save (options) {
  return request({
    url: BASE_URL + '/lucky/prize/save',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}

/**
 * 修改
 * @param {Object} options
 *        {String} actId 必须：活动ID
 *        {String} luckyId 必须：抽奖游戏唯一标识
 *        {String} name 必须：奖项名称
 *        {Integer} rank 必须：奖项排名，从1开始排序
 *        {Float} chance 必须：抽奖概率，中奖概率累计为1
 *        {Integer} type 必须：奖项类别，1是可中奖的奖项，0是非中奖项，例如谢谢参与
 *        {String} img 必须：奖项图片URL，JSON数组，注意顺序
 *        {String} goodsId 必须：物资ID
 *        {String} goodsName 必须：物资名称
 *        {Integer} goodsNum 必须：每份奖项包含该奖品的个数
 *        {String} goodsType 必须：物资类型，01红包，02积分，03实物
 *        {Integer} position 必须：转盘序号，从0开始编号
 *        {String} standby 必须：是否是备用奖项，0-否，1-是，每个活动只能指定一个备用选项，用于抽奖约束自动更换奖项
 *        {String} enabled 必须：该奖项是否启用，0-否，1-是
 */
export function update (options) {
  return request({
    url: BASE_URL + '/lucky/prize/update',
    method: 'put',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: options
  })
}
/**
 * 删除
 * @param {String} id 必要：奖项id
 */
export function del (id) {
  return request({
    url: BASE_URL + '/lucky/prize/remove/' + id,
    method: 'delete'
  })
}
/**
 * 关联物资
 * @param {String} prizeId 必要：奖项id
 * @param {String} goodsId 必要：物资id
 * @param {String} goodsName 必要：物资名称
 * @param {integer} goodsNum 必要：奖项数量
 * @param {integer} goodsType 必要：物资类型
 */
export function setGoods (options) {
  return request({
    url: BASE_URL + '/lucky/prize/goods/associate',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    method: 'put',
    data: options
  })
}

/**
 * 设置图片
 * @param {String} prizeId 必要：奖项id
 * @param {String} img 必要：图片url
 */
export function setImg (options) {
  return request({
    url: BASE_URL + '/lucky/prize/image/save',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    method: 'put',
    data: options
  })
}
