<script setup lang="ts">
import type { PatchProfileDTO, ProfileDTO } from '#shared/dto/profile.dto'

import { SKILL_KEYS } from '#shared/constants/enums'
import { SKILL_LABELS } from '~/utils/labels'

const { data: profile } = await useFetch<ProfileDTO>('/api/profile')
const toast = useToast()

const skillOptions = SKILL_KEYS.map(k => ({
  key: k,
  label: SKILL_LABELS[k]
}))

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
    <UPageBody>
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

        <template #skills>
          <LLEditTagsSection
            v-model="profile.skills"
            title="Skills"
            :options="skillOptions"
            :labels="SKILL_LABELS"
            placeholder="Choose your core skills..."
            @save="(tags, done) => onProfileUpdate({ type: 'freelancer', skills: tags }, done)"
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
    </UPageBody>
  </UPage>
</template>
