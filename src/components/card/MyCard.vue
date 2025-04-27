<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>

<template>
  <div>
    卡片
    图片
    <t-image
        class="image-container"
        fit="fill"
        src="https://picsum.photos/200/100"
    ></t-image>
    视频

  </div>
</template>

<style scoped>

</style>
