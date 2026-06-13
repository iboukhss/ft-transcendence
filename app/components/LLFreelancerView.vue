<script setup lang="ts">
import { computed } from 'vue'

import type { ProfileDTO } from '#shared/dto/profile.dto'

import { usePresence } from '~/composables/usePresence'
import { COUNTRY_LABELS } from '~/utils/labels'

const props = defineProps<{
  profile: Extract<ProfileDTO, { type: 'freelancer' }>
  isOwnProfile?: boolean
}>()

// 1. Grab the dynamic check function from your updated usePresence composable
const { isOnline } = usePresence()

// 2. Bind it to a reactive computed property.
// Because the underlying global Set is replaced on socket events, Vue tracks this dependencies chain perfectly!
const freelancerIsConnected = computed(() => isOnline(props.profile.userId))
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-6">
        <UAvatar
          :src="profile.avatar ?? undefined"
          :chip="{
            inset: true,
            position: 'top-left',
            color: freelancerIsConnected ? 'success' : 'neutral',
            size: 'md'
          }"
          :alt="profile.firstName"
          size="4xl"
        />

        <div class="flex flex-col">
          <h1 class="text-3xl font-bold">
            {{ profile.firstName }} {{ profile.lastName }}
          </h1>

          <div class="text-muted mt-1 flex flex-col text-sm">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-map-pin" />
              <span>{{ COUNTRY_LABELS[profile.country] }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-clock" />
              <span>10:42 AM local time</span>
            </div>
          </div>
        </div>
      </div>

      <UButton
        v-if="isOwnProfile"
        to="/settings"
        label="Edit profile settings"
        variant="subtle"
        color="neutral"
      />
    </div>

    <USeparator />

    <slot name="about">
      <section>
        <h2 class="text-xl font-semibold">About</h2>
        <p class="leading-relaxed whitespace-pre-line">
          {{ profile.bio || 'No bio provided yet.' }}
        </p>
      </section>
    </slot>

    <USeparator />

    <slot name="skills">
      <section>
        <h2 class="text-xl font-semibold">Skills</h2>
        <p v-if="profile.skills.length">{{ profile.skills.join(', ') }}</p>
        <p v-else>No skills provided yet.</p>
      </section>
    </slot>

    <USeparator />

    <slot name="languages">
      <section>
        <h2 class="text-xl font-semibold">Languages</h2>
        <p v-if="profile.languages.length">{{ profile.languages.join(', ') }}</p>
        <p v-else>No languages provided yet.</p>
      </section>
    </slot>
  </div>
</template>
