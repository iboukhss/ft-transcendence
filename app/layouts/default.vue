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

const { loggedIn, user, clear, fetch } = useUserSession()

const router = useRouter()
router.afterEach(async () => {
  if (loggedIn.value) await fetch()
})

const userDisplayName = computed(() => {
  if (!user.value) return ''

  return user.value.firstName
})

const userAvatarUrl = computed(() => {
  if (!user.value) return undefined

  return user.value.avatarUrl ?? undefined
})

const logout = async () => {
  await clear()
  await navigateTo('/')
}

const userMenuItems = computed<DropdownMenuItem[][]>(() => {
  if (!loggedIn.value || !user.value) {
    return []
  }

  const groups: DropdownMenuItem[][] = []

  groups.push([
    {
      label: `${user.value.firstName} ${user.value.lastName}`,
      avatar: {
        src: user.value.avatarUrl ?? undefined,
        alt: user.value.firstName
      },
      type: 'label'
    }
  ])

  if (user.value.role === 'admin') {
    groups.push([
      {
        label: 'Admin panel',
        icon: 'i-lucide-shield',
        color: 'error',
        to: '/admin'
      }
    ])
  }

  groups.push([
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
  ])

  groups.push([
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      onSelect: logout
    }
  ])

  return groups
})
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

      <template #panel>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="p-4"
        />
      </template>

      <template #right>
        <div class="flex items-center gap-4">
          <template v-if="loggedIn && user">
            <UButton
              v-if="user.accountType === 'company'"
              label="Post a job offer"
              to="/jobs/create"
              variant="subtle"
              color="primary"
            />

            <UDropdownMenu :items="userMenuItems">
              <UButton variant="ghost" color="neutral">
                <UAvatar
                  :src="userAvatarUrl"
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
