<script setup lang="ts">
import type { ProfileDTO } from '#shared/dto/profile.dto.js'

import { COUNTRY_LABELS } from '~/utils/labels'

const { data: profile } = await useFetch('/api/profile')

const isEditingBio = ref(false)
const isLoading = ref(false)
const toast = useToast()

const bioState = ref(
  profile.value?.type === 'freelancer'
    ? profile.value.bio ?? ''
    : profile.value?.description ?? ''
)

const toggleEditBio = () => {
  if (isEditingBio.value && profile.value) {
    bioState.value = profile.value.type === 'freelancer'
      ? profile.value.bio ?? ''
      : profile.value.description ?? ''
  }
  isEditingBio.value = !isEditingBio.value
}

const saveBio = async () => {
  if (isLoading.value || !profile.value) {
    return
  }

  isLoading.value = true

  const payload = profile.value.type === 'freelancer'
    ? { type: 'freelancer', bio: bioState.value }
    : { type: 'company', description: bioState.value }

  try {
    const response = await $fetch<ProfileDTO>('/api/profile', {
      method: 'PATCH',
      body: payload
    })

    profile.value = response
    isEditingBio.value = false

    toast.add({
      title: 'Success',
      description: 'About section updated.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err) {
    toast.add({
      title: 'Failure',
      description: 'Something went wrong while saving about section.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UPage v-if="profile">
    <div v-if="profile.type === 'freelancer'" class="space-y-8">
      <div class="flex items-start justify-between ">
        <div class="flex items-center gap-6">
          <UAvatar :alt="profile.firstName" size="3xl" class="h-24 w-24" />

          <div class="flex flex-col">
            <h1 class="text-3xl font-bold">
              {{ profile.firstName }} {{ profile.lastName }}
            </h1>

            <div class="text-muted mt-1 flex flex-col text-sm">
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-map-pin" />
                <span>{{ profile.country ? COUNTRY_LABELS[profile.country] : 'Location not set' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-clock" />
                <span>10:42 AM local time</span>
              </div>
            </div>
          </div>
        </div>

        <UButton
          to="/settings"
          icon="i-lucide-pencil"
          variant="outline"
          color="neutral"
          size="sm"
          label="Edit profile"
        />
      </div>

      <USeparator />

      <section>
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-xl font-semibold">About</h2>
          <UButton
            v-if="!isEditingBio"
            icon="i-lucide-pencil"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="toggleEditBio"
          />
        </div>

        <div v-if="isEditingBio" class="space-y-3">
          <UTextarea
            v-model="bioState"
            placeholder="Write your bio..."
            class="w-full"
          />

          <div class="flex justify-end gap-3">
            <UButton
              label="Cancel"
              variant="ghost"
              color="neutral"
              @click="toggleEditBio"
            />
            <UButton
              label="Save"
              color="primary"
              :loading="isLoading"
              @click="saveBio"
            />
          </div>
        </div>

        <p v-else class="leading-relaxed whitespace-pre-line">
          {{ profile.bio || 'No bio provided yet.' }}
        </p>
      </section>

      <USeparator />

      <div>
        <h2 class="text-xl font-semibold">Skills</h2>
        <p>No skills provided yet.</p>
      </div>

      <USeparator />

      <div>
        <h2 class="text-xl font-semibold">Languages</h2>
        <p>No languages provided yet.</p>
      </div>
    </div>

    <div v-else-if="profile.type === 'company'" class="space-y-8">
      <div class="flex items-start justify-between ">
        <div class="flex items-center gap-6">
          <UAvatar :alt="profile.companyName" size="3xl" class="h-24 w-24" />

          <div class="flex flex-col">
            <h1 class="text-3xl font-bold">
              {{ profile.companyName }}
            </h1>

            <div class="text-muted mt-1 flex flex-col text-sm">
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-map-pin" />
                <span>{{ profile.country ? COUNTRY_LABELS[profile.country] : 'Location not set' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-clock" />
                <span>10:42 AM local time</span>
              </div>
            </div>
          </div>
        </div>

        <UButton
          to="/settings"
          icon="i-lucide-pencil"
          variant="outline"
          color="neutral"
          size="sm"
          label="Edit profile"
        />
      </div>

      <USeparator />

      <section>
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-xl font-semibold">About</h2>
          <UButton
            v-if="!isEditingBio"
            icon="i-lucide-pencil"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="toggleEditBio"
          />
        </div>

        <div v-if="isEditingBio" class="space-y-3">
          <UTextarea
            v-model="bioState"
            placeholder="Write your description..."
            class="w-full"
          />

          <div class="flex justify-end gap-3">
            <UButton
              label="Cancel"
              variant="ghost"
              color="neutral"
              @click="toggleEditBio"
            />
            <UButton
              label="Save"
              color="primary"
              :loading="isLoading"
              @click="saveBio"
            />
          </div>
        </div>

        <p v-else class="leading-relaxed whitespace-pre-line">
          {{ profile.description || 'No description provided yet.' }}
        </p>
      </section>
    </div>
  </UPage>
</template>
