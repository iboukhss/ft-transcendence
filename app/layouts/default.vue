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
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings'
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

// NOTE(isma): I wasted 2 hours on this -_-
const { data: profile, pending, error } = await useFetch('/api/profile', {
  watch: [loggedIn]
})

const userDisplayName = computed(() => {
  if (!profile.value) {
    return ''
  }

  return profile.value.type === 'freelancer'
    ? profile.value.firstName
    : profile.value.contactFirstName
})

const userAvatarUrl = computed(() => {
  if (!profile.value) {
    return undefined
  }

  return profile.value.type === 'freelancer'
    ? profile.value.avatar
    : profile.value.logo
})

const logout = async () => {
  await clear()
  await navigateTo('/')
}
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <span class="text-2xl font-bold tracking-tight">LuxLink</span>
        </NuxtLink>
      </template>

      <UNavigationMenu :items="items" />

      <template #right>
        <div class="flex items-center gap-4">
          <template v-if="loggedIn">
            <UButton
              v-if="user?.accountType === 'company'"
              label="Post a job offer"
              to="/jobs/create"
              variant="subtle"
              color="primary"
            />

            <UDropdownMenu :items="userMenuItems">
              <UButton variant="ghost" color="neutral">
                <UAvatar
                  :src="userAvatarUrl || ''"
                  :alt="userDisplayName"
                />
                <span>{{ userDisplayName }}</span>
              </UButton>
            </UDropdownMenu>
          </template>

          <template v-else>
            <UButton label="Log in" to="/login" variant="ghost" color="neutral" />
            <UButton label="Join now" to="/register" color="primary" />
          </template>

          <UColorModeButton />
        </div>
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <slot />
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        <span class="text-muted text-sm">© 2026 42 Luxembourg students</span>
      </template>

      <template #right>
        <div class="text-muted flex gap-6 text-sm">
          <ULink to="/terms">Terms of service</ULink>
          <ULink to="/privacy">Privacy policy</ULink>
        </div>
      </template>
    </UFooter>
  </div>
</template>
