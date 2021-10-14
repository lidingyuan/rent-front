/**
 * @description: 基础数据，如卷烟，地区等
 * @author: LCX
 * @date: 2020-09-15 17:14:27
 * @version: V1.0.0
*/
import * as ActTobaccoApi from '@/api/baseInfo/ActTobaccoApi'
import * as ActDistrictApi from '@/api/baseInfo/ActDistrictApi'
import * as ActTypeApi from '@/api/activityInfo/ActTypeApi'
import * as ActRuleSourceApi from '@/api/activityInfo/ActRuleSourceApi'

const baseData = {
  namespaced: true,
  state: {
    // 活动类型
    actTypeList: [],
    // 卷烟
    tobaList: [],
    // 省份
    provList: [],
    // 省市原始数据
    areaList: [],
    // 省市二级树形数据
    areaTreeData: [],
    // 环节类型
    phaseTypeList: [
      { value: 'PAPER', label: '问卷' },
      { value: 'LUCKY', label: '抽奖' },
      { value: 'BOXCOLLECT', label: '集盒' },
      { value: 'TUIKE', label: '推客' },
      { value: 'CUSTOME', label: '自定义' }
    ],
    // 平台可定制的环节类型
    phaseTypeHad: ['LUCKY', 'PAPER'],
    // 约束列表
    ruleList: [],
    // 物资类型
    goodsTypeList: []
  },
  getters: {
    actTypeList: state => state.actTypeList,
    tobaList: state => state.tobaList,
    provList: state => state.provList,
    areaList: state => state.areaList,
    areaTreeData: state => state.areaTreeData,
    phaseTypeList: state => state.phaseTypeList,
    phaseTypeHad: state => state.phaseTypeHad,
    ruleList: state => state.ruleList,
    goodsTypeList: () => {
      return [
        { label: '红包', value: '01' },
        { label: '积分', value: '02' },
        { label: '实物', value: '03' },
        { label: '兑换券', value: '04' }
      ]
    }
  },
  mutations: {
    SAVE_DATA (state, { data, name }) {
      state[name] = data
    },
    SAVE_AREATREE (state, data = []) {
      let provList = []
      let obj = {}
      data.map(item => {
        if (obj[item.provCode] === undefined) {
          obj[item.provCode] = provList.push({ value: item.provCode, label: item.provName, children: [] }) - 1
        }
        provList[obj[item.provCode]].children.push({ value: item.cityCode, label: item.cityName })
      })
      state.areaTreeData = provList

      // 单一的省份数据(不含city)
      state.provList = provList.map(prov => {
        return {
          provCode: prov.value,
          provName: prov.label
        }
      })
    }
  },
  actions: {
    // 活动类型
    SearchActType ({ commit, state }) {
      return new Promise((resolve, reject) => {
        const name = 'actTypeList'
        if (state[name].length > 0) {
          resolve(state[name])
          return
        }
        ActTypeApi.list().then(res => {
          commit('SAVE_DATA', { name, data: res.data })
          resolve(res.data)
        }).catch(() => {
          commit('SAVE_DATA', { name, data: [] })
          resolve([])
        })
      })
    },
    // 查询卷烟
    SearchTobaList ({ commit, state }) {
      return new Promise((resolve, reject) => {
        const name = 'tobaList'
        if (state[name].length > 0) {
          resolve(state[name])
          return
        }
        ActTobaccoApi.list().then(res => {
          commit('SAVE_DATA', { name, data: res.data })
          resolve(res.data)
        }).catch(() => {
          commit('SAVE_DATA', { name, data: [] })
          resolve([])
        })
      })
    },
    // 查询全部的省市数据
    SearchAreaList ({ commit, state }) {
      return new Promise((resolve, reject) => {
        const name = 'areaList'
        if (state[name].length > 0) {
          resolve(state[name])
          return
        }

        ActDistrictApi.listAll().then(res => {
          commit('SAVE_DATA', { name, data: res.data })
          // 保存树形结构数据
          commit('SAVE_AREATREE', res.data)
          resolve(res.data)
        }).catch(() => {
          commit('SAVE_DATA', { name, data: [] })
          resolve([])
        })
      })
    },
    // 查询约束列表
    SearchRuleList ({ commit, state }) {
      return new Promise((resolve, reject) => {
        const name = 'ruleList'
        if (state[name].length > 0) {
          resolve(state[name])
          return
        }
        ActRuleSourceApi.list().then(res => {
          commit('SAVE_DATA', { name, data: res.data })
          resolve(res.data)
        }).catch(() => {
          commit('SAVE_DATA', { name, data: [] })
          resolve([])
        })
      })
    }
  }
}

export default baseData
