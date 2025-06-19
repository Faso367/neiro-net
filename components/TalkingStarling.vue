<template>
  <div class="gif-container">
    <img :src="currentGif" alt="Чирикаем" class="gif-image" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const gifs = [
  '/talkingStarling.gif',
  '/nonTalkingStarling.gif'
];

const currentGif = ref(gifs[0]);

const delayMs = 1500; // 1.5 секунды

onMounted(() => {
  setTimeout(() => {
    currentGif.value = gifs[1];
  }, delayMs);
});
</script>

<style scoped>
.gif-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10vh 0 4vh;
}
.gif-image {
  display: block;
  width: 8.8vh;
  height: auto;
}
</style>
