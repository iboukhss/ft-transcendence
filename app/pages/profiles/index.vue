<script setup lang="ts">
import type { FreelancerDTO } from '#shared/dto/profile.dto'

import { useLocationsFilter } from '~/composables/useLocationsFilter'
import { useSkillsFilter } from '~/composables/useSkillsFilter'
import { COUNTRY_LABELS } from '~/utils/labels'

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
      <UPageAside>
        <LLSearchFilter v-model="search" label="Search profiles" />

        <LLSkillsFilter v-model="selectedSkills" />

        <LLFilterCheckboxGroup
          v-model="selectedLocations"
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

      <div v-if="filteredProfiles.length === 0" class="py-20 text-center italic">
        No profiles found.
      </div>
    </UPageBody>
  </UPage>
</template>
