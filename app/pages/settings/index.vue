<script setup lang="ts">
import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'

import { z } from 'zod'

import type { ProfileDTO, UploadAvatarDTO } from '#shared/dto/profile.dto.js'

import { COUNTRY_KEYS } from '#shared/constants/enums'
import { freelancerProfileSchema, companyProfileSchema, uploadAvatarSchema } from '#shared/dto/profile.dto'
import { COUNTRY_LABELS } from '~/utils/labels'

const countryOptions: SelectMenuItem[] = COUNTRY_KEYS.map(k => ({
  key: k,
  label: COUNTRY_LABELS[k]
}))

const isLoading = ref(false)
const isDeleteModalOpen = ref(false)
const toast = useToast()

const { data: profile } = await useFetch('/api/profile')
const { fetch: fetchUserSession } = useUserSession()

const freelancerIdentitySchema = freelancerProfileSchema.pick({
  type: true,
  userId: true,
  firstName: true,
  lastName: true,
  country: true
})

const companyIdentitySchema = companyProfileSchema.pick({
  type: true,
  userId: true,
  contactFirstName: true,
  contactLastName: true,
  companyName: true,
  country: true
})

const profileIdentitySchema = z.discriminatedUnion('type', [
  freelancerIdentitySchema,
  companyIdentitySchema
])

type ProfileIdentityDTO = z.infer<typeof profileIdentitySchema>

const identityState = ref<ProfileIdentityDTO | null>(
  profile.value ? profileIdentitySchema.parse(profile.value) : null
)

const saveIdentity = async (event: FormSubmitEvent<ProfileIdentityDTO>) => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/profile', {
      method: 'PATCH',
      body: event.data
    })

    profile.value = response
    await fetchUserSession()

    toast.add({
      title: 'Profile updated',
      description: 'Your profile has been updated sucessfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err) {
    toast.add({
      title: 'Update failed',
      description: 'Something went wrong while updating your profile.',
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
      await fetchUserSession()

      toast.add({
        title: 'Avatar uploaded',
        description: 'Your avatar has been uploaded successfully.',
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
    }
  }
  catch (err: any) {
    toast.add({
      title: 'Upload failed',
      description: 'Something went wrong while uploading your avatar.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isUploading.value = false
  }
}

async function onDeleteAvatar() {
  if (!profile.value)
    return
  try {
    const response = await $fetch('/api/profile/avatar', {
      method: 'DELETE'
    })
    if (response.success) {
      if (profile.value.type === 'freelancer') {
        profile.value.avatar = null
      }
      else {
        profile.value.logo = null
      }
    }

    await fetchUserSession()

    toast.add({
      title: 'Avatar deleted',
      description: 'Your avatar has been permanently deleted.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err: any) {
    toast.add({
      title: 'Deletion failed',
      description: err.data?.message || 'Something went wrong. Please try again.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  isDeleteModalOpen.value = false
}
</script>

<template>
  <UPageBody v-if="profile && identityState" class="space-y-8">
    <div class="flex items-center justify-between px-2">
      <div class="px-2 text-3xl font-bold tracking-tight">
        <h1>Public profile</h1>
      </div>

      <UButton
        to="/me"
        label="Go back to profile"
        variant="subtle"
        color="neutral"
      />
    </div>

    <UForm
      :schema="profileIdentitySchema"
      :state="identityState"
      @submit="saveIdentity"
    >
      <UCard
        title="Identity"
        description="Manage your identity on LuxLink"
      >
        <div v-if="identityState.type === 'freelancer'" class="space-y-4">
          <UFormField label="First name" name="firstName">
            <UInput
              v-model="identityState.firstName"
              variant="outline"
            />
          </UFormField>

          <UFormField label="Last name" name="lastName">
            <UInput
              v-model="identityState.lastName"
              variant="outline"
            />
          </UFormField>

          <UFormField label="Country" name="country">
            <USelect
              v-model="identityState.country"
              value-key="key"
              variant="outline"
              :items="countryOptions"
              :ui="{
                // Found there: https://github.com/nuxt/ui/issues/3920
                content: 'min-w-fit'
              }"
            />
          </UFormField>
        </div>

        <div v-else class="space-y-4">
          <UFormField label="Contact first name" name="contactFirstName">
            <UInput
              v-model="identityState.contactFirstName"
              variant="outline"
            />
          </UFormField>

          <UFormField label="Contact last name" name="contactLastName">
            <UInput
              v-model="identityState.contactLastName"
              variant="outline"
            />
          </UFormField>

          <UFormField label="Company name" name="companyName">
            <UInput
              v-model="identityState.companyName"
              variant="outline"
            />
          </UFormField>

          <UFormField label="Country" name="country">
            <USelect
              v-model="identityState.country"
              value-key="key"
              variant="outline"
              :items="countryOptions"
              :ui="{
                // Found there: https://github.com/nuxt/ui/issues/3920
                content: 'min-w-fit'
              }"
            />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex">
            <UButton
              type="submit"
              label="Save profile changes"
              variant="outline"
              :loading="isLoading"
            />
          </div>
        </template>
      </UCard>
    </UForm>

    <UForm
      :schema="uploadAvatarSchema"
      :state="avatarState"
      @submit="onAvatarUpload"
    >
      <UCard
        title="Avatar"
        description="Upload a profile picture"
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

        <template #footer>
          <div class="flex gap-2">
            <UButton
              type="submit"
              label="Upload new picture"
              variant="outline"
              :loading="isUploading"
            />
            <UModal
              v-model:open="isDeleteModalOpen"
              :dismissible="false"
              :close="false"
              title="Are you sure you want to delete your avatar?"
            >
              <template #footer>
                <div class="flex gap-2">
                  <UButton color="neutral" label="Cancel" variant="subtle" @click="isDeleteModalOpen = false" />
                  <UButton color="error" label="Delete" @click="onDeleteAvatar" />
                </div>
              </template>
              <UButton color="error" label="Delete picture" variant="outline" />
            </UModal>
          </div>
        </template>
      </UCard>
    </UForm>
  </UPageBody>
</template>
