<script setup lang="ts">
import { useCategoriesFilter } from '~/composables/useCategoriesFilter'
import { useLocationsFilter } from '~/composables/useLocationsFilter'
import { useSalaryFilter } from '~/composables/useSalaryFilter'
import { useSkillsFilter } from '~/composables/useSkillsFilter'
import { useWorkplacesFilter } from '~/composables/useWorkplacesFilter'
import { COUNTRY_LABELS, JOB_CATEGORY_LABELS, WORKPLACE_LABELS } from '~/utils/labels'

const response = await fetch('https://localhost:3000/api/jobs')
const data = await response.json()
const page = ref(1)
const { data: jobs, refresh } = useFetch(() => `/api/jobs?page=${page.value}`)

watch(page, async () => {
  await refresh()
})
const search = ref('')

const { selectedSkills, verifySkillCheckboxes } = useSkillsFilter()
const { selectedLocations, verifyLocationCheckboxes } = useLocationsFilter()
const { selectedCategories, verifyCategoryCheckboxes } = useCategoriesFilter()
const { selectedWorkplaces, verifyWorkplaceCheckboxes } = useWorkplacesFilter()
const { selectedSalary, verifySalarySliders } = useSalaryFilter()

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
  jobMatches = verifySkillCheckboxes(jobMatches)
  jobMatches = verifyLocationCheckboxes(jobMatches)
  jobMatches = verifyCategoryCheckboxes(jobMatches)
  jobMatches = verifyWorkplaceCheckboxes(jobMatches)
  return verifySalarySliders(jobMatches)
})
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <LLSearchFilter v-model="search" label="Search jobs" />

        <LLSkillsFilter v-model="selectedSkills" />

        <LLFilterCheckboxGroup
          v-model="selectedLocations"
          label="Locations"
          :raw-labels-map="COUNTRY_LABELS"
        />

        <LLSalaryFilter v-model="selectedSalary" />

        <LLFilterCheckboxGroup
          v-model="selectedCategories"
          label="Categories"
          :raw-labels-map="JOB_CATEGORY_LABELS"
        />

        <LLFilterCheckboxGroup
          v-model="selectedWorkplaces"
          label="Workplace"
          :raw-labels-map="WORKPLACE_LABELS"
        />
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
      <UPagination v-model:page="page" :items-per-page="10" :total="data.JobsAmount" />
    </UPageBody>
  </UPage>
</template>
