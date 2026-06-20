<script setup lang="ts">
import { jobsQuerySchema } from '#shared/dto/job.dto'
import { COUNTRY_LABELS, JOB_CATEGORY_LABELS, WORKPLACE_LABELS } from '~/utils/labels'

const route = useRoute()

const result = jobsQuerySchema.safeParse(route.query)

const filters = ref(
  result.success
    ? result.data
    : jobsQuerySchema.parse({ page: 1 })
)

const { data: response, status } = await useFetch('/api/jobs', {
  query: filters
})

const isLoading = computed(() => status.value === 'pending')
const filteredJobs = computed(() => response.value?.items ?? [])

watch(() => filters.value.page, () => {
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
})

watch(
  () => [
    filters.value.search,
    filters.value.skills,
    filters.value.locations,
    filters.value.minSalary,
    filters.value.maxSalary,
    filters.value.categories,
    filters.value.workplaces
  ],
  () => {
    filters.value.page = 1
  },
  { deep: true }
)
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <LLSearchFilter v-model="filters.search" label="Search jobs" />

        <LLSkillsFilter v-model="filters.skills" />

        <LLFilterCheckboxGroup
          v-model="filters.locations"
          label="Locations"
          :raw-labels-map="COUNTRY_LABELS"
        />

        <LLSalaryFilter
          v-model:min="filters.minSalary"
          v-model:max="filters.maxSalary"
        />

        <LLFilterCheckboxGroup
          v-model="filters.categories"
          label="Categories"
          :raw-labels-map="JOB_CATEGORY_LABELS"
        />

        <LLFilterCheckboxGroup
          v-model="filters.workplaces"
          label="Workplace"
          :raw-labels-map="WORKPLACE_LABELS"
        />
      </UPageAside>
    </template>

    <UPageBody>
      <header class="mb-8">
        <h1 class="text-3xl font-bold">Available jobs</h1>
        <p class="mt-1">{{ response?.total ?? 0 }} results found</p>
      </header>

      <div class="grid gap-4">
        <LLJobCard v-for="job in filteredJobs" :key="job.id" :job="job" />
      </div>

      <div v-if="filteredJobs.length === 0" class="text-muted py-20 text-center italic">
        No jobs found.
      </div>

      <div v-if="response?.total && response.total > 10" class="mt-8 flex justify-center">
        <UPagination
          v-model:page="filters.page"
          :items-per-page="10"
          :total="response.total"
          :disabled="isLoading"
        />
      </div>
    </UPageBody>
  </UPage>
</template>
