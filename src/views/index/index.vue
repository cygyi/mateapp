<template>
  <div class="page-container">
    <div class="container" ref="containerRef">
      <div class="refresh-tip" :class="{ 'refreshing': isRefreshing }" :style="{ opacity: pullDistance > 0 ? 1 : 0 }">
        <span>
          <div class="loading-spinner" v-if="isRefreshing"></div>
          {{ refreshText }}
        </span>
      </div>
      <div class="content" :style="{ paddingBottom: '20px', transform: `translateY(${pullDistance}px)` }">
        <!-- 骨架屏 -->
        <!-- <template v-if="leftItems.length === 0 && rightItems.length === 0">
          <div class="left-box">
            <div class="card" v-for="n in 5" :key="n">
              <div class="image-container">
                <div class="image-placeholder">
                  <div class="placeholder-content"></div>
                </div>
              </div>
              <div class="card-title">
                <div class="title-placeholder"></div>
              </div>
              <div class="card-game"></div>
              <div class="card-footer">
                <div class="user-info">
                  <div class="avatar-placeholder"></div>
                  <div class="username-placeholder"></div>
                </div>
                <div class="card-stats">
                  <div class="time-placeholder"></div>
                  <div class="stats">
                    <div class="likes-placeholder"></div>
                    <div class="comments-placeholder"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right-box">
            <div class="card" v-for="n in 5" :key="n">
              <div class="image-container">
                <div class="image-placeholder">
                  <div class="placeholder-content"></div>
                </div>
              </div>
              <div class="card-title">
                <div class="title-placeholder"></div>
              </div>
              <div class="card-game"></div>
              <div class="card-footer">
                <div class="user-info">
                  <div class="avatar-placeholder"></div>
                  <div class="username-placeholder"></div>
                </div>
                <div class="card-stats">
                  <div class="time-placeholder"></div>
                  <div class="stats">
                    <div class="likes-placeholder"></div>
                    <div class="comments-placeholder"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template> -->
        <!-- 实际内容 -->
        <!-- <template> -->
          <div class="left-box">
            <div class="card" v-for="item in leftItems" :key="item.id" :data-id="item.id" v-lazy-load>
              <div class="image-container">
                <div class="image-placeholder" v-if="!imageLoadedStates[item.id] && item.type !== 'video'">
                  <div class="placeholder-content"></div>
                </div>
                <template v-if="item.type === 'video'">
                  <VideoPlayer 
                    ref="videoRefs[item.id]" 
                    :src="item.image" 
                    :poster="item.poster" 
                    @play="handleVideoPlay(item.id)"
                  />
                </template>
                <template v-else>
                  <img v-if="item.image" class="card-image" :src="item.image" alt="" @load="handleImageLoad"
                    :class="{ 'image-loaded': imageLoadedStates[item.id] }" />
                </template>
              </div>
              <div class="card-title" v-if="!item.title">
                <div class="title-placeholder"></div>
              </div>
              <div class="card-title" v-else>{{ item.title }}</div>
              <div class="card-game">{{ item.game }}</div>
              <div class="card-footer">
                <div class="user-info">
                  <img class="avatar" :src="item.avatar" alt="" />
                  <span>{{ item.username }}</span>
                </div>
                <div class="card-stats">
                  <span class="time">{{ item.time }}</span>
                  <div class="stats">
                    <span class="likes">❤️ {{ item.likes }}</span>
                    <span class="comments">💬 {{ item.comments }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right-box">
            <div class="card" v-for="item in rightItems" :key="item.id" :data-id="item.id" v-lazy-load>
              <div class="image-container" :style="{ height: item.image ? 'inherit' : '150px' }">
                <div class="image-placeholder" v-if="!imageLoadedStates[item.id] && item.type !== 'video'">
                  <div class="placeholder-content"></div>
                </div>
                <template v-if="item.type === 'video'">
                  <VideoPlayer 
                    ref="videoRefs[item.id]" 
                    :src="item.image" 
                    :poster="item.poster" 
                    @play="handleVideoPlay(item.id)"
                  />
                </template>
                <template v-else>
                  <img v-if="item.image" class="card-image" :src="item.image" alt="" @load="handleImageLoad"
                    :class="{ 'image-loaded': imageLoadedStates[item.id] }" />
                </template>
              </div>
              <div class="card-title" v-if="!item.title">
                <div class="title-placeholder"></div>
              </div>
              <div class="card-title" v-else>{{ item.title }}</div>
              <div class="card-game">{{ item.game }}</div>
              <div class="card-footer">
                <div class="user-info">
                  <img class="avatar" :src="item.avatar" alt="" />
                  <span>{{ item.username }}</span>
                </div>
                <div class="card-stats">
                  <span class="time">{{ item.time }}</span>
                  <div class="stats">
                    <span class="likes">❤️ {{ item.likes }}</span>
                    <span class="comments">💬 {{ item.comments }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <!-- </template> -->
      </div>
      <div class="no-more" v-if="hasNoMore" style="gap: 10px;display: flex;align-items: center;justify-content: center;width: 100%;height: 40px;margin-bottom: 20px;">
        <img style="width: 20px;height: 20px;" src="@/assets/images/no_data.png" alt="">
        <div style="color: #666;font-size: 12px;">没有更多了</div>
      </div>
    </div>
    <Loading :show="isLoading" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import { getList } from '../../api'
import { useRoute } from 'vue-router'
import VideoPlayer from '@/components/VideoPlayer.vue'
import Loading from '@/components/Loading.vue'

const route = useRoute()
// 获取路由参数
const urlQueryState = route.query.state
const containerRef = ref(null)
const isRefreshing = ref(false)
const refreshText = ref('下拉刷新')
const pullDistance = ref(0)
const isLoading = ref(false)
const leftItems = ref([])
const rightItems = ref([])
const currentPage = ref(1)
const pageSize = 10
const isAtTop = ref(true)
const hasNoMore = ref(false)
const isFirstLoad = ref(true)
const isOneRender = ref(true)
let scrollTimer = null

const { y, arrivedState, isScrolling } = useScroll(containerRef)

const imageLoadedStates = ref({})
const imageHeights = ref({})
const videoRefs = ref({})
const currentPlayingVideoId = ref(null)

// 懒加载指令
const vLazyLoad = {
  mounted(el) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 元素进入视口时添加动画类
          el.classList.add('fade-in')
          observer.unobserve(el)
        }
      })
    }, {
      threshold: 0.1, // 当元素 10% 进入视口时触发
      rootMargin: '50px' // 提前 50px 触发
    })
    
    observer.observe(el)
  }
}

