import { createApp } from 'vue'
import App from './App.vue'

function updateVhUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', updateVhUnit);
updateVhUnit();

createApp(App).mount('#app')