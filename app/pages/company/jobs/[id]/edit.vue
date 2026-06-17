<script setup lang="ts">
import type { SelectMenuItem, RadioGroupItem } from '@nuxt/ui'
import type { CreateJobDTO } from '#shared/dto/job.dto'
import { JOB_CATEGORY_KEYS, WORKPLACE_KEYS, SKILL_KEYS, COUNTRY_KEYS } from '#shared/constants/enums'
import { createJobSchema } from '#shared/dto/job.dto'
import { JOB_CATEGORY_LABELS, SKILL_LABELS, WORKPLACE_LABELS, COUNTRY_LABELS } from '~/utils/labels'

const route = useRoute()
const jobId = Number(route.params.id)
const toast = useToast()
const isLoading = ref(false)
const isReady = ref(false)

// Fetch existing job
const { data: job, error } = await useFetch(`/api/jobs/${jobId}`)

if (error.value || !job.value) {
  throw createError({
    statusCode: error.value?.statusCode || 404,
    statusMessage: 'Job not found',
    fatal: true
  })
}

const state = reactive<Partial<CreateJobDTO>>({
  title: job.value.title,
  category: job.value.category,
  skills: job.value.skills,
  duration: job.value.duration,
  hourlyRate: job.value.hourlyRate,
  workplace: job.value.workplace,
  description: job.value.description,
  status: job.value.status,
  location: job.value.location
})

isReady.value = true

const categoryOptions: SelectMenuItem[] = JOB_CATEGORY_KEYS.map(k => ({
  key: k,
  label: JOB_CATEGORY_LABELS[k]
}))

const workplaceOptions: RadioGroupItem[] = WORKPLACE_KEYS.map(k => ({
  key: k,
  label: WORKPLACE_LABELS[k]
}))

const skillOptions: SelectMenuItem[] = SKILL_KEYS.map(k => ({
  key: k,
  label: SKILL_LABELS[k]
}))

const countryOptions: SelectMenuItem[] = COUNTRY_KEYS.map(k => ({
  key: k,
  label: COUNTRY_LABELS[k]
}))

async function onSubmit() {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await $fetch(`/api/jobs/company/${jobId}`, {
      method: 'PATCH',
      body: state
    })
    toast.add({
      title: 'Job updated',
      description: 'Your job posting has been updated successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    await navigateTo('/company/jobs')
  }
  catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Something went wrong while updating your job.',
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
  <UPage>
    <UPageBody class="mx-auto max-w-xl space-y-8">
      <header class="text-center">
        <h2 class="text-3xl font-bold tracking-tight">Edit job posting</h2>
        <p class="text-muted mt-1">{{ job?.title }}</p>
      </header>

      <USeparator />

      <template v-if="isReady">
        <UForm
          :schema="createJobSchema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <UFormField label="Job title" name="title">
            <UInput v-model="state.title" class="w-full" />
          </UFormField>

          <UFormField label="Category" name="category">
            <USelectMenu
              v-model="state.category"
              value-key="key"
              :items="categoryOptions"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Skills" name="skills">
            <UInputMenu
              v-model="state.skills"
              value-key="key"
              :items="skillOptions"
              multiple
              class="w-full"
            />
          </UFormField>

          <UFormField :label="`Duration: ${state.duration} months`" name="duration">
            <USlider
              v-model="state.duration"
              :min="1" :max="12" :step="1"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Budget" name="hourlyRate">
            <UInput
              v-model="state.hourlyRate"
              type="number"
              min="0" step="0.01"
              class="w-full"
            >
              <template #leading>€</template>
              <template #trailing>/hr</template>
            </UInput>
          </UFormField>

          <UFormField label="Location" name="location">
            <USelectMenu
              v-model="state.location"
              value-key="key"
              :items="countryOptions"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Workplace" name="workplace">
            <URadioGroup
              v-model="state.workplace"
              value-key="key"
              :items="workplaceOptions"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Job description" name="description">
            <UTextarea
              v-model="state.description"
              :rows="5"
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center gap-4">
            <UButton type="submit" block size="lg" :loading="isLoading">
              Save changes
            </UButton>
            <UButton
              variant="ghost"
              color="neutral"
              size="lg"
              to="/company/jobs"
            >
              Cancel
            </UButton>
          </div>
        </UForm>
      </template>

      <template v-else>
        <div class="py-12 text-center text-muted text-sm">
          Loading job...
        </div>
      </template>
    </UPageBody>
  </UPage>
</template>
