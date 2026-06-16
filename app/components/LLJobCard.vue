<script setup lang="ts">
import type { JobDTO } from '#shared/dto/job.dto'

import { WORKPLACE_LABELS, JOB_CATEGORY_LABELS, SKILL_LABELS, COUNTRY_LABELS } from '~/utils/labels'

defineProps<{ job: JobDTO }>()
</script>

<template>
  <UCard
    class="hover:ring-primary-500 cursor-pointer transition-all hover:ring-2"
    @click="navigateTo(`/public/jobs/${job.id}`)"
  >
    <div class="flex items-start justify-between">
      <div class="space-y-3">
        <div>
          <h2 class="text-xl font-bold">{{ job.title }}</h2>
          <div class="text-muted flex items-center gap-1 text-sm">
            <UIcon name="i-lucide-map-pin" class="h-4 w-4" />
            <span>{{ COUNTRY_LABELS[job.location] }}</span>
          </div>
          <p class="text-sm">{{ job.description }}</p>
        </div>

        <div class="flex gap-2">
          <UBadge variant="subtle">{{ WORKPLACE_LABELS[job.workplace] }}</UBadge>
          <UBadge variant="subtle" color="neutral">{{ JOB_CATEGORY_LABELS[job.category] }}</UBadge>
        </div>

        <div class="flex gap-1">
          <UBadge
            v-for="skill in job.skills"
            :key="skill"
            variant="soft"
            color="secondary"
          >
            {{ SKILL_LABELS[skill] }}
          </UBadge>
        </div>
      </div>

      <div class="text-right">
        <div>{{ job.hourlyRate }}€</div>
        <div>per hour</div>
      </div>
    </div>
  </UCard>
</template>
