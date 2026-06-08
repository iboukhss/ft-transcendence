<script setup lang="ts">
import type { FreelancerDTO } from '#shared/dto/profile.dto'

const { data: freelancers } = await useFetch<FreelancerDTO[]>('/api/profiles/freelancers')
const search = ref('')

const filteredProfiles = computed(() => {
  if (!freelancers.value) {
    return []
  }
  return freelancers.value.filter(j =>
    j.firstName.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <h2 class="mb-4 text-sm font-semibold uppercase">Filters</h2>
        <UFormField label="Search profiles">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            autofocus
          />
        </UFormField>
      </UPageAside>
    </template>

    <UPageBody>
      <header class="mb-8">
        <h1 class="text-3xl font-bold">Available profiles</h1>
        <p class="mt-1">{{ freelancers?.length }} results found</p>
      </header>

      <div class="grid gap-4">
        <div
          v-for="profile in filteredProfiles" :key="profile.firstName"
          @click="navigateTo(`/profiles/${profile.userId}`)"
        >
          {{ profile.firstName }}
        </div>
      </div>
    </UPageBody>
  </UPage>
</template>
