import * as BaseCompanyApi from '@/api/core/BaseCompanyApi'

import LocalStorageCache from '@/core/cache/LocalStorageCache'

const CACHE_COMPANY = 'company_data'
const CACHE_TIMEOUT = 24 * 60 * 60 * 1000

/**
 * 初始化缓存数据
 */
export function initData () {
  return new Promise((resolve, reject) => {
    const promises = [
      initCompanyData()
    ]
    Promise.all(promises).then(() => {
      resolve()
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 获取缓存数据
 * @param {String} key includes: company
 * @return {Array} data
 */
export function getData (key) {
  const keyMap = {
    company: {
      key: CACHE_COMPANY,
      initFun: initCompanyData
    }
  }
  if (!keyMap[key]) {
    return Promise.reject(new Error(key + '无此数据'))
  }
  const time = LocalStorageCache.getExpiration(keyMap[key].key)
  if (Date.now() <= time) {
    return Promise.resolve(LocalStorageCache.get(keyMap[key].key))
  } else {
    return keyMap[key].initFun()
  }
}

async function initCompanyData () {
  try {
    const expiration = Date.now() + CACHE_TIMEOUT
    const { data } = await BaseCompanyApi.list()
    LocalStorageCache.set(CACHE_COMPANY, data, expiration)
    setTimeout(() => {
      const time = LocalStorageCache.getExpiration(CACHE_COMPANY)
      time === expiration && initCompanyData()
    }, CACHE_TIMEOUT - 1000)
    return data
  } catch (error) {
    return error
  }
}
