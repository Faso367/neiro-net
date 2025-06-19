import { ref } from 'vue'
import Keycloak from 'keycloak-js'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()

  const keycloak = new Keycloak({
    url: config.public.keycloakUrl,
    realm: config.public.keycloakRealm,
    clientId: config.public.keycloakClientId,
  })

  const keycloakReady = ref(false)
  const keycloakAuthenticated = ref(false)

  // Глобальные useState
  const firstName = useState('firstName', () => '')
  const lastName = useState('lastName', () => '')
  const profileLoaded = useState('profileLoaded', () => false)

  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
    })

    console.log('Keycloak инициализирован. Пользователь авторизован?', authenticated)

    if (authenticated) {
      const profile = await keycloak.loadUserProfile()

      console.log('User profile:', profile)

      firstName.value = profile.firstName || ''
      lastName.value = profile.lastName || ''
      profileLoaded.value = true

      keycloakAuthenticated.value = true
    }
  } catch (err) {
    console.error('Ошибка инициализации Keycloak', err)
  }

  keycloakReady.value = true

  nuxtApp.provide('keycloak', keycloak)
  nuxtApp.provide('keycloakReady', keycloakReady)
  nuxtApp.provide('keycloakAuthenticated', keycloakAuthenticated)
})