<template>
  <!-- Оборачиваем всю страницу в VApp для корректного рендеринга Vuetify-компонентов -->
  <v-app>
    <NuxtPage />
  </v-app>
</template>
<style>
.v-btn.app-btn {
  height: 100% !important;
  width: 75% !important;
  padding: 0 20px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  border-radius: 12px !important;
  background: #000 !important;
  color: #fff !important;
  box-sizing: border-box;
}

.v-btn.app-arrow {
  height: 100% !important;
  width: 20% !important;
  padding: 0 20px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  border-radius: 12px !important;
  background: #000 !important;
  color: #fff !important;
  box-sizing: border-box;
}

.bottom-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
  height: 12vh;
  align-self: flex-end;
}
</style>