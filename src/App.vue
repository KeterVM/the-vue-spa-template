<script setup lang="ts">
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import { useHead } from '@unhead/vue'
import { i18n, getLocale } from './plugins/i18n'

useHead({
  title: 'The Vue SPA Template',
  htmlAttrs: {
    lang: () => getLocale(i18n),
  },
})
</script>

<template>
  <PiniaColadaDevtools />
  <RouterView />
</template>

<style scoped></style>
