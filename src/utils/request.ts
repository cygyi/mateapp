import axios from 'axios'
//import { showLoading, hideLoading } from './loading'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // // 显示加载提示
    // showLoading()
    return config
  },
  error => {
    // 请求错误时隐藏加载提示
    //hideLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 响应成功时隐藏加载提示
    //hideLoading()
    return response.data
  },
  error => {
    // 响应错误时隐藏加载提示
    //hideLoading()
    return Promise.reject(error)
  }
)

export default request 