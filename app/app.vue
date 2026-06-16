<script setup lang="ts">
import { usePresence } from '~/composables/usePresence'

usePresence()
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