// 预加载图片并获取高度
const preloadImage = (url, id) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      imageHeights.value[id] = img.height
      resolve(img.height)
    }
    img.onerror = () => {
      imageHeights.value[id] = 150 // 默认高度
      resolve(150)
    }
    img.src = url
  })
}

// 处理图片加载完成
const handleImageLoad = (event) => {
  const img = event.target
  const card = img.closest('.card')
  if (card) {
    const cardId = card.dataset.id
    imageLoadedStates.value[cardId] = true
  }
}

// 监听滚动到底部
watch(arrivedState, (state) => {
  if (state.bottom && !isLoading.value && !hasNoMore.value && !isFirstLoad.value) {
    loadMore()
  }
})

// 加载更多
const loadMore = async () => {
  if (isLoading.value || hasNoMore.value) return
  
  isLoading.value = true
  currentPage.value++
  await loadData(currentPage.value)
  isLoading.value = false
}

// 加载数据
const loadData = async (page, isRefresh = false) => {
  try {
    const response = await getList({ 
      page, 
      pageSize, 
      state: urlQueryState 
    })
    
    // 检查响应数据结构
    if (!response || !response.list) {
      console.error('响应数据格式错误:', response)
      return null
    }
    
    const newItems = response.list
    
    // 检查是否没有更多数据
    if (newItems.length === 0) {
      hasNoMore.value = true
      return null
    }
    
    if (isRefresh) {
      // 刷新时清空数据
      leftItems.value = []
      rightItems.value = []
      imageLoadedStates.value = {}
      imageHeights.value = {}
      hasNoMore.value = false
    }
    
    // 将新数据分配到左右两列
    newItems.forEach((item, index) => {
      if (index % 2 === 0) {
        leftItems.value.push(item)
      } else {
        rightItems.value.push(item)
      }
      // 初始化图片加载状态为未加载
      imageLoadedStates.value[item.id] = false
    })
    
    // 首次加载完成后设置标志
    if (isFirstLoad.value) {
      isFirstLoad.value = false
    }
    
    return response
  } catch (error) {
    console.error('加载数据失败:', error)
    return null
  }
}

