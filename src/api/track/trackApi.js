/*
 *@description: 配置信息接口
 *@author: LCX
 *@date: 2020-09-03 15:48:13
 *@version: V1.0.1
*/
import request from '@/utils/request'

const BASE_URL = process.env.VUE_APP_ACTIVITY_BASE_URL

/**
 * 查询省份列表
 * @param {Object} options
 */
// https://yapi.zoomlgd.com/mock/12/activity/district/provList
export function provList () {
  return request({
    url: BASE_URL + '/district/provList',
    method: 'get',
    params: { }
  })
}
/**
 * 获取地市
 * @returns
 */
// https://yapi.zoomlgd.com/mock/12/activity/district/cityList
export function cityList () {
  return request({
    url: BASE_URL + '/district/cityList',
    method: 'get',
    params: {}
  })
}

/**
 * 获取区县
 * @returns
 */
// https://yapi.zoomlgd.com/mock/12/activity/district/countyList
export function countyList () {
  return request({
    url: BASE_URL + '/district/countyList',
    method: 'get',
    params: {}
  })
}

// activity/tobacco/list
export function tobaccoList () {
  return request({
    url: BASE_URL + '/tobacco/list',
    method: 'get',
    params: {}
  })
}

// 根据时间地区等条件查询推客活动列表
export function getTuikeActList (options) {
  return request({
    url: '/zoomlgd-data/api/activity/tuikeActList',
    method: 'get',
    params: options
  })
}

export function getTuikeData (options) {
  return request({
    url: '/zoomlgd-data/api/recommend/statistics',
    method: 'get',
    params: options
  })
}

export function getScanluck (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611727986890',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}

// 集盒活动统计
export function getScanbox (options) {
  return request({
    url: '/zoomlgd-data/api/scan/collect/count',
    method: 'get',
    params: options
  })
}
/**
 * 获取活动列表
 */
export function activityList () {
  return request({
    url: 'https://yapi.zoomlgd.com/mock/12/activity/act/config/listAll',
    // url: BASE_URL + 'act/config/listAll',
    method: 'get',
    params: {}
  })
}
// 传入时间和地区条件查询活动列表
export function actList (options) {
  return request({
    url: '/zoomlgd-data/api/activity/actList',
    method: 'get',
    params: options
  })
}

// 传入活动ID条件查询奖项列表
export function awardsList (options) {
  return request({
    url: '/zoomlgd-data/api/activity/awardsList',
    method: 'get',
    params: options
  })
}

// 根据活动ID查询统计数据
export function getScanMemberList (options) {
  return request({
    url: '/zoomlgd-data/api/activity/actscanmember/statistics',
    method: 'get',
    params: options
  })
}

/**
 * 奖项查询
 */
export function getPrizeluck (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611727986891',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}

/**
 * 根据区域查询问卷调查活动
 */
export function paperList (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611727986893',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}

/**
 *问卷调查活动答题次数统计
 */
export function paperStatistics (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611727986896',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}

/**
 * 用户账户积分变动监控
 */
export function userIntegralCount (data) {
  return request({
    url: '/zoomlgd-data/api/integral/userIntegralCounts',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    method: 'post',
    data: data
  })
}

/**
 * 用户账户积分流水分类统计
 */
export function userPointCount (data) {
  return request({
    url: '/zoomlgd-data/api/integral/userPointCount',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}

/**
 * 用户账户积分流水列表
 */
export function userPointDetails (data) {
  return request({
    url: '/zoomlgd-data/api/integral/userPointDetails',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    method: 'post',
    data: data
  })
}
