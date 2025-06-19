<template>
  <div class="ready-screen">
    <div class="ready-header">
      <div class="module-title">{{ moduleTitle }}</div>
      <div class="element-title">{{ elementTitle }}</div>
    </div>
    <div class="ready-center">
      <img src="/images/nonTalkingStarling.gif" alt="Готов?" class="intro-face" />
      <div class="ready-text">Готов?</div>
    </div>
    <div class="bottom-buttons">
      <v-btn class="app-arrow" @click="emit('back')" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-btn class="app-btn" @click="emit('ready')">Начать</v-btn> 
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['back', 'ready'])
const props = defineProps<{
  moduleTitle: string
  elementTitle: string
}>()
</script>

<style scoped>
.ready-screen {
  height: 96vh;
  width: 96vw;
  padding: 0 12px 16px 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.ready-header {
  margin-top: 12px;
  margin-bottom: 24px;
}
.module-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #222;
}
.element-title {
  font-size: 1rem;
  color: #888;
}
.ready-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.intro-face {
  width: 100px;
  margin-bottom: 12px;
}
.ready-text {
  font-size: 2rem;
  font-weight: 500;
  color: #222;
}
</style> 