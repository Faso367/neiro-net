<template>
  <v-card class="module-card mb-2" outlined @click="$emit('click')">
    <div class="d-flex justify-space-between align-center module-card-inner">
      <div class="module-card-text">
        <div class="module-title">{{ title }}</div>
        <div class="module-desc">{{ desc }}</div>
      </div>
      <v-icon class="module-arrow">mdi-arrow-top-right</v-icon>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{ title: string; desc: string }>()
</script>

<style scoped>
.module-card {
    display: flex;
    width: 100%;
    padding: 8px;
    justify-content: space-between;
    align-items: center;
    border-radius: 14px;
    background: var(--shades-white, #FFF);
    position: relative;
}
.module-card-inner {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
.module-card-text {
  flex: 1 1 auto;
  padding-right: 32px;
}
.module-arrow {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.4rem;
  color: #444;
}
.module-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #444;
}
.module-desc {
  font-size: 0.95rem;
  color: #888;
}
</style> 