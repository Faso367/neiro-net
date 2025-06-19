<template>
  <div v-if="ready" class="page-wrapper">
    <component
      :is="currentComponent"
      v-bind="componentProps"
      @start="onStart"
      @module="onModule"
      @back="onBack"
      @random="onRandom"
      @select="onSelect"
      @ready="onReady"
      @knowledge="onKnowledge"
    >
      {{ authenticated ? '' : 'Не авторизован' }}
    </component>
  </div>
  <div v-else>
    <p>Загрузка Keycloak...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import StartScreen from '~/components/StartScreen.vue'
import ModuleScreen from '~/components/ModuleScreen.vue'
import ReadyScreen from '~/components/ReadyScreen.vue'
import ChatWrapper from '~/components/ChatWrapper.vue'
import KnowledgeBase from '~/components/KnowledgeBase.vue'

const { $keycloak, $keycloakReady, $keycloakAuthenticated } = useNuxtApp()

const ready = ref(false)
const authenticated = ref(false)
const stage = ref<'start' | 'module' | 'ready' | 'chat' | 'knowledge'>('start')
const selectedModule = ref<number|null>(null)
const selectedElement = ref<number|null>(null)

const modules = [
  { id: 1, title: 'Модуль 1', desc: 'Простая продажа', info: 'Не сложные ситуации, с которыми ты сталкиваешься каждый день', items: ['Список покупок', 'Покупка лопаты', 'Бабушка и оградка', 'Нет нужного товара', 'Выравнивание стен'] },
  { id: 2, title: 'Модуль 2', desc: 'Выявление потребностей', info: 'Клиент не знает чего хочет', items: ['Покраска пола на веранде', 'Гипсокартон для домашней студии', 'Кровля для беседки', 'Шумит труба'] },
  { id: 3, title: 'Модуль 3', desc: 'Работа с возражениями', info: 'Не все пройдет гладко с первого раза, удачи!', items: ['Дорогая краска для перекраски фиолетовой стены', 'Краска для дома — что выбрать?', 'В Леруа дешевле ротбанд', '"Хочу подешевле"', 'Смеситель — силумин или латунь?', '«Кнауф лучше» — бренд или металл?', 'Ребрендинг товара'] },
  { id: 4, title: 'Модуль 4', desc: 'Сложный клиент', info: 'Умение находить подход ко всем', items: ['Мокрый керамзит', '«Вы испортили мне краску!»'] },
]

watchEffect(() => {
  if ($keycloakReady) {
    ready.value = true
    authenticated.value = $keycloakAuthenticated
  }
})

function onStart() {
  stage.value = 'start'
  selectedModule.value = null
  selectedElement.value = null
}

function onModule(id: number) {
  selectedModule.value = id
  stage.value = 'module'
  selectedElement.value = null
}

function onBack() {
  if (stage.value === 'chat') {
    stage.value = 'ready'
  } else if (stage.value === 'ready') {
    stage.value = 'module'
    selectedElement.value = null
  } else if (stage.value === 'knowledge') {
    stage.value = 'start'
  } else {
    stage.value = 'start'
    selectedModule.value = null
    selectedElement.value = null
  }
}

function onSelect(elementIdx: number) {
  selectedElement.value = elementIdx
  stage.value = 'ready'
}

function onRandom() {
  const mod = modules.find(m => m.id === selectedModule.value)
  if (!mod) return
  const idx = Math.floor(Math.random() * mod.items.length)
  selectedElement.value = idx
  stage.value = 'ready'
}

function onReady() {
  stage.value = 'chat'
}

function onKnowledge() {
  stage.value = 'knowledge'
}

const currentComponent = computed(() => {
  if (!authenticated.value) return 'p'
  if (stage.value === 'start') return StartScreen
  if (stage.value === 'module') return ModuleScreen
  if (stage.value === 'ready') return ReadyScreen
  if (stage.value === 'chat') return ChatWrapper
  if (stage.value === 'knowledge') return KnowledgeBase
  return 'div'
})

const componentProps = computed(() => {
  if (stage.value === 'module') {
    const mod = modules.find(m => m.id === selectedModule.value) || modules[0]
    return {
      moduleId: mod.id,
      moduleTitle: mod.title,
      moduleDesc: mod.desc,
      moduleInfo: mod.info,
      moduleItems: mod.items,
      onBack,
      onRandom,
      onSelect,
    }
  }
  if (stage.value === 'ready') {
    const mod = modules.find(m => m.id === selectedModule.value) || modules[0]
    const elIdx = selectedElement.value ?? 0
    return {
      moduleId: mod.id,
      moduleTitle: mod.title,
      elementId: elIdx,
      elementTitle: mod.items[elIdx],
      onBack,
      onReady,
    }
  }
  if (stage.value === 'chat') {
    const mod = modules.find(m => m.id === selectedModule.value) || modules[0]
    const elIdx = selectedElement.value ?? 0
    return {
      moduleId: mod.id,
      elementId: elIdx,
      onBack,
    }
  }
  if (stage.value === 'knowledge') {
    return {
      onBack,
    }
  }
  return {}
})
</script>

<style scoped>
.page-wrapper {
  margin: 2vh 2vw;
  height: 96vh;
  width: 96vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
}
</style>