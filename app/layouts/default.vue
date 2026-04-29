<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Find talents',
    to: '/profiles'
  },
  {
    label: 'Find work',
    to: '/jobs'
  }
])

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'My account',
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile'
    },
    {
      label: 'My jobs',
      icon: 'i-lucide-briefcase',
      to: '/my-jobs'
    }
  ],
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: logout
    }
  ]
])

const { loggedIn, user, clear } = useUserSession()

const logout = async () => {
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <UApp>
    <UHeader title="LuxLink">
      <template #left>
        <NuxtLink to="/">
          <span class="text-2xl font-bold">LuxLink</span>
        </NuxtLink>
      </template>

      <UNavigationMenu :items="items" />

      <template #right>
        <div class="flex items-center gap-4">
          <template v-if="loggedIn">
            <UButton label="Post a job offer" to="/jobs/create" color="primary" variant="subtle" />

            <UDropdownMenu :items="userMenuItems">
              <UButton
                color="neutral"
                icon="i-lucide-user-circle"
                variant="ghost"
                :label="user?.email"
              />
            </UDropdownMenu>
          </template>

          <template v-else>
            <UButton label="Log in" to="/login" color="neutral" variant="ghost" />
            <UButton label="Join now" to="/register" color="primary" />
          </template>

          <UColorModeButton />
        </div>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <span class="text-sm text-muted">© 2026 42 Luxembourg Students</span>
      </template>
    </UFooter>
  </UApp>
</template>
