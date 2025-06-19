<template>
  <div class="header-bar">
    <div class="d-flex align-center">
      <v-btn icon color="black" variant="tonal" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <span class="user-name">{{ userName }}</span>
    </div>
    <v-chip class="chiriks-chip" small>
      {{ chiriks }} чириков
    </v-chip>
  </div>
</template>

<script setup lang="ts">
defineProps<{ userName: string; chiriks: number }>()

const { $keycloak } = useNuxtApp()

function logout() {
  $keycloak.logout()
}

</script>

<style scoped>
.header-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 13px;
  align-self: stretch;
  border-radius: 12px;
}
.user-name {
  font-size: 1rem;
  color: #222;
  padding-left: 1vh;
}
.chiriks-chip {
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 0 10px;
  background-color: #212121;
  color: #fff;
}
</style> 