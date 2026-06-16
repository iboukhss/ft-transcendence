<script setup lang="ts">
import type { JobDTO } from '#shared/dto/job.dto'

import { JOB_CATEGORY_LABELS, SKILL_LABELS, WORKPLACE_LABELS, COUNTRY_LABELS } from '~/utils/labels'

const route = useRoute()
const jobId = route.params.id

const { data: job } = useFetch(`/api/jobs/public/${jobId}`)
</script>

<template>
  <UPage v-if="job">
    <UPageHeader :title="job.title">
      <template #headline>
        <div class="flex items-center gap-3">
          <UBadge variant="subtle" color="primary">
            {{ WORKPLACE_LABELS[job.workplace] }}
          </UBadge>
          <span class="text-muted flex items-center gap-1">
            <UIcon name="i-lucide-calendar" class="h-3 w-3" />
            Posted <LLDate :date="job.createdAt" />
          </span>
        </div>
      </template>

      <template #description>
        <div class="space-y-4">
          <p class="text-lg">{{ JOB_CATEGORY_LABELS[job.category] }}</p>

          <div class=" flex gap-x-6 gap-y-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-banknote" class="text-muted h-4 w-4" />
              <span class="text-sm font-medium">{{ job.hourlyRate }}€ / hour</span>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="text-muted h-4 w-4" />
              <span class="text-sm font-medium">{{ COUNTRY_LABELS[job.location] }}</span>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-timer" class="text-muted h-4 w-4" />
              <span class="text-sm font-medium">{{ job.duration }} months</span>
            </div>
          </div>
        </div>
      </template>

      <template #links>
        <UButton
          label="Apply for this job"
          icon="i-lucide-send"
          :to="`/freelancer/jobs/${jobId}/apply`"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <div class="space-y-12">
        <section>
          <h3 class="text-xl font-bold">Job description</h3>
          <p class="leading-relaxed">{{ job.description }}</p>
        </section>

        <section class="space-y-4">
          <h3 class="text-xl font-bold">Required skills</h3>
          <div class="flex gap-2">
            <UBadge
              v-for="skill in job.skills"
              :key="skill"
              variant="soft"
              color="secondary"
              size="lg"
            >
              {{ SKILL_LABELS[skill] }}
            </UBadge>
          </div>
        </section>
      </div>
    </UPageBody>
  </UPage>
</template>