// 刷新数据
const refresh = async () => {
  isRefreshing.value = true
  refreshText.value = '正在刷新...'
  
  currentPage.value = 1
  await loadData(currentPage.value, true)
  
  isRefreshing.value = false
  refreshText.value = '刷新完成'
  pullDistance.value = 0
  
  setTimeout(() => {
    refreshText.value = '下拉刷新'
  }, 1000)
}

let startY = 0
let isDragging = false

// 检查是否在顶部
const checkIsAtTop = () => {
  if (containerRef.value) {
    isAtTop.value = containerRef.value.scrollTop === 0
  }
}

// 监听滚动事件
const handleScroll = () => {
  // 清除之前的定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
  
  // 设置新的定时器，等待滚动停止
  scrollTimer = window.setTimeout(() => {
    checkIsAtTop()
  }, 100)
}

const handleTouchStart = (e) => {
  if (containerRef.value?.scrollTop === 0) {
    startY = e.touches[0].clientY
    isDragging = true
    console.log('开始下拉')
  }
}

const handleTouchMove = (e) => {
  if (!isDragging) return
  
  const currentY = e.touches[0].clientY
  const diff = currentY - startY
  
  if (diff > 0) {
    e.preventDefault()
    pullDistance.value = Math.min(diff * 0.5, 60)
    console.log('下拉距离:', pullDistance.value)
    
    if (diff > 30) {
      refreshText.value = '松开刷新'
    } else {
      refreshText.value = '下拉刷新'
    }
  }
}

const handleTouchEnd = (e) => {
  if (!isDragging) return
  
  const currentY = e.changedTouches[0].clientY
  const diff = currentY - startY
  
  if (diff > 30) {
    refresh()
  } else {
    pullDistance.value = 0
  }
  
  isDragging = false
  refreshText.value = '下拉刷新'
  console.log('结束下拉')
}

// 监听滚动状态
watch(isScrolling, (scrolling) => {
  if (scrolling) {
    // 如果正在滚动，重置下拉状态
    isDragging = false
    pullDistance.value = 0
    refreshText.value = '下拉刷新'
  }
})

// 处理视频播放
const handleVideoPlay = (videoId) => {
  // 如果当前有其他视频在播放，暂停它
  if (currentPlayingVideoId.value && currentPlayingVideoId.value !== videoId) {
    const prevVideoRef = videoRefs.value[currentPlayingVideoId.value]
    if (prevVideoRef) {
      prevVideoRef.pauseVideo()
    }
  }
  currentPlayingVideoId.value = videoId
}

onMounted(async () => {
  if (containerRef.value) {
    containerRef.value.addEventListener('touchstart', handleTouchStart)
    containerRef.value.addEventListener('touchmove', handleTouchMove)
    containerRef.value.addEventListener('touchend', handleTouchEnd)
    containerRef.value.addEventListener('scroll', handleScroll)
  }
  
  // 首次加载数据
  await loadData(1)
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('touchstart', handleTouchStart)
    containerRef.value.removeEventListener('touchmove', handleTouchMove)
    containerRef.value.removeEventListener('touchend', handleTouchEnd)
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
  // 清除定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
  if (currentPlayingVideoId.value) {
    const videoRef = videoRefs.value[currentPlayingVideoId.value]
    if (videoRef) {
      videoRef.pauseVideo()
    }
  }
})
</script>

