import { login, logout } from '@/api/system/login'
import { info } from '@/api/system/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const DEFAULT_AVATAR = process.env.BASE_URL + 'avatar.jpeg'

const user = {
  namespaced: true,

  state: {
    token: getToken(),
    name: '',
    avatar: '',
    authorities: [],
    menus: [],
    forceChangePassword: false
  },

  getters: {
    token: state => state.token,
    avatar: state => state.avatar,
    name: state => state.name,
    authorities: state => state.authorities,
    menus: state => state.menus,
    forceChangePassword: state => state.forceChangePassword
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_AUTHORITIES: (state, authorities) => {
      state.authorities = authorities
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_FORCE_CHANGE_PASSWORD: (state, passwordExpireTime) => {
      state.forceChangePassword = passwordExpireTime !== -1 && Date.now() >= passwordExpireTime
    }
  },

  actions: {
    // 登录
    Login ({ commit }, loginInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(loginInfo).then(response => {
          const data = response.data
          console.log(data)
          if (data.token) {
            setToken(data.token)
            commit('SET_TOKEN', data.token)
          } else if (data.access_token) {
            const token = data.token_type + ' ' + data.access_token
            setToken(token)
            commit('SET_TOKEN', token)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        info().then(response => {
          const data = response.data
          if (data.authorities && data.authorities.length > 0) {
            commit('SET_AUTHORITIES', data.authorities)
          }
          if (data.menus && data.menus.length > 0) {
            commit('SET_MENUS', data.menus)
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar || DEFAULT_AVATAR)
          commit('SET_FORCE_CHANGE_PASSWORD', Number.parseInt(data.passwordExpireTime || -1))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_NAME', '')
          commit('SET_AUTHORITIES', [])
          commit('SET_MENUS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogout ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AUTHORITIES', [])
        commit('SET_MENUS', [])
        removeToken()
        resolve()
      })
    }
  }
}

export default user
