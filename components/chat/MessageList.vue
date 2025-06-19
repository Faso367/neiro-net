<template>
  <div class="messages-container">
    <MessageItem
      v-for="(msg, i) in messages"
      :key="i"
      :sender="msg.sender"
      :text="msg.text"
      :loading="msg.loading"
    />
  </div>
</template>

<script setup lang="ts">
import MessageItem from './MessageItem.vue';

defineProps<{
  messages: { sender: 'client' | 'user'; text?: string; loading?: boolean }[];
}>();
</script>

<style scoped>
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
</style>
