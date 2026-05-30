<script setup lang="ts">
import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'

import type { ProfileIdentityDTO, ProfileDTO, UploadAvatarDTO } from '#shared/dto/profile.dto.js'

import { COUNTRY_KEYS } from '#shared/constants/enums'
import { profileIdentitySchema, uploadAvatarSchema } from '#shared/dto/profile.dto'
import { COUNTRY_LABELS } from '~/utils/labels'

const countryOptions: SelectMenuItem[] = COUNTRY_KEYS.map(k => ({
  key: k,
  label: COUNTRY_LABELS[k]
}))

const isEditing = ref(false)
const isLoading = ref(false)
const toast = useToast()

const { data: profile } = await useFetch<ProfileDTO>('/api/profile')

const identityState = ref<ProfileIdentityDTO | null>(
  profile.value ? profileIdentitySchema.parse(profile.value) : null
)

const toggleEdit = () => {
  if (isEditing.value && profile.value) {
    identityState.value = profileIdentitySchema.parse(profile.value)
  }
  isEditing.value = !isEditing.value
}

const saveIdentity = async (event: FormSubmitEvent<ProfileIdentityDTO>) => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch<ProfileDTO>('/api/profile', {
      method: 'PATCH',
      body: event.data
    })

    profile.value = response
    isEditing.value = false

    toast.add({
      title: 'Profile updated',
      description: 'Your changes have been saved sucessfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err) {
    toast.add({
      title: 'Update failed',
      description: 'Something went wrong while saving your profile.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isLoading.value = false
  }
}

const isUploading = ref(false)

const avatarState = reactive<Partial<UploadAvatarDTO>>({
  avatar: undefined
})

const onAvatarUpload = async (event: FormSubmitEvent<UploadAvatarDTO>) => {
  if (isUploading.value || !event.data.avatar || !profile.value) {
    return
  }

  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('avatar', event.data.avatar)

    const response = await $fetch('/api/profile/avatar', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      if (profile.value.type === 'freelancer') {
        profile.value.avatar = response.avatarUrl
      }
      else {
        profile.value.logo = response.avatarUrl
      }

      avatarState.avatar = undefined

      toast.add({
        title: 'Success',
        description: 'Your profile picture has been updated.',
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
    }
  }
  catch (err: any) {
    toast.add({
      title: 'Upload failed',
      description: 'Something went wrong while uploading.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isUploading.value = false
  }
}
</script>

<template>
  <UPage v-if="profile && identityState">
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

      <UForm
        :schema="profileIdentitySchema"
        :state="identityState"
        @submit="saveIdentity"
      >
        <div v-if="identityState.type === 'freelancer'" class="space-y-4">
          <UFormField label="First name" name="firstName">
            <UInput
              v-model="identityState.firstName"
              :variant="isEditing ? 'outline' : 'subtle'"
              :disabled="!isEditing"
              :color="isEditing ? 'primary' : 'neutral'"
            />
          </UFormField>

          <UFormField label="Last name" name="lastName">
            <UInput
              v-model="identityState.lastName"
              :variant="isEditing ? 'outline' : 'subtle'"
              :disabled="!isEditing"
              :color="isEditing ? 'primary' : 'neutral'"
            />
          </UFormField>

          <UFormField label="Country" name="country">
            <USelect
              v-model="identityState.country"
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
        </div>

        <div v-else class="space-y-4">
          <UFormField label="Contact first name" name="contactFirstName">
            <UInput
              v-model="identityState.contactFirstName"
              :variant="isEditing ? 'outline' : 'subtle'"
              :disabled="!isEditing"
              :color="isEditing ? 'primary' : 'neutral'"
            />
          </UFormField>

          <UFormField label="Contact last name" name="contactLastName">
            <UInput
              v-model="identityState.contactLastName"
              :variant="isEditing ? 'outline' : 'subtle'"
              :disabled="!isEditing"
              :color="isEditing ? 'primary' : 'neutral'"
            />
          </UFormField>

          <UFormField label="Company name" name="companyName">
            <UInput
              v-model="identityState.companyName"
              :variant="isEditing ? 'outline' : 'subtle'"
              :disabled="!isEditing"
              :color="isEditing ? 'primary' : 'neutral'"
            />
          </UFormField>

          <UFormField label="Country" name="country">
            <USelect
              v-model="identityState.country"
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
        </div>

        <div v-if="isEditing" class="flex justify-end gap-3 pt-4">
          <UButton
            label="Cancel"
            variant="ghost"
            color="neutral"
            @click="toggleEdit"
          />
          <UButton
            type="submit"
            label="Save"
            color="primary"
            :loading="isLoading"
          />
        </div>
      </UForm>

      <div>
        <header>
          <h2 class="text-xl font-semibold">Avatar</h2>
          <p class="text-muted text-sm">Upload a profile picture</p>
        </header>
      </div>

      <UForm
        :schema="uploadAvatarSchema"
        :state="avatarState"
        @submit="onAvatarUpload"
      >
        <div class="flex items-center gap-4">
          <UAvatar
            :src="profile.type === 'freelancer' ? profile.avatar : profile.logo"
            size="4xl"
          />

          <UFormField name="avatar">
            <UFileUpload
              v-model="avatarState.avatar"
              variant="area"
              label="Choose image"
              description="JPEG, PNG, WEBP or GIF (max 2MB)"
            />
          </UFormField>
        </div>

        <div class="flex justify-end pt-4">
          <UButton type="submit" label="Submit" />
        </div>
      </UForm>
    </div>
  </UPage>
</template>
