
import LocalStorageCache from '@/core/cache/LocalStorageCache'

import * as MaterialApi from '@/api/MaterialApi.js'
import * as MaterialTypeApi from '@/api/MaterialTypeApi.js'
import store from '@/store'

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
    initMaterialTypeList(),
    initProjectList()
  ]
  await Promise.all(promiseList)
}

async function initMaterialList () {
  const materialList = LocalStorageCache.get('materialList')
  if (materialList) {
    baseData.materialList = materialList
    return
  }
  const { data } = await MaterialApi.list()
  LocalStorageCache.set('materialList', data, expiration)
  baseData.materialList = data
}

async function initMaterialTypeList () {
  const materialTypeList = LocalStorageCache.get('materialTypeList')
  if (materialTypeList) {
    baseData.materialTypeList = materialTypeList
    return
  }
  const { data } = await MaterialTypeApi.list()
  LocalStorageCache.set('materialTypeList', data, expiration)
  baseData.materialTypeList = data
}

async function initProjectList () {
  return await store.dispatch('project/updateProjectList')
}

export default baseData
