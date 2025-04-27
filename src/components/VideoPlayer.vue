<template>
  <div class="video-container" :class="{ 'video-playing': isPlaying }" @click="handleContainerClick">
    <video
      ref="videoRef"
      class="video-player"
      :src="src"
      :poster="poster"
      playsinline
      webkit-playsinline
      x5-playsinline
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @waiting="handleWaiting"
      @canplay="handleCanPlay"
    ></video>
    <div class="video-controls" v-if="!isPlaying">
      <div class="play-button" @click.stop="playVideo">
        <img src="@/assets/images/play.png" alt="play" />
      </div>
    </div>
    <div class="pause-button" v-if="isPlaying && showControls" @click.stop="pauseVideo">
      <img src="@/assets/images/pause.png" alt="pause" />
    </div>
    <div class="loading-spinner" v-if="isBuffering">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: ''
  }
})

const videoRef = ref(null)
const isPlaying = ref(false)
const showControls = ref(false)
const isBuffering = ref(false)
const instance = getCurrentInstance()
let controlsTimer = null

// 显示控制按钮
const showControlsButton = () => {
  showControls.value = true
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
  controlsTimer = setTimeout(() => {
    showControls.value = false
  }, 3000)
}

// 播放视频
const playVideo = () => {
  // 通过全局事件总线通知其他视频暂停
  instance.appContext.config.globalProperties.$eventBus.emit('video-play', instance.uid)
  videoRef.value.play()
  isPlaying.value = true
  showControlsButton()
}

// 暂停视频
const pauseVideo = () => {
  videoRef.value.pause()
  isPlaying.value = false
  showControls.value = true
}

// 处理容器点击
const handleContainerClick = (e) => {
  // 如果点击的是按钮，不处理
  if (e.target.closest('.play-button') || e.target.closest('.pause-button')) {
    return
  }
  
  if (isPlaying.value) {
    pauseVideo()
  } else {
    playVideo()
  }
}

// 处理播放事件
const handlePlay = () => {
  isPlaying.value = true
  showControlsButton()
}

// 处理暂停事件
const handlePause = () => {
  isPlaying.value = false
  showControls.value = true
}

// 处理结束事件
const handleEnded = () => {
  isPlaying.value = false
  showControls.value = true
}

// 处理缓冲事件
const handleWaiting = () => {
  isBuffering.value = true
}

// 处理可以播放事件
const handleCanPlay = () => {
  isBuffering.value = false
}

// 监听全局视频播放事件
const handleGlobalVideoPlay = (videoId) => {
  if (videoId !== instance.uid && isPlaying.value) {
    pauseVideo()
  }
}

onMounted(() => {
  instance.appContext.config.globalProperties.$eventBus.on('video-play', handleGlobalVideoPlay)
})

onUnmounted(() => {
  instance.appContext.config.globalProperties.$eventBus.off('video-play', handleGlobalVideoPlay)
  if (controlsTimer) {
    clearTimeout(controlsTimer)
  }
})

// 暴露方法给父组件
defineExpose({
  playVideo,
  pauseVideo
})
</script>

<style lang="less" scoped>
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  &.video-playing {
    .video-controls {
      display: none;
    }
  }

  .video-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);

    .play-button {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      cursor: pointer;
      z-index: 1;

      img {
        width: 40%;
        height: 40%;
        object-fit: contain;
      }
    }
  }

  .pause-button {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    cursor: pointer;
    z-index: 1;
    transition: opacity 0.3s ease;

    img {
      width: 40%;
      height: 40%;
      object-fit: contain;
    }
  }

  .loading-spinner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 2;

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 