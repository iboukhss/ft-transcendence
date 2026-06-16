<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Find talents',
    to: '/public/profiles',
    icon: 'i-lucide-search'
  },
  {
    label: 'Find work',
    to: '/public/jobs',
    icon: 'i-lucide-briefcase'
  }
])

const { loggedIn, user, clear } = useUserSession()

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

  const groups: DropdownMenuItem[][] = [
    [
      {
        label: `${user.value.firstName} ${user.value.lastName}`,
        avatar: {
          src: user.value.avatarUrl ?? undefined,
          alt: user.value.firstName
        },
        type: 'label'
      }
    ]
  ]

  if (user.value.role === 'admin') {
    groups.push([
      {
        label: 'Admin panel',
        icon: 'i-lucide-shield-alert',
        color: 'error',
        to: '/admin'
      }
    ])
  }

  const navigationGroup: DropdownMenuItem[] = [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/me'
    }
  ]

  if (user.value.accountType === 'freelancer') {
    navigationGroup.push({
      label: 'Sent applications',
      icon: 'i-lucide-send',
      to: '/freelancer/offers'
    },
    {
      label: 'My contracts',
      icon: 'i-lucide-briefcase',
      to: '/freelancer/bookings'
    })
  }
  else {
    navigationGroup.push({
      label: 'Job postings',
      icon: 'i-lucide-layers',
      to: '/company/jobs'
    },
    {
      label: 'Incoming offers',
      icon: 'i-lucide-inbox',
      to: '/company/offers'
    },
    {
      label: 'Active contracts',
      icon: 'i-lucide-handshake',
      to: '/company/bookings'
    })
  }

  navigationGroup.push(
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: '/settings'
    }
  )

  groups.push(navigationGroup)

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

      <template #right>
        <div class="flex items-center gap-4">
          <template v-if="loggedIn && user">
            <UButton
              v-if="user.accountType === 'company'"
              label="Post a job"
              to="/company/jobs/create"
              icon="i-lucide-plus"
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
