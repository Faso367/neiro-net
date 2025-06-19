<template>
  <div class="module-screen">
    <div class="module-card-box">
      <div class="module-title">{{ moduleTitle }}</div>
      <div class="module-desc">{{ moduleDesc }}
        {{ moduleInfo }}</div>
      <div v-for="(item, idx) in (moduleItems && moduleItems.length ? moduleItems : modulesList)" :key="item" class="module-item" @click="emit('select', idx)">
        <span>{{ item }}</span>
        <v-icon>mdi-arrow-top-right</v-icon>
      </div>
    </div>
  </div>
  <div class="bottom-buttons d-flex justify-space-between">
    <v-btn class="app-arrow" @click="emit('back')" icon><v-icon>mdi-arrow-left</v-icon></v-btn>
    <v-btn class="app-btn" @click="emit('random')">Случайная тема</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits(['back', 'random', 'select'])
const { $keycloak } = useNuxtApp()

const props = defineProps<{
  moduleId: number
  moduleTitle: string
  moduleDesc: string
  moduleInfo: string
  moduleItems: string[]
}>()

const moduleData = ref<any[]>([])
const modulesList = ref<string[]>([])

onMounted(async () => {
  console.log(props)
  console.log($keycloak)

  const getModulesCategory = async () => {
    try {
      const response = await $fetch(`http://89.169.178.112:8090/api/v1/history-context?category.id=${props.moduleId}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${$keycloak.token}`
        }
      })

      console.log('[voice-core] Modules fetched:', response)

      moduleData.value = response.data.items
      modulesList.value = moduleData.value.map((item: any) => {
        return `${item.scoringPrompt}`
      })
    } catch (error) {
      console.error('[voice-core] Error fetching category:', error)
    }
  }

  await getModulesCategory()
})
</script>

<style scoped>
.ready-screen,
.module-screen {
  margin: 0 auto;
  width: 96vw;
  box-sizing: border-box;
  padding: 0 0 0 0; /* если нужно, можно добавить паддинги */
}
.module-card-box {
  background: #fff;
  border: 1.5px solid #ffe6a0;
  border-radius: 14px;
  margin-top: 12px;
  margin-bottom: 24px;
  padding: 16px 12px 12px 12px;
}
.module-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #757575;
}
.module-desc {
  font-size: 1rem;
  color: #444;
  padding-bottom: 1vh;
}
.module-info {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 10px;
}
.module-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  background: #fffbe6;
  border-radius: 10px;
  padding: 8px 12px;
  height: 9vh;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #444;
}
.app-btn {
  background: #000;
  color: #fff;
  border-radius: 12px;
}
</style>