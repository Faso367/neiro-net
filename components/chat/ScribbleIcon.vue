<template>
  <img
    src="/images/intro-face.png"
    alt="icon"
    :class="['scribble-icon', { recording }]"
  />
</template>

<script setup lang="ts">
defineProps<{ recording: boolean }>();
</script>

<style scoped>
.scribble-icon {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 80px;
}
.scribble-icon.recording {
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
