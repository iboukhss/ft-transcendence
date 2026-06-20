<script setup lang="ts">
import { freelancersQuerySchema } from '#shared/dto/profile.dto'
import { COUNTRY_LABELS } from '~/utils/labels'

const route = useRoute()

const result = freelancersQuerySchema.safeParse(route.query)

const filters = ref(
  result.success
    ? result.data
    : freelancersQuerySchema.parse({ page: 1 })
)

const { data: response, status } = await useFetch('/api/profiles/freelancers', {
  query: filters
})

const isLoading = computed(() => status.value === 'pending')
const filteredProfiles = computed(() => response.value?.items ?? [])

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
    filters.value.locations
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
        <LLSearchFilter v-model="filters.search" label="Search profiles" />

        <LLSkillsFilter v-model="filters.skills" />

        <LLFilterCheckboxGroup
          v-model="filters.locations"
          label="Locations"
          :raw-labels-map="COUNTRY_LABELS"
        />
      </UPageAside>
    </template>

    <UPageBody>
      <header class="mb-8">
        <h1 class="text-3xl font-bold">Available profiles</h1>
        <p class="mt-1">{{ filteredProfiles.length }} results found</p>
      </header>

      <div class="grid gap-4 md:grid-cols-2">
        <LLFreelancerCard
          v-for="profile in filteredProfiles"
          :key="profile.userId"
          :profile="profile"
        />
      </div>

      <div v-if="filteredProfiles.length === 0" class="text-muted py-20 text-center italic">
        No profiles found.
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
