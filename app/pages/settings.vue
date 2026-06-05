<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [
  [
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
    }
  ], [
    { label: 'Request data',
      icon: 'i-lucide-download',
      to: '/settings/data-request'
    },
    {
      label: 'Delete account',
      icon: 'i-lucide-trash',
      to: '/settings/delete'
    }
  ]
]
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <div class="mb-6 px-2">
          <h1 class="text-2xl font-bold">Settings</h1>
        </div>

        <UNavigationMenu
          :items="items"
          orientation="vertical"

          class="w-full"
        />
      </UPageAside>
    </template>

    <NuxtPage />
  </UPage>
</template>
