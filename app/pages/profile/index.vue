<script setup lang="ts">
import type { PatchProfileDTO, ProfileDTO } from '#shared/dto/profile.dto'

const { data: profile } = await useFetch<ProfileDTO>('/api/profile')
const toast = useToast()

async function onProfileUpdate(payload: PatchProfileDTO, done: (success: boolean) => void) {
  try {
    const response = await $fetch<ProfileDTO>('/api/profile', {
      method: 'PATCH',
      body: payload
    })

    profile.value = response
    toast.add({ title: 'Success', description: 'Profile updated.', color: 'success' })
    done(true)
  }
  catch (err: any) {
    toast.add({ title: 'Error', description: 'Failed to update profile.', color: 'error' })
    done(false)
  }
}
</script>

<template>
  <UPage v-if="profile">
    <LLFreelancerView
      v-if="profile.type === 'freelancer'"
      :profile="profile"
      is-own-profile
    >
      <template #about>
        <LLEditAboutSection
          v-model="profile.bio"
          placeholder="Tell us about your background..."
          @save="(val, done) => onProfileUpdate({ type: 'freelancer', bio: val }, done)"
        />
      </template>
    </LLFreelancerView>

    <LLCompanyView
      v-else
      :profile="profile"
      is-own-profile
    >
      <template #about>
        <LLEditAboutSection
          v-model="profile.description"
          placeholder="Describe your company mission..."
          @save="(val, done) => onProfileUpdate({ type: 'company', description: val }, done)"
        />
      </template>
    </LLCompanyView>
  </UPage>
</template>
