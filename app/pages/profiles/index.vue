<script setup lang="ts">
import type { FreelancerDTO } from '#shared/dto/profile.dto'

import LLSkillsFilter from '~/components/LLSkillsFilter.vue'

const { data: freelancers } = await useFetch<FreelancerDTO[]>('/api/profiles/freelancers')
const search = ref('')

const filteredProfiles = computed(() => {
  if (!freelancers.value) {
    return []
  }

  const query = search.value.toLowerCase().trim()
  if (!query) {
    return freelancers.value
  }

  return freelancers.value.filter((j) => {
    const firstName = j.firstName.toLowerCase()
    const lastName = j.lastName.toLowerCase()
    const fullName = `${firstName} ${lastName}`
    return firstName.includes(query)
      || lastName.includes(query)
      || fullName.includes(query)
  })
})
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside class="gap-1">
        <h2 class="mb-4 text-sm font-semibold uppercase">Filters</h2>
        <UFormField label="Search profiles">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            autofocus
            class="mb-3"
          />
        </UFormField>
        <LLSkillsFilter />
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

      <div v-if="filteredProfiles.length === 0" class="py-20 text-center italic">
        No profiles found.
      </div>
    </UPageBody>
  </UPage>
</template>
