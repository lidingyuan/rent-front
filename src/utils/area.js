/**
 * @description: 地址转换工具
 * @author: LCX
 * @date: 2020-10-15 19:58:33
 * @version: V1.0.0
*/

import store from '../store'

// 根据code获取name字段;level: 2-地市，1-省份，0:未知，可能是地市，可能是省份
export function getNameByCode (code, level = 0) {
  let areaLevel = level
  const cityList = store.getters['baseData/areaList']
  const provList = store.getters['baseData/provList']
  // 未传入值
  if (!code) return ''
  // 匹配全国
  if (code === '000000') return '全国'
  // 匹配省份
  if (areaLevel === 1 || areaLevel === 0) {
    let prov = provList.find(item => item.provCode === code)
    if (prov) return prov.provName
  }
  // 匹配地市
  let city = cityList.find(item => item.cityCode === code)
  if (city) return `${city.provName}/${city.cityName}`
  return code
}
