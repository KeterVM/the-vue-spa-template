import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { PiniaColada } from '@pinia/colada'
import { i18n, detectLocale, switchLocale } from './plugins/i18n'
import { createHead } from '@unhead/vue/client'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PiniaColada)
app.use(i18n)
app.use(createHead())

// initialize locale before mount
const initial = detectLocale()
await switchLocale(i18n, initial)

app.mount('#app')
