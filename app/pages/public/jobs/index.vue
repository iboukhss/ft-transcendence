<script setup lang="ts">
import { urlQueryBuilder } from '~/composables/urlQueryBuilder'
import { useCategoriesFilter } from '~/composables/useCategoriesFilter'
import { useLocationsFilter } from '~/composables/useLocationsFilter'
import { useSalaryFilter } from '~/composables/useSalaryFilter'
import { useSkillsFilter } from '~/composables/useSkillsFilter'
import { useWorkplacesFilter } from '~/composables/useWorkplacesFilter'
import { COUNTRY_LABELS, JOB_CATEGORY_LABELS, WORKPLACE_LABELS } from '~/utils/labels'

const { selectedSkills } = useSkillsFilter()
const { selectedLocations } = useLocationsFilter()
const { selectedCategories } = useCategoriesFilter()
const { selectedWorkplaces } = useWorkplacesFilter()
const { selectedSalary } = useSalaryFilter()

const JobsUrl = ref('https://localhost:3000/api/jobs?page=1')
const JobAmountUrl = ref('https://localhost:3000/api/jobs')

const { data } = await useFetch<{ JobsAmount: number }>(
  JobAmountUrl,
  {
    watch: [JobAmountUrl]
  }
)
const page = ref(1)

const { data: jobs } = await useFetch(
  JobsUrl,
  {
    watch: [JobsUrl]
  }
)
watch([page, selectedCategories, selectedSkills, selectedLocations, selectedWorkplaces, selectedSalary], async () => {
  JobsUrl.value = await urlQueryBuilder({
    skills: selectedSkills.value,
    location: selectedLocations.value,
    categories: selectedCategories.value,
    workplace: selectedWorkplaces.value,
    salaryStart: selectedSalary.value[0],
    salaryEnd: selectedSalary.value[1],
    page: page.value
  }, true, 'https://localhost:3000/api/jobs')

  JobAmountUrl.value = await urlQueryBuilder({
    skills: selectedSkills.value,
    location: selectedLocations.value,
    categories: selectedCategories.value,
    workplace: selectedWorkplaces.value,
    salaryStart: selectedSalary.value[0],
    salaryEnd: selectedSalary.value[1]
  }, false, 'https://localhost:3000/api/jobs')
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
const search = ref('')

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
  return jobMatches
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
      <UPagination v-model:page="page" :items-per-page="10" :total="data?.JobsAmount" />
    </UPageBody>
  </UPage>
</template>
