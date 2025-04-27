<template>
  <div class="lottie-loading" ref="lottieContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import loadingJson from '@/assets/loading1.json'

const lottieContainer = ref(null)
let animation = null

onMounted(() => {
  if (lottieContainer.value) {
    animation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: loadingJson,
      background: 'transparent'
    })
  }
})

onUnmounted(() => {
  if (animation) {
    animation.destroy()
  }
})
</script>

<style lang="less" scoped>
.lottie-loading {
  width: 7rem;
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}
</style> 