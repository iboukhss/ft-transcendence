<script setup lang="ts">
import type { ProfileDTO } from '#shared/dto/profile.dto'

import { COUNTRY_LABELS } from '~/utils/labels'

defineProps<{
  profile: Extract<ProfileDTO, { type: 'company' }>
  isOwnProfile?: boolean
}>()
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-start justify-between ">
      <div class="flex items-center gap-6">
        <UAvatar
          :src="profile.logo ?? undefined"
          :alt="profile.contactFirstName"
          :chip="{
            inset: true,
            position: 'top-left'
          }"
          size="4xl"
        />

        <div class="flex flex-col">
          <h1 class="text-3xl font-bold">
            {{ profile.companyName }}
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
        label="Edit profile"
        variant="subtle"
        color="neutral"
      />
    </div>

    <USeparator />

    <slot name="about">
      <section>
        <h2 class="text-xl font-semibold">About</h2>
        <p class="leading-relaxed whitespace-pre-line">
          {{ profile.description || 'No description provided yet.' }}
        </p>
      </section>
    </slot>
  </div>
</template>
