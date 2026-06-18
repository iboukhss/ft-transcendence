<script setup lang="ts">
import type { UpdateOfferDTO } from '#shared/dto/offer.dto'

import { updateOfferSchema } from '#shared/dto/offer.dto'

const route = useRoute()
const offerId = Number(route.params.id)

const toast = useToast()
const isLoading = ref(false)

const { data: offer, error } = await useFetch(`/api/offers/${offerId}`)

if (error.value || !offer.value) {
  throw createError({
    statusCode: error.value?.statusCode || 404,
    statusMessage: error.value?.statusMessage || 'Application not found',
    fatal: true
  })
}

const state = reactive<UpdateOfferDTO>({
  motivationLetter: offer.value.motivationLetter,
  proposedHourlyRate: offer.value.proposedHourlyRate
})

async function onSubmit() {
  isLoading.value = true

  try {
    await $fetch(`/api/offers/${offerId}`, {
      method: 'PATCH',
      body: state
    })

    toast.add({
      title: 'Application updated',
      description: 'Your application has been updated successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    await navigateTo('/freelancer/offers')
  }
  catch (err: any) {
    toast.add({
      title: 'Update failed',
      description: err.data?.message || 'Something went wrong while updating your application.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isLoading.value = true
  }
}
</script>

<template>
  <UPage>
    <UPageBody>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Submit your application</h1>
        <p class="text-muted mt-1">{{ offer?.job.title }}</p>
      </div>

      <UForm
        :schema="updateOfferSchema"
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
