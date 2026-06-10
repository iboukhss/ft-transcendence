<script setup lang="ts">
import type { JobResponseDTO } from '#shared/dto/job.dto'

const { data: jobs } = await useFetch<JobResponseDTO[]>('/api/jobs/public')
const search = ref('')

const filteredJobs = computed(() => {
  if (!jobs.value) {
    return []
  }
  return jobs.value.filter(j =>
    j.title.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <h2 class="mb-4 text-sm font-semibold uppercase">Filters</h2>
        <UFormField label="Search jobs">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            autofocus
          />
        </UFormField>
      </UPageAside>
    </template>

    <UPageBody>
      <header class="mb-8">
        <h1 class="text-3xl font-bold">Available jobs</h1>
        <p class="mt-1">{{ filteredJobs?.length }} results found</p>
      </header>

      <div class="grid gap-4">
        <LLJobCard v-for="job in filteredJobs" :key="job.id" :job="job" />
      </div>

      <div v-if="filteredJobs.length === 0" class="py-20 text-center italic">
        No jobs found.
      </div>
    </UPageBody>
  </UPage>
</template>
