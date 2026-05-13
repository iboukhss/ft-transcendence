<script setup lang="ts">
import type { SelectMenuItem, RadioGroupItem } from '@nuxt/ui'

import type { JobDTO } from '#shared/dto/job.dto'

import { JOB_CATEGORY_KEYS, WORKPLACE_KEYS, SKILL_KEYS } from '#shared/constants/enums'
import { jobSchema } from '#shared/dto/job.dto'
import { JOB_CATEGORY_LABELS, SKILL_LABELS, WORKPLACE_LABELS } from '~/utils/labels'

const state = reactive<Partial<JobDTO>>({
  title: '',
  category: undefined,
  skills: [],
  duration: 3,
  hourlyRate: undefined,
  workplace: undefined,
  description: ''
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
</script>

<template>
  <div class="flex flex-1 flex-col items-center px-4">
    <div class="w-full max-w-lg space-y-6">
      <header class="text-center">
        <h2 class="text-xl font-bold">Post a new job</h2>
      </header>

      <USeparator />

      <UForm :schema="jobSchema" :state="state" class="space-y-6">
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

        <UFormField :label="`Duration: ${state.duration} months`" name="durationMonths">
          <USlider
            v-model="state.duration"
            :min="1" :max="12" :step="1"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Budget" name="rate">
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

        <UButton type="submit" block size="lg">
          Post Job
        </UButton>
      </UForm>
    </div>
  </div>
</template>
