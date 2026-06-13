<script setup lang="ts">
const { data: jobs } = useFetch('/api/jobs/public')
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
        <LLSearchFilter v-model="search" label="Search jobs" />
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

      <div v-if="filteredJobs.length === 0" class="text-muted py-20 text-center italic">
        No jobs found.
      </div>
    </UPageBody>
  </UPage>
</template>
