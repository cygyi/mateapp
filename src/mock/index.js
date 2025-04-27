import Mock from 'mockjs'

// 生成随机图片URL
const getRandomImage = () => {
  return `https://picsum.photos/300/${Mock.Random.integer(200, 400)}`
}

// 生成卡片数据
const generateCardData = (count) => {
  return Array.from({ length: count }, () => ({
    id: Mock.Random.id(),
    title: Mock.Random.ctitle(5, 10),
    game: Mock.Random.ctitle(2, 4),
    username: Mock.Random.cname(),
    likes: Mock.Random.integer(100, 1000),
    image: getRandomImage(),
    avatar: `https://picsum.photos/50/${Mock.Random.integer(1, 100)}`,
    time: Mock.Random.datetime('MM-dd HH:mm'),
    comments: Mock.Random.integer(10, 100)
  }))
}

// 模拟获取列表数据
export const getListData = async (page, pageSize = 5) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    list: generateCardData(pageSize),
    page,
    pageSize,
    total: 100
  }
} 