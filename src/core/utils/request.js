import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/core/utils/auth'

console.info('BASE_API', process.env.VUE_APP_BASE_API)

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 50000, // request timeout
  // headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters['user/token']) {
      config.headers.Authorization = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.error(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (!response.data || response.data.code === undefined) {
      return response
    }

    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 0) {
      console.error('响应状态为：' + res.code)
      Message({
        message: res.msg || '',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error('error'))
    } else {
      return response.data
    }
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data)
      // console.log(error.response.status)
      // console.log(error.response.headers)
      // 1. 身份信息失效，发起ajax请求，返回401
      // 2. 身份信息失效，点击浏览器刷新按钮
      const status = error.response.status
      if (status === 401) {
        // 身份失效，需要重新登录
        MessageBox.confirm(
          '身份信息失效，您已被登出，点击取消继续留在该页面',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }
        ).then(() => {
          store.dispatch('user/FedLogout').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else if (status === 403) {
        // 权限不足
        Message({
          message: '禁止访问！',
          type: 'warning',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
      Message({
        message: '请求超时，或服务端无响应',
        type: 'warning',
        duration: 5 * 1000
      })
      // 请求没有响应
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
