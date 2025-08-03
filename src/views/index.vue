<script setup lang="ts">
import { useTypedI18n } from '@/composables/useTypedI18n'

const { t } = useTypedI18n()

onMounted(() => {
  console.log('Index')
})
</script>

<template>
  <div>Index</div>
  <p>{{ t('hello') }}</p>
</template>

<style scoped></style>