<style lang="less" scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.refresh-tip {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  background-color: transparent;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  
  &.refreshing {
    opacity: 1;
  }
  
  .loading-spinner {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.content {
  position: relative;
  z-index: 1;
  min-height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0.3rem 0.5rem;
  box-sizing: border-box;
  padding-top: 0.5rem;
  width: 100%;
  background-color: #f5f5f5;
}

.loading-text {
  position: fixed;
  top: calc(50% + 20px);
  left: 50%;
  transform: translateX(-50%);
  color: #666;
  font-size: 14px;
  z-index: 9999;
}

.loading-spinner {
  width: 2.4rem;
  height: 2.4rem;
  border: 0.2rem solid rgba(255, 255, 255, 0.3);
  border-top: 0.2rem solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.left-box, .right-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 150px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
    background-color: #f0f0f0;
  }

  .card-image.image-loaded {
    opacity: 1;
  }

  .card-image.video {
    background-color: #000;
  }

  video.card-image {
    background-color: #000;
  }

  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    z-index: 1;
  }

  .placeholder-content {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  // 给每个占位符添加不同的动画延迟
  &:nth-child(1) .image-placeholder,
  &:nth-child(1) .placeholder-content {
    animation-delay: 0s;
  }
  &:nth-child(2) .image-placeholder,
  &:nth-child(2) .placeholder-content {
    animation-delay: 0.3s;
  }
  &:nth-child(3) .image-placeholder,
  &:nth-child(3) .placeholder-content {
    animation-delay: 0.6s;
  }
  &:nth-child(4) .image-placeholder,
  &:nth-child(4) .placeholder-content {
    animation-delay: 0.9s;
  }
  &:nth-child(5) .image-placeholder,
  &:nth-child(5) .placeholder-content {
    animation-delay: 1.2s;
  }
  &:nth-child(6) .image-placeholder,
  &:nth-child(6) .placeholder-content {
    animation-delay: 1.5s;
  }
  &:nth-child(7) .image-placeholder,
  &:nth-child(7) .placeholder-content {
    animation-delay: 1.8s;
  }
  &:nth-child(8) .image-placeholder,
  &:nth-child(8) .placeholder-content {
    animation-delay: 2.1s;
  }
  &:nth-child(9) .image-placeholder,
  &:nth-child(9) .placeholder-content {
    animation-delay: 2.4s;
  }
  &:nth-child(10) .image-placeholder,
  &:nth-child(10) .placeholder-content {
    animation-delay: 2.7s;
  }

  .card-title {
    font-size: 1rem;
    font-weight: bold;
    margin: 0.3rem 0;
    min-height: 1.2rem;
    position: relative;
  }

  .title-placeholder {
    width: 80%;
    height: 1rem;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    border-radius: 4px;
  }

  .card-game {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.3rem;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0;
    font-size: 0.8rem;
    color: #999;

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.3rem;

      .avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .card-stats {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.2rem;

      .time {
        font-size: 0.7rem;
      }

      .stats {
        display: flex;
        gap: 0.5rem;

        .likes, .comments {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }
      }
    }
  }

  .avatar-placeholder {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  .username-placeholder {
    width: 60px;
    height: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    border-radius: 4px;
  }

  .time-placeholder {
    width: 40px;
    height: 14px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    border-radius: 4px;
  }

  .likes-placeholder,
  .comments-placeholder {
    width: 30px;
    height: 14px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    border-radius: 4px;
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  50% {
    background-position: 0 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  color: #999;
  font-size: 14px;
  
  .loading-spinner {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
}

.safe-area {
  height: 50px;
  width: 100%;
  position: relative;
  
  .safe-tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #999;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &.show-tip .safe-tip {
    opacity: 1;
  }
}

.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>
