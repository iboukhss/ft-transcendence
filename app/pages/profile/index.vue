<script setup lang="ts">
import type { PatchProfileDTO } from '#shared/dto/profile.dto'

import { SKILL_KEYS } from '#shared/constants/enums'
import { SKILL_LABELS } from '~/utils/labels'

const { data: profile } = await useFetch('/api/profile')
const toast = useToast()

const skillOptions = SKILL_KEYS.map(k => ({
  key: k,
  label: SKILL_LABELS[k]
}))

async function onProfileUpdate(payload: PatchProfileDTO, done: (success: boolean) => void) {
  try {
    const response = await $fetch('/api/profile', {
      method: 'PATCH',
      body: payload
    })

    profile.value = response

    toast.add({
      title: 'Profile updated',
      description: 'Your profile has been updated sucessfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    done(true)
  }
  catch (err: any) {
    toast.add({
      title: 'Update failed',
      description: 'Something went wrong while updating your profile.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
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
            @save="(val, done) => onProfileUpdate({ userId: profile.userId, type: 'freelancer', bio: val }, done)"
          />
        </template>

        <template #skills>
          <LLEditTagsSection
            v-model="profile.skills"
            title="Skills"
            :options="skillOptions"
            :labels="SKILL_LABELS"
            placeholder="Choose your skills..."
            @save="(tags, done) => onProfileUpdate({ userId: profile.userId, type: 'freelancer', skills: tags }, done)"
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
            @save="(val, done) => onProfileUpdate({ userId: profile.userId, type: 'company', description: val }, done)"
          />
        </template>
      </LLCompanyView>
    </UPageBody>
  </UPage>
</template>
