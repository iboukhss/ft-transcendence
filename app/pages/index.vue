<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const links = ref<ButtonProps[]>([
  {
    label: 'Hire top talents',
    to: '/profiles'
  },
  {
    label: 'Apply as a freelancer',
    to: '/jobs',
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
    <img
      src="/freelancer-office-stock.jpg"
      class="rounded-xl shadow-xl"
    >
  </UPageHero>
</template>
