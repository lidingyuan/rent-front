/**
 * @description: 重写流程图数据，添加所需要的属性
 * @author: LCX
 * @date: 2020-09-16 16:00:15
 * @version: V1.0.0
*/
import * as ActPhaseApi from '@/api/activityInfo/ActPhaseApi'
import { copyProperties } from '@/utils/objects'

const flowData = {
  namespaced: true,
  state: {
    // 格式,id为组件自动生成的，nodeId则为actId或者phaseId这类的值
    node2Phase: { id: '', name: '', phaseType: '', phaseId: '', shape: '', entryUrl: '' },
    // 流程图全部元素数据，不可直接用，最后保存是需要以flow.getGraph()为准
    // 格式{nodes: [], edges: []},单条数据格式：{formModel, node2Phase}，formModel和流程图元素的model属性一致
    // node2Phase:{id,phaseId,phaseType},其中，id和formModel.id保持一致
    flowList: {},
    // 环节列表
    phaseList: [],
    // 更新活动信息标志
    actUpdateFlag: false,
    // ---活动相关数据
    actInfo: {},
    // 活动参与约束
    actJoinRuleList: [],
    // 活动可见约束
    actVisibleRuleList: [],
    // 活动素材
    actMaterialList: []
  },
  getters: {
    node2Phase: state => state.node2Phase,
    flowList: state => state.flowList,
    phaseList: state => state.phaseList,
    actUpdateFlag: state => state.actUpdateFlag,
    actInfo: state => state.actInfo,
    actJoinRuleList: state => state.actJoinRuleList,
    actVisibleRuleList: state => state.actVisibleRuleList,
    actMaterialList: state => state.actMaterialList
  },
  mutations: {
    // 通用保存数据
    UPDATE_DATA (state, { data, name }) {
      state[name] = data
    },
    UPDATE_NODE2PHASE (state, { formModel, node2Phase }) {
      copyProperties(node2Phase, state.node2Phase)
      state.node2Phase.id = formModel.id
      state.node2Phase.name = formModel.label
      state.shape = formModel.shape
    },
    // 更新flowList
    UPDATE_FLOWLIST (state, { formModel, node2Phase, flowList }) {
      if (flowList) {
        state.flowList = flowList
        return
      }
      const key = formModel.type ? formModel.type + 's' : 'edges'
      if (!state.flowList[key]) state.flowList[key] = []
      let index = state.flowList[key].findIndex(item => item.id === formModel.id)
      let data = null
      // 1.edge更新
      if (key === 'edges') {
        data = formModel
      }
      // 2.node更新
      if (key === 'nodes') {
        data = Object.assign({}, node2Phase, formModel)
      }

      // 更新该条数据
      if (index > -1) {
        // 修改
        state.flowList[key][index] = data
      } else {
        // 新增
        state.flowList[key].push(data)
      }
    },
    // 更新flowList中phaseId
    UPDATE_PHASEID (state, { id, phaseId }) {
      let index = state.flowList.nodes.findIndex(item => item.id === id)
      state.flowList.nodes[index]['phaseId'] = phaseId
      // 更新当前编辑节点数据中phaseId
      state.node2Phase.phaseId = phaseId
    },
    // 更新环节(用于查询后保存)
    UPDATE_PHASELIST (state, data) {
      state.phaseList = data

      // 填充当前节点的entryUrl，解决新增环节后entryUrl为空
      if (state.node2Phase.phaseId) {
        let phase = data.find(item => item.phaseId === state.node2Phase.phaseId)
        state.node2Phase.entryUrl = phase ? phase.entryUrl : state.node2Phase.entryUrl
      }
    }
  },
  actions: {
    // 查询环节列表
    SearchPhaseList ({ commit }, actId) {
      return new Promise((resolve, reject) => {
        ActPhaseApi.list({ actId }).then(res => {
          commit('UPDATE_PHASELIST', res.data)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default flowData
