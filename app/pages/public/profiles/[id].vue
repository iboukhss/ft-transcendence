<script setup lang="ts">
import type { ProfileDTO } from '#shared/dto/profile.dto.js'

const route = useRoute()
const profileId = route.params.id

const { data: profile, error, pending } = await useFetch<ProfileDTO>(`/api/profiles/${profileId}`)
</script>

<template>
  <UPage v-if="profile">
    <UPageBody>
      <LLFreelancerView
        v-if="profile.type === 'freelancer'"
        :profile="profile"
      />

      <LLCompanyView
        v-else
        :profile="profile"
      />
    </UPageBody>
  </UPage>
</template>
