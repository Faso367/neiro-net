<template>
  <div :class="['message-row', sender === 'client' ? 'received' : 'sent']">
    <div class="sender-label">{{ sender === 'client' ? 'Клиент' : 'Вы' }}</div>
    <div
      class="message-bubble"
      :class="{
        'client-bubble': sender === 'client',
        'user-bubble': sender === 'user',
        'loading': loading
      }"
    >
      <template v-if="!loading">
        <span>{{ text }}</span>
      </template>
      <template v-else>
        <v-progress-circular indeterminate size="18" width="2" color="white" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sender: 'client' | 'user';
  text?: string;
  loading?: boolean;
}>();
</script>

<style scoped>
.message-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.message-row.sent {
  align-items: flex-end;
}
.message-row.received {
  align-items: flex-start;
}

.sender-label {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 4px;
}

.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 16px;
  word-break: break-word;
  display: inline-block;
}

.client-bubble {
  background: linear-gradient(90deg, #3B0D0D, #FF8731);
  color: white;
}

.user-bubble {
  background: #f4f4f4;
  color: #000;
  border: 1px solid #ddd;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  min-width: 40px;
}
</style>
