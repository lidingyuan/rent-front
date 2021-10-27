
import * as ProjectApi from '@/api/ProjectApi.js'

const project = {
  namespaced: true,

  state: {
    projectList: []
  },

  getters: {
    projectList: state => state.projectList
  },

  mutations: {
    SET_PROJECT_LIST: (state, projectList) => {
      state.projectList = projectList
    }
  },
  actions: {
    updateProjectList ({ commit }) {
      ProjectApi.list().then(res => {
        commit('SET_PROJECT_LIST', res.data)
      })
    }
  }
}

export default project
