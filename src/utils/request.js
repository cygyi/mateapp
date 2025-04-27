import axios from 'axios'
//import { showLoading, hideLoading } from './loading'

// 创建 axios 实例
const service = axios.create({
  baseURL: 'https://mateapp-git-master-cygyis-projects.vercel.app',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 移除请求配置的日志
    return config
  },
  error => {
    // 请求错误时隐藏加载提示
    //hideLoading()
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 响应成功时隐藏加载提示
    //hideLoading()
    const res = response.data

    // 如果响应数据直接是数组，包装成标准格式
    if (Array.isArray(res)) {
      return {
        code: 200,
        data: {
          list: res
        },
        message: 'success'
      }
    }

    // 如果是标准格式，直接返回
    if (res.code === 200) {
      return res
    }

    // 其他情况返回错误
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  error => {
    // 响应错误时隐藏加载提示
    //hideLoading()
    console.error('响应错误:', error)
    if (error.response) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default service 