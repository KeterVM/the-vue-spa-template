<script setup lang="ts">

import { useHead } from '@unhead/vue'
import { getLocale } from './plugins/i18n'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
useHead({
  title: 'The Vue SPA Template',
  htmlAttrs: {
    lang: () => getLocale(),
  },
})

onMounted(() => {
  console.log('App')
})
</script>

<template>
  <VueQueryDevtools />
  <RouterView />
</template>

<style scoped></style>
