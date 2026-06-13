<script setup lang="ts">
const route = useRoute()
const profileId = route.params.id

const { data: profile, error, pending } = await useFetch(`/api/profiles/${profileId}`)
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
