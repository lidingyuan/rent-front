
import LocalStorageCache from '@/core/cache/LocalStorageCache'

import * as MaterialApi from '@/api/MaterialApi.js'
import * as MaterialTypeApi from '@/api/MaterialTypeApi.js'

const expiration = 1000 * 60 * 60 * 24

const baseData = {
  materialList: null,
  materialTypeList: null
}

/**
 * 初始化缓存数据
 */
export async function initData () {
  const promiseList = [
    initMaterialList(),
    initMaterialTypeList()
  ]
  await Promise.all(promiseList)
}

async function initMaterialList () {
  const materialList = LocalStorageCache.get('materialList')
  if (materialList) {
    baseData.materialList = materialList
  }
  const { data } = await MaterialApi.list()
  LocalStorageCache.set('materialList', data, expiration)
  baseData.materialList = data
}

async function initMaterialTypeList () {
  const materialTypeList = LocalStorageCache.get('materialTypeList')
  if (materialTypeList) {
    baseData.materialTypeList = materialTypeList
  }
  const { data } = await MaterialTypeApi.list()
  LocalStorageCache.set('materialTypeList', data, expiration)
  baseData.materialTypeList = data
}

export default baseData
