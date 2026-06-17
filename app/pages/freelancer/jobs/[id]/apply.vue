<script setup lang="ts">
import type { CreateOfferDTO } from '#shared/dto/offer.dto'
import { createOfferSchema } from '#shared/dto/offer.dto'

const route = useRoute()
const jobId = route.params.id
const offerId = route.query.offerId ? Number(route.query.offerId) : null
const isEditing = computed(() => offerId !== null)

const toast = useToast()
const isLoading = ref(false)
const isReady = ref(false)

// Fetch job details
const { data: job, error: jobError } = await useFetch(`/api/jobs/${jobId}`)

if (jobError.value || !job.value) {
  throw createError({
    statusCode: jobError.value?.statusCode || 404,
    statusMessage: jobError.value?.statusMessage || 'Job listing not found',
    fatal: true
  })
}

// Pre-fill form with defaults
const state = reactive<CreateOfferDTO>({
  jobId: job.value.id,
  motivationLetter: '',
  proposedHourlyRate: job.value.hourlyRate
})

// If editing, fetch existing offer and populate state before rendering
if (offerId) {
  try {
    const existingOffer = await $fetch<any>(`/api/offers/${offerId}`)
    state.motivationLetter = existingOffer.motivationLetter ?? ''
    state.proposedHourlyRate = existingOffer.proposedHourlyRate ?? job.value.hourlyRate
  }
  catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Application not found',
      fatal: true
    })
  }
}

// Mark as ready — template will not render until this is true
isReady.value = true

async function onSubmit() {
  isLoading.value = true
  try {
    if (isEditing.value) {
      await $fetch(`/api/offers/freelancer/${offerId}`, {
        method: 'PATCH',
        body: {
          jobId: state.jobId,
          motivationLetter: state.motivationLetter,
          proposedHourlyRate: state.proposedHourlyRate
        }
      })
      toast.add({
        title: 'Application updated',
        description: 'Your application has been updated successfully.',
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
    }
    else {
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
    }
    await navigateTo('/freelancer/offers')
  }
  catch (err: any) {
    toast.add({
      title: isEditing.value ? 'Update failed' : 'Submission failed',
      description: err.data?.message || 'Something went wrong.',
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
        <h1 class="text-3xl font-bold tracking-tight">
          {{ isEditing ? 'Edit your application' : 'Submit your application' }}
        </h1>
        <p class="text-muted mt-1">{{ job?.title }}</p>
      </div>

      <!-- Wait until state is fully populated before rendering form -->
      <template v-if="isReady">
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

          <UFormField label="Cover letter / Intro message" name="motivationLetter">
            <UTextarea
              v-model="state.motivationLetter"
              placeholder="Introduce yourself and explain why you're a great fit for this position..."
              :rows="6"
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center gap-4">
            <UButton type="submit" :loading="isLoading">
              {{ isEditing ? 'Update application' : 'Submit application' }}
            </UButton>
            <UButton variant="ghost" color="neutral" to="/freelancer/offers">
              Cancel
            </UButton>
          </div>
        </UForm>
      </template>

      <template v-else>
        <div class="py-12 text-center text-muted text-sm">
          Loading application...
        </div>
      </template>

    </UPageBody>
  </UPage>
</template>
