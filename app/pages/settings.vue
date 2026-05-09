<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const open = ref(true)

const items: NavigationMenuItem[] = [
  {
    label: 'Public profile',
    icon: 'i-lucide-user',
    to: '/settings',
    exact: true
  },
  {
    label: 'Account security',
    icon: 'i-lucide-lock',
    to: '/settings/account'
  },
  {
    label: 'Preferences',
    icon: 'i-lucide-settings',
    to: '/settings/preferences'
  },
  {
    label: 'Delete account',
    icon: 'i-lucide-trash',
    to: '/settings/delete'
  }
]
</script>

<template>
  <div class="flex flex-col gap-10 md:flex-row">
    <aside class="shrink-0">
      <div class="mb-6 px-2">
        <h1 class="text-2xl font-bold">Settings</h1>
      </div>

      <UNavigationMenu
        :items="items"
        orientation="vertical"
      />
    </aside>

    <div>
      <NuxtPage />
    </div>
  </div>
</template>
