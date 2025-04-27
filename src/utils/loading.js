import { createApp, ref } from 'vue'
import Loading from '@/components/Loading.vue'

let loadingInstance = null
let loadingApp = null

const showLoading = (options = {}) => {
  if (loadingInstance) {
    loadingInstance.show = true
    loadingInstance.text = options.text || '加载中...'
    return
  }

  const loadingRef = ref({
    show: true,
    text: options.text || '加载中...',
    mask: options.mask !== false
  })

  loadingApp = createApp(Loading, {
    show: loadingRef.value.show,
    text: loadingRef.value.text,
    mask: loadingRef.value.mask
  })

  const loadingEl = document.createElement('div')
  document.body.appendChild(loadingEl)
  loadingInstance = loadingApp.mount(loadingEl)
}

const hideLoading = () => {
  if (loadingInstance) {
    loadingInstance.show = false
    setTimeout(() => {
      if (loadingApp) {
        loadingApp.unmount()
        loadingApp = null
        loadingInstance = null
      }
    }, 300)
  }
}

export { showLoading, hideLoading } 