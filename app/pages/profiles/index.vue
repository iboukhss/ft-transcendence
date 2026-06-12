<script setup lang="ts">
import type { FreelancerDTO } from '#shared/dto/profile.dto'

import LLLocationFilter from '~/components/LLLocationFilter.vue'
import LLSkillsFilter from '~/components/LLSkillsFilter.vue'
import { useLocationsFilter } from '~/composables/useLocationsFilter'
import { useSkillsFilter } from '~/composables/useSkillsFilter'

const { data: freelancers } = await useFetch<FreelancerDTO[]>('/api/profiles/freelancers')
const search = ref('')

const { selectedSkills, verifySkillCheckboxes } = useSkillsFilter()

const { selectedLocations, verifyLocationCheckboxes } = useLocationsFilter()

const filteredProfiles = computed(() => {
  if (!freelancers.value) {
    return []
  }

  const query = search.value.toLowerCase().trim()
  let nameMatches = freelancers.value

  if (query) {
    nameMatches = freelancers.value.filter((j) => {
      const firstName = j.firstName.toLowerCase()
      const lastName = j.lastName.toLowerCase()
      const fullName = `${firstName} ${lastName}`
      return firstName.includes(query)
        || lastName.includes(query)
        || fullName.includes(query)
    })
  }
  nameMatches = verifyLocationCheckboxes(nameMatches)
  return verifySkillCheckboxes(nameMatches)
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
            class="mb-4"
          />
        </UFormField>

        <div class="mb-1 flex content-center items-center justify-between">
          <h2 class="text-default block text-sm font-medium">Skills</h2>
        </div>
        <LLSkillsFilter v-model="selectedSkills" />
        <div class="mb-1 flex content-center items-center justify-between">
          <h2 class="text-default block text-sm font-medium">Locations</h2>
        </div>
        <LLLocationFilter v-model="selectedLocations" />
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
