<script setup lang="ts">
const route = useRoute()
const profileId = route.params.id

const { data: profile, error, pending } = await useFetch(`/api/profiles/${profileId}`)
</script>

<template>
  <UPage v-if="profile">
    <LLFreelancerView
      v-if="profile.type === 'freelancer'"
      :profile="profile"
    />

    <LLCompanyView
      v-else
      :profile="profile"
    />
  </UPage>
</template>
