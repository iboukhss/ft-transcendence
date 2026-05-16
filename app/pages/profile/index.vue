<script setup lang="ts">
import { COUNTRY_LABELS } from '~/utils/labels'

const { user } = useUserSession()
const { data: profile } = await useFetch('/api/profile')

const isEditingBio = ref(false)
</script>

<template>
  <div v-if="profile && profile.type === 'freelancer'" class="space-y-8">
    <div class="flex items-start justify-between ">
      <div class="flex items-center gap-6">
        <UAvatar :alt="user?.email" size="3xl" class="h-24 w-24" />

        <div class="flex flex-col">
          <h1 class="text-3xl font-bold">
            {{ profile.firstName }} {{ profile.lastName }}
          </h1>

          <div class="text-muted mt-1 flex flex-col text-sm">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-map-pin" />
              <span>{{ profile?.country ? COUNTRY_LABELS[profile.country] : 'Location not set' }}</span>
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
          @click="isEditingBio = true"
        />
      </div>

      <div v-if="isEditingBio" class="space-y-3">
        <UTextarea
          autoresize
          placeholder="Write your bio..."
          class="w-full"
        />

        <div class="flex justify-end gap-3">
          <UButton
            label="Cancel"
            variant="ghost"
            color="neutral"
            @click="isEditingBio = false"
          />
          <UButton
            label="Save"
            color="primary"
            @click="saveBio"
          />
        </div>
      </div>

      <p v-else>
        No bio provided yet.
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
</template>
