<template>
  <div class="loading-mask" v-show="show">
    <div class="loading-content">
      <LottieLoading />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import LottieLoading from './LottieLoading.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  mask: {
    type: Boolean,
    default: true
  }
})

const show = ref(props.show)

watch(() => props.show, (newVal) => {
  show.value = newVal
})
</script>

<style lang="less" scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style> 