import { MockMethod } from 'vite-plugin-mock'
import { Random } from 'mockjs'
const Mock = require('mockjs')

interface ListItem {
  id: number
  title: string
  game: string
  username: string
  avatar: string
  time: string
  likes: number
  comments: number
  image: string
  type: 'image' | 'video'
}

// 可访问的视频链接列表
const videoUrls = [
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://media.w3.org/2010/05/bunny/trailer.mp4',
  'https://media.w3.org/2010/05/bunny/movie.mp4',
  'https://media.w3.org/2010/05/video/movie_300.mp4',
  'https://media.w3.org/2010/05/video/movie_300.webm'
]

// 可访问的图片链接列表
const imageUrls = [
  'https://picsum.photos/800/600',
  'https://picsum.photos/800/601',
  'https://picsum.photos/800/602',
  'https://picsum.photos/800/603',
  'https://picsum.photos/800/604'
]

export default [
  {
    url: '/api/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, state } = query
      const start = (page - 1) * pageSize
      const end = start + pageSize

      // 生成基础数据
      const generateBaseData = (id: number): Omit<ListItem, 'image' | 'type'> => ({
        id,
        title: Random.ctitle(5, 10),
        game: Random.ctitle(2, 4),
        username: Random.cname(),
        avatar: Random.image('100x100', '#50B347', '#FFF', 'avatar'),
        time: Random.datetime('yyyy-MM-dd HH:mm'),
        likes: Random.integer(0, 1000),
        comments: Random.integer(0, 100)
      })

      // 根据 state 参数生成不同类型的数据
      let list: ListItem[] = []
      if (state === 'video') {
        // 视频和图片混合
        list = Array.from({ length: 20 }, (_, i) => {
          const baseData = generateBaseData(i + 1)
          const isVideo = Math.random() > 0.5
          return {
            ...baseData,
            image: isVideo
              ? videoUrls[Math.floor(Math.random() * videoUrls.length)]
              : imageUrls[`https://picsum.photos/300/${Mock.Random.integer(200, 400)}`],
            type: isVideo ? 'video' : 'image'
          }
        })
      } else if (state === 'image') {
        // 只返回图片
        list = Array.from({ length: 20 }, (_, i) => {
          const baseData = generateBaseData(i + 1)
          return {
            ...baseData,
            image: `https://picsum.photos/300/${Mock.Random.integer(200, 400)}`,
            type: 'image'
          }
        })
      } else {
        // 默认只返回图片
        list = Array.from({ length: 20 }, (_, i) => {
          const baseData = generateBaseData(i + 1)
          return {
            ...baseData,
            image: `https://picsum.photos/300/${Mock.Random.integer(200, 400)}`,
            type: 'image'
          }
        })
      }

      return {
        code: 200,
        message: 'success',
        data: {
          list: list.slice(start, end),
          total: list.length
        }
      }
    }
  }
] as MockMethod[] 