<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const links = ref<ButtonProps[]>([
  {
    label: 'Hire top talents',
    to: 'public/profiles'
  },
  {
    label: 'Apply as a freelancer',
    to: 'public/jobs',
    variant: 'subtle'
  }
])
</script>

<template>
  <UPageHero
    title="Connect with Talents Across the Greater Region"
    description="Get access to the biggest talent pool from the Greater Region in Luxembourg, France, Belgium and Germany."
    orientation="horizontal"
    :links="links"
  >
    <div class="relative">
      <div class="bg-primary-500/20 absolute -inset-4 rounded-full blur-3xl" />
      <img
        src="/freelancer-office-stock.jpg"
        class="relative rounded-xl border border-neutral-200 shadow-xl dark:border-neutral-800"
      >
    </div>
  </UPageHero>
</template>
