import './assets/main.css'
import { VueQueryPlugin } from '@tanstack/vue-query'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './plugins/i18n'
import { createHead } from '@unhead/vue/client'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(createHead())
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: 0, // disable retry by default
      },
    },
  },
})

app.mount('#app')
