<template>
  <div class="bottom-buttons">
    <v-btn class="app-arrow" @click="emit('back')" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
    <v-btn class="app-btn" @click="emit('toggle')">{{ recording ? 'Пауза' : 'Возобновить' }}</v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{ recording: boolean; volume: number }>();
defineEmits(['toggle', 'back']);
</script>