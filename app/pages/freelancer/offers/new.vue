<script setup lang="ts">
import type { CreateOfferDTO } from '#shared/dto/offer.dto'

import { createOfferSchema } from '#shared/dto/offer.dto'

const route = useRoute()
const jobId = Number(route.query.jobId)

const { data: job, error } = await useFetch(`/api/jobs/${jobId}`)

if (error.value || !job.value) {
  throw createError({
    statusCode: error.value?.statusCode || 404,
    statusMessage: error.value?.statusMessage || 'Job listing not found',
    fatal: true
  })
}

const state = reactive<CreateOfferDTO>({
  jobId: job.value.id,
  motivationLetter: '',
  proposedHourlyRate: job.value.hourlyRate
})

const isLoading = ref(false)
const toast = useToast()

async function onSubmit() {
  isLoading.value = true

  try {
    await $fetch('/api/offers', {
      method: 'POST',
      body: state
    })

    toast.add({
      title: 'Application sent',
      description: 'Your application has been sent successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    await navigateTo('/freelancer/offers')
  }
  catch (err: any) {
    toast.add({
      title: 'Submission failed',
      description: err.data?.message || 'Something went wrong while sending your application.',
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
    <UPageBody>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Submit your application</h1>
        <p class="text-muted mt-1">{{ job?.title }}</p>
      </div>

      <UForm
        :schema="createOfferSchema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField label="Your proposed hourly rate" name="proposedHourlyRate">
          <UInput v-model="state.proposedHourlyRate" type="number">
            <template #leading>€</template>
            <template #trailing>/hr</template>
          </UInput>
        </UFormField>

        <UFormField label="Introduction message" name="motivationLetter">
          <UTextarea
            v-model="state.motivationLetter"
            placeholder="Introduce yourself and explain why you're a great fit for this position..."
            :rows="6"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="isLoading"
        >
          Submit application
        </UButton>
      </UForm>
    </UPageBody>
  </UPage>
</template>
