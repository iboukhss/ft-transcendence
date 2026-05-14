<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

import type { ProfileDTO } from '#shared/dto/profile.dto.js'

import { COUNTRY_KEYS } from '#shared/constants/enums'
import { COUNTRY_LABELS } from '~/utils/labels'

const countryOptions: SelectMenuItem[] = COUNTRY_KEYS.map(k => ({
  key: k,
  label: COUNTRY_LABELS[k]
}))

const isEditing = ref(false)
const toast = useToast()

const { data: profile } = await useFetch<ProfileDTO>('/api/profile')

const state = ref({
  firstName: profile?.value?.firstName || '',
  lastName: profile?.value?.lastName || '',
  country: profile?.value?.country || undefined
})

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const saveProfile = async () => {
  try {
    const response = await $fetch<{ profile: ProfileDTO }>('/api/profile', {
      method: 'PATCH',
      body: state.value
    })
    profile.value = response.profile
    isEditing.value = false

    toast.add({
      title: 'Profile updated',
      description: 'Your changes have been saved sucessfully.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  }
  catch (err) {
    toast.add({
      title: 'Update failed',
      description: 'Something went wrong while saving your profile.',
      color: 'error',
      icon: 'i-lucide-x-cirle'
    })
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between gap-4">
      <header>
        <h2 class="text-xl font-semibold">Public profile</h2>
        <p class="text-muted text-sm">Manage your identity on LuxLink</p>
      </header>

      <UButton
        v-if="!isEditing"
        icon="i-lucide-pencil"
        color="primary"
        variant="ghost"
        @click="toggleEdit"
      >
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </UButton>
    </div>

    <div class="space-y-4">
      <UFormField label="First name">
        <UInput
          v-model="state.firstName"
          :variant="isEditing ? 'outline' : 'subtle'"
          :disabled="!isEditing"
          :color="isEditing ? 'primary' : 'neutral'"
        />
      </UFormField>

      <UFormField label="Last name">
        <UInput
          v-model="state.lastName"
          :variant="isEditing ? 'outline' : 'subtle'"
          :disabled="!isEditing"
          :color="isEditing ? 'primary' : 'neutral'"
        />
      </UFormField>

      <UFormField label="Country">
        <USelect
          v-model="state.country"
          value-key="key"
          :variant="isEditing ? 'outline' : 'subtle'"
          :disabled="!isEditing"
          :color="isEditing ? 'primary' : 'neutral'"
          :items="countryOptions"
          :ui="{
            content: 'min-w-fit' // Found there: https://github.com/nuxt/ui/issues/3920
          }"
        />
      </UFormField>

      <div v-if="isEditing" class="flex justify-end gap-3 pt-4">
        <UButton
          label="Cancel"
          variant="ghost"
          color="neutral"
          @click="toggleEdit"
        />
        <UButton
          label="Save"
          color="primary"
          @click="saveProfile"
        />
      </div>
    </div>
  </div>
</template>
