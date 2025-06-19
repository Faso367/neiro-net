<template>
  <div v-if="loading" class="loading-screen">
    Загрузка...
  </div>
  <div v-else class="start-screen">
    <!-- Верхняя панель -->
    <HeaderBar :userName="userName" :chiriks="chiriks" />
    <!-- Приветствие и картинка -->
    <div class="text-center">
      <TalkingStarling сlass="intro-face" /> 
      <div class="greeting-title">Привет, {{ firstName }}!</div>
      <div class="greeting-subtitle">Что пройдём сегодня?</div>
    </div>
    <!-- Модули -->
    <div class="modules-list">
      <ModuleCard
        v-for="mod in modules"
        :key="mod.id"
        :title="mod.title"
        :desc="mod.desc"
        @click="goToModule(mod.id)"
      />
    </div>
    <!-- Нижние кнопки -->
    <div class="bottom-buttons">
      <v-card class="bottom-card" outlined @click="emit('knowledge')">
        <div class="bottom-title">База знаний</div>
        <div class="bottom-desc">Собрали полезную информацию о продажах</div>
        <v-icon class="bottom-arrow">mdi-arrow-right</v-icon>
      </v-card>
      <v-card class="bottom-card" outlined @click="emit('case')">
        <div class="bottom-title">Предложить кейс</div>
        <div class="bottom-desc">Поделись историей интересной продажи</div>
        <v-icon class="bottom-arrow">mdi-arrow-right</v-icon>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">

const firstName = useState('firstName')
const lastName = useState('lastName')
const chiriks = ref(0)
const loading = ref(true)
const userName = `${lastName.value} ${firstName.value.charAt(0)}.`

import ModuleCard from './ModuleCard.vue'

const emit = defineEmits(['module'])
const { $keycloak } = useNuxtApp()

const modules = ref([
  { id: 1, title: 'Модуль 1', desc: 'Простая продажа' },
  { id: 2, title: 'Модуль 2', desc: 'Выявление потребностей' },
  { id: 3, title: 'Модуль 3', desc: 'Работа с возражениями' },
  { id: 4, title: 'Модуль 4', desc: 'Сложный клиент' }
])

function goToModule(id: number) {
  emit('module', id)
}

onMounted(async () => {
  await waitForKeycloak()

  const getModulesCategory = async () => {
    try {
      const response = await $fetch(`http://89.169.178.112:8090/api/v1/category`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${$keycloak.token}`
        }
      })

      console.log('[voice-core] Category fetched:', response)

      const items = response?.data?.items || []
      modules.value = items.map((item: any) => ({
        id: item.id,
        title: item.title,
        desc: item.description
      }))

      loading.value = false
    } catch (error) {
      console.error('[voice-core] Error fetching category:', error)
      loading.value = false
    }
  }

  const getUserInfo = async () => {
    try {
      const response = await $fetch(`http://89.169.178.112:8090/api/v1/user/info`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${$keycloak.token}`
        }
      })

      console.log('[voice-core] User fetched:', response)

      const score = response?.data.score
      chiriks.value = score
    } catch (error) {
      console.error('[voice-core] Error fetching category:', error)
      loading.value = false
    }
  }

  getUserInfo()
  getModulesCategory()
})

async function waitForKeycloak() {
  console.log('[voice-core] waitForKeycloak...')
  while (!$keycloak?.token) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  console.log('[voice-core] keycloak ready:', $keycloak.token)
}
</script>

<style>
html, body, #__nuxt, #app, .v-application, .v-main {
  height: 100%;
  margin: 0;
  padding: 0;
  background-image: url('/images/background-app.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.start-screen {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.user-name {
  font-size: 1rem;
  color: #222;
}
.chiriks-chip {
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 0 10px;
}
.intro-face {
  width: 80px;
  margin-bottom: 8px;
}
.greeting-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #444;
}
.greeting-subtitle {
  font-size: 1.1rem;
  color: #888;
  margin-top: 2px;
}
.modules-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
  padding: 4px;
  height: 36vh;
  overflow-y: auto;
  margin-bottom: 2vh;
  margin: 4vh 0 0 0
}

.module-card {
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
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
/*
.bottom-buttons {
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 1vh;
}*/
.bottom-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1 0 0;
  border-radius: 20px;
  background: #FFF;
  min-height: 16vh;
  box-shadow: 0 2px 12px 0 #e6e6e6;
  padding: 2vh 2vw;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.18s;
}

.bottom-title {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  padding-right: 28px;
}
.bottom-desc {
  font-size: 1.02rem;
  color: #888;
  margin-bottom: 12px;
  padding-right: 2vw;
}
.bottom-arrow {
  position: absolute;
  right: 14px;
  bottom: 18px;
  color: #bbb;
  font-size: 1.2rem;
}
/*@media (max-width: 600px) {
  .start-screen { padding: 0 2px 8px 2px; }
  .bottom-card { min-height: 80px; padding: 8px 4px 6px 8px; }
  .intro-face { width: 64px; }
}*/
</style>