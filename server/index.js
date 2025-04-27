const express = require('express')
const cors = require('cors')
const Mock = require('mockjs')

const app = express()
const port = process.env.PORT || 3000

// 配置 CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// 添加响应头中间件
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
})

app.use(express.json())

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, req.body)
  next()
})

// 健康检查接口
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// 可访问的视频链接列表
const videoUrls = [
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://media.w3.org/2010/05/bunny/trailer.mp4',
  'https://media.w3.org/2010/05/bunny/movie.mp4',
  'https://media.w3.org/2010/05/video/movie_300.mp4',
  'https://cdn.coverr.co/videos/coverr-taking-photos-with-a-polaroid-camera-87/720p.mp4',
  'https://media.istockphoto.com/id/1027020436/ja/%E3%83%93%E3%83%87%E3%82%AA/%E7%A9%BA%E3%81%AE%E3%82%BF%E3%82%A4%E3%83%A0%E3%83%A9%E3%83%97%E3%82%B9.mp4?s=mp4-640x640-is&k=20&c=4h66feOZRHMGaBdWQ-2DNNNS3PksAcXOVNtzDn_UHBA=',
  'https://media.istockphoto.com/id/146126308/ja/%E3%83%93%E3%83%87%E3%82%AA/%E6%97%A5%E3%81%AE%E5%87%BA%E3%81%8B%E3%82%89-beautyfull-%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9.mp4?s=mp4-640x640-is&k=20&c=vllne1iocNSvVWK-5D6hECgX6QeOo0dlUAfcFULnN6I=',
  'https://media.istockphoto.com/id/2154171987/ja/%E3%83%93%E3%83%87%E3%82%AA/%E3%82%BF%E3%82%A4%E3%83%A0%E3%83%A9%E3%83%97%E3%82%B9%E9%9B%B2%E7%A9%BA.mp4?s=mp4-640x640-is&k=20&c=4RJ_UBMj1-e1B4eYRZRwm98mOWYH_DVJIHGZzkkazVU=',
]

// 生成基础数据
const generateBaseData = (id) => ({
  id,
  title: Mock.Random.ctitle(5, 10),
  game: Mock.Random.ctitle(2, 4),
  username: Mock.Random.cname(),
  avatar: Mock.Random.image('100x100', '#50B347', '#FFF', 'avatar'),
  time: Mock.Random.datetime('yyyy-MM-dd HH:mm'),
  likes: Mock.Random.integer(0, 1000),
  comments: Mock.Random.integer(0, 100)
})

// 获取列表数据接口
app.post('/api/list', (req, res) => {
  try {
    console.log('收到请求参数:', req.body)
    const { page = 1, pageSize = 10, state } = req.body
    const start = (page - 1) * pageSize
    const end = start + pageSize

    // 根据 state 参数生成不同类型的数据
    let list = []
    if (state === 'video') {
      // 视频和图片混合
      list = Array.from({ length: 40 }, (_, i) => {
        const baseData = generateBaseData(i + 1)
        const isVideo = Math.random() > 0.5
        const item = {
          ...baseData,
          image: isVideo
            ? videoUrls[Math.floor(Math.random() * videoUrls.length)]
            : `https://picsum.photos/300/${Mock.Random.integer(200, 400)}`,
          type: isVideo ? 'video' : 'image'
        }
        console.log('生成数据项:', item)
        return item
      })
    } else if (state === 'image') {
      // 只返回图片
      list = Array.from({ length: 60 }, (_, i) => {
        const baseData = generateBaseData(i + 1)
        const item = {
          ...baseData,
          image: `https://picsum.photos/300/${Mock.Random.integer(200, 400)}`,
          type: 'image'
        }
        console.log('生成数据项:', item)
        return item
      })
    } else {
      // 默认只返回图片
      list = Array.from({ length: 60 }, (_, i) => {
        const baseData = generateBaseData(i + 1)
        const item = {
          ...baseData,
          image: `https://picsum.photos/300/${Mock.Random.integer(200, 400)}`,
          type: 'image'
        }
        console.log('生成数据项:', item)
        return item
      })
    }

    // 确保返回正确的数据结构
    const response = {
      code: 200,
      data: {
        list: list.slice(start, end),
        total: list.length
      }
    }

    console.log('返回数据:', JSON.stringify(response, null, 2))
    res.json(response)

  } catch (error) {
    console.error('列表接口错误:', error)
    res.status(500).json({
      error: error.message
    })
  }
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在'
  })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('全局错误:', err)
  res.status(500).json({
    code: 500,
    message: '服务器错误',
    error: err.message
  })
})

// 在本地开发时启动服务器
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`)
  })
}

// 导出 app 供 Vercel 使用
module.exports = app 