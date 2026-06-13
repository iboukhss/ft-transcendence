<script setup lang="ts">
// import LLLocationFilter from '~/components/LLLocationFilter.vue'
// import LLSkillsFilter from '~/components/LLSkillsFilter.vue'
import { useLocationsFilter } from '~/composables/useLocationsFilter'
import { useSkillsFilter } from '~/composables/useSkillsFilter'

const { data: jobs } = useFetch('/api/jobs/public')
const search = ref('')

const { selectedSkills, verifySkillCheckboxes } = useSkillsFilter()

const { selectedLocations, verifyLocationCheckboxes } = useLocationsFilter()

const filteredJobs = computed(() => {
  if (!jobs.value) {
    return []
  }

  const query = search.value.toLowerCase().trim()
  let jobMatches = jobs.value

  if (query) {
    jobMatches = jobs.value.filter((j) => {
      return j.title.toLowerCase().includes(query)
    })
  }
  jobMatches = verifyLocationCheckboxes(jobMatches)
  return verifySkillCheckboxes(jobMatches)
})
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <LLSearchFilter v-model="search" label="Search jobs" />

        <LLSkillsFilter v-model="selectedSkills" />

        <LLLocationFilter v-model="selectedLocations" />
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
