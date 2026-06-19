<script setup lang="ts">
import type { FreelancerDTO } from '#shared/dto/profile.dto'

import { urlQueryBuilder } from '~/composables/urlQueryBuilder'
import { useLocationsFilter } from '~/composables/useLocationsFilter'
import { useSkillsFilter } from '~/composables/useSkillsFilter'
import { COUNTRY_LABELS } from '~/utils/labels'

const page = ref(1)
const profilesUrl = ref('https://localhost:3000/api/profiles/freelancers?page=1')
const profilesAmountUrl = ref('https://localhost:3000/api/profiles/freelancers')
const { data: freelancers } = await useFetch<FreelancerDTO[]>(
  profilesUrl,
  {
    watch: [profilesUrl]
  }
)

const search = ref('')

const { data } = await useFetch<{ FreelancersAmount: number }>(
  profilesAmountUrl,
  {
    watch: [profilesAmountUrl]
  }
)

const { selectedSkills } = useSkillsFilter()

const { selectedLocations } = useLocationsFilter()

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
  return nameMatches
})

watch([selectedSkills, selectedLocations, page], async () => {
  profilesUrl.value = await urlQueryBuilder({
    page: page.value,
    skills: selectedSkills.value,
    location: selectedLocations.value
  }, true, 'https://localhost:3000/api/profiles/freelancers')

  profilesAmountUrl.value = await urlQueryBuilder({
    page: page.value,
    skills: selectedSkills.value,
    location: selectedLocations.value
  }, false, 'https://localhost:3000/api/profiles/freelancers')
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

      <div v-if="filteredProfiles.length === 0" class="text-muted py-20 text-center italic">
        No profiles found.
      </div>
      <UPagination v-model:page="page" :items-per-page="10" :total="data?.FreelancersAmount" />
    </UPageBody>
  </UPage>
</template>
