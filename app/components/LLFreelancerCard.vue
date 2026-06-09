<script setup lang="ts">
import type { FreelancerDTO } from '#shared/dto/profile.dto.js'

import { COUNTRY_LABELS, SKILL_LABELS } from '~/utils/labels'

defineProps<{
  profile: FreelancerDTO
}>()
</script>

<template>
  <UCard
    class="hover:ring-primary-500 w-full cursor-pointer transition-all hover:ring-2"
    @click="navigateTo(`/profiles/${profile.userId}`)"
  >
    <div class="space-y-2">
      <UUser
        :name="profile.firstName + ' ' + profile.lastName"
        :avatar="{
          src: profile.avatar ?? undefined }"
      >
        <template #name>
          <div class="text-base">{{ profile.firstName + ' ' + profile.lastName }}</div>
        </template>
        <template #description>
          <div class="text-muted flex items-center gap-1 text-sm">
            <UIcon name="i-lucide-map-pin" class="h-4 w-4" />
            <span>{{ COUNTRY_LABELS[profile.country] }}</span>
          </div>
        </template>
      </UUser>
      <div class="text-sm">
        {{ profile.bio }}
      </div>
      <div class="flex gap-1">
        <UBadge
          v-for="skill in profile.skills"
          :key="skill"
        >
          {{ SKILL_LABELS[skill] }}
        </UBadge>
      </div>
    </div>
  </UCard>
</template>
