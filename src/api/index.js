import request from '../utils/request'

// 创建 axios 实例
const instance = request

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    console.log('API响应:', response)
    // 检查响应数据结构
    if (response.data) {
      // 保持原始响应结构
      return response.data
    } else {
      console.error('响应数据格式错误:', response.data)
      return Promise.reject(new Error('响应数据格式错误'))
    }
  },
  error => {
    console.error('API错误:', error)
    return Promise.reject(error)
  }
)

// 获取列表数据
export const getList = (params) => {
  return request({
    url: '/api/list',
    method: 'post',
    data: params
  })
}

// 获取帖子详情
export const getPostDetail = (id) => {
  return request({
    url: `/api/post/${id}`,
    method: 'get'
  })
}

// 点赞/取消点赞
export const toggleLike = (id, isLiked) => {
  return request({
    url: `/api/like/${id}`,
    method: 'post',
    data: { isLiked }
  })
}

// 发表评论
export const addComment = (id, content) => {
  return request({
    url: `/api/comment/${id}`,
    method: 'post',
    data: { content }
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return instance.get('/api/user/info')
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return instance.post('/api/user/info', data)
}

// 上传文件
export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return instance.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取消息列表
export const getMessages = (params) => {
  return instance.get('/api/messages', { params })
}

// 标记消息已读
export const markMessageRead = (id) => {
  return instance.post(`/api/messages/${id}/read`)
}

// 删除消息
export const deleteMessage = (id) => {
  return instance.delete(`/api/messages/${id}`)
} 