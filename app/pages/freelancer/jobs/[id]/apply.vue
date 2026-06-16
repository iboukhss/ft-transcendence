<script setup lang="ts">
import type { CreateOfferDTO } from '#shared/dto/offer.dto'

import { createOfferSchema } from '#shared/dto/offer.dto'

const route = useRoute()
const jobId = route.params.id

const { data: job } = useFetch(`/api/jobs/public/${jobId}`)

const state = reactive<CreateOfferDTO>({
  motivationLetter: '',
  proposedHourlyRate: undefined,
  proposedDuration: undefined,
  proposedWorkplace: undefined
})

const toast = useToast()
const isLoading = ref(false)

async function onSubmit() {
  isLoading.value = true

  try {
    await $fetch(`/api/offers/freelancer/${jobId}`, {
      method: 'POST',
      body: state
    })

    toast.add({
      title: 'Application sent',
      description: 'Your application has been sent successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
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
      </div>

      <UForm
        :schema="createOfferSchema"
        :state="state"
        @submit="onSubmit"
      >
        <UFormField label="Your proposed hourly rate" name="proposedHourlyRate">
          <UInput
            v-model="state.proposedHourlyRate"
            type="number"
          >
            <template #leading>€</template>
            <template #trailing>/hr</template>
          </UInput>
        </UFormField>

        <UFormField label="Cover letter / Intro message" name="motivationLetter">
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
