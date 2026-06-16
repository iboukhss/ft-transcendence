<script setup lang="ts">
import type { SelectMenuItem, RadioGroupItem } from '@nuxt/ui'

import type { CreateJobDTO } from '#shared/dto/job.dto'

import { JOB_CATEGORY_KEYS, WORKPLACE_KEYS, SKILL_KEYS, COUNTRY_KEYS } from '#shared/constants/enums'
import { createJobSchema } from '#shared/dto/job.dto'
import { JOB_CATEGORY_LABELS, SKILL_LABELS, WORKPLACE_LABELS, COUNTRY_LABELS } from '~/utils/labels'

const state = reactive<Partial<CreateJobDTO>>({
  title: '',
  category: undefined,
  skills: [],
  duration: 3,
  hourlyRate: undefined,
  workplace: undefined,
  description: '',
  status: 'active',
  location: undefined
})

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

const toast = useToast()
const isLoading = ref(false)

async function onSubmit() {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    await $fetch('/api/jobs', {
      method: 'POST',
      body: state
    })

    await navigateTo('/company/jobs')

    toast.add({
      title: 'Job posted',
      description: 'Your job has been posted successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Something went wrong while posting your job.',
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
  <Upage>
    <UPageBody class="mx-auto max-w-xl space-y-8">
      <header class="text-center">
        <h2 class="text-3xl font-bold tracking-tight">Post a new job</h2>
      </header>

      <USeparator />

      <UForm
        :schema="createJobSchema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
        @error="(event) => console.log('Validation errors:', event.errors)"
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
            placeholder="15.00"
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

        <UFormField
          label="Job description"
          name="description"
        >
          <UTextarea
            v-model="state.description"
            placeholder="Write something..."
            :rows="5"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" block size="lg" :loading="isLoading">
          Post Job
        </UButton>
      </UForm>
    </UPageBody>
  </UPage>
</template>
