import request from '@/utils/request'

export function getActiveInfo (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611478943731',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}

// 扫码和卷烟规格
// zoomlgd-data/api/activity/1611555677813
export function getSmokeScanInfo (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611555677813',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
// 日·周·月 扫码 /zoomlgd-data/api/activity/1611627986890
export function getDayWeekMonthScanInfo (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611627986890',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
// 1611556698188
export function getScanDrawCntInfo (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611556698188',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
// 消费者会员1611546329844
export function getVipNumUserInfo (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611546329844',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
// 会员总数和30天 1611553334336
export function getVipUserNum (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611553334336',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
// 积分 1611538638289
export function getIntegralNum (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611538638289',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
// 活动奖品和发放 1611631513625
export function getPrizeSend (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611631513625',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
// 中奖率和奖品数量
export function getPrizePencent (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611652916992',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
// 1611712657217
export function getOrderNum (data) {
  return request({
    url: '/zoomlgd-data/api/activity/1611712657217',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}

/**
 * 按区域扫码抽奖
 * @param {*} data
 */
export function getSweepstakesInfo (data) {
  return request({
    url: '/zoomlgd-data/api/scan/lucky/ZTMyYWI5MmYxYzdm',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'get',
    params: data
  })
}
