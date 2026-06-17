<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { OfferDTO } from '#shared/dto/offer.dto'

const { data: offers, refresh } = await useFetch('/api/offers')

const columns: TableColumn<OfferDTO>[] = [
  {
    id: 'jobTitle',
    header: 'Job'
  },
  {
    accessorKey: 'proposedHourlyRate',
    header: 'Proposed hourly rate'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'createdAt',
    header: 'Submitted on'
  },
  {
    id: 'actions',
    header: 'Actions'
  }
]

const toast = useToast()

const { data: jobs } = await useFetch('/api/jobs')

const jobTitleMap = computed(() => {
  if (!jobs.value) return {}
  return Object.fromEntries(jobs.value.map((j: any) => [j.id, j.title]))
})

// Edit — navigate programmatically
function onEdit(offer: OfferDTO) {
  navigateTo(`/freelancer/jobs/${offer.jobId}/apply?offerId=${offer.id}`)
}

// Delete — confirmation modal
const showDeleteModal = ref(false)
const offerToDelete = ref<number | null>(null)
const isDeleting = ref(false)

function openDeleteModal(offerId: number) {
  offerToDelete.value = offerId
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!offerToDelete.value) return
  isDeleting.value = true
  try {
    await $fetch(`/api/offers/freelancer/${offerToDelete.value}`, { method: 'DELETE' })
    toast.add({
      title: 'Application withdrawn',
      description: 'Your application has been successfully withdrawn.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    showDeleteModal.value = false
    offerToDelete.value = null
    await refresh()
  }
  catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Something went wrong.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isDeleting.value = false
  }
}

async function submitHandshake(offerId: number, action: 'accept' | 'decline') {
  try {
    await $fetch(`/api/offers/${offerId}`, {
      method: 'PATCH',
      body: { action }
    })

    await refresh()
  }
  catch (err: any) {
    alert(err.statusMessage || 'An error occured')
  }
}

function getStatusProps(status: OfferDTO['status']) {
  switch (status) {
    case 'pending': return { color: 'primary' as const, variant: 'subtle' as const, label: 'Pending review' }
    case 'company_accepted': return { color: 'warning' as const, variant: 'subtle' as const, label: 'Action required' }
    case 'accepted': return { color: 'success' as const, variant: 'subtle' as const, label: 'Contract booked' }
    case 'rejected': return { color: 'error' as const, variant: 'subtle' as const, label: 'Declined' as const }
    case 'withdrawn': return { color: 'neutral' as const, variant: 'subtle' as const, label: 'Withdrawn' }
  }
}
</script>

<template>
  <UPage>
    <UPageBody>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Your applications</h1>
      </div>

      <UCard>
        <UTable
          :data="offers ?? []"
          :columns="columns"
        >
          <template #empty-state>
            <div class="text-muted text-sm italic">
              You haven't submitted any applications yet.
            </div>
          </template>

          <template #jobTitle-cell="{ row }">
            <span class="font-medium">
              {{ jobTitleMap[row.original.jobId] ?? `Job #${row.original.jobId}` }}
            </span>
          </template>

          <template #proposedHourlyRate-cell="{ row }">
            €{{ row.original.proposedHourlyRate }}/hr
          </template>

          <template #status-cell="{ row }">
            <UBadge v-bind="getStatusProps(row.original.status)" />
          </template>

          <template #createdAt-cell="{ row }">
            {{ new Date(row.original.createdAt).toLocaleDateString() }}
          </template>

          <template #actions-cell="{ row }">
            <div
              class="flex items-center gap-2"
            >
              <template v-if="row.original.status === 'pending'">
                <UButton
                  variant="solid"
                  color="success"
                  icon="i-lucide-pencil"
                  size="sm"
                  label="Update"
                  @click="onEdit(row.original)"
                />
                <UButton
                  variant="outline"
                  color="error"
                  icon="i-lucide-trash"
                  size="sm"
                  label="Delete"
                  @click="openDeleteModal(row.original.id)"
                />
              </template>
              <template
                v-else-if="row.original.status === 'company_accepted'"
              >
                <UButton
                  icon="i-heroicons-check-circle-20-solid"
                  color="success"
                  variant="ghost"
                  square
                  @click="submitHandshake(row.original.id, 'accept')"
                />
                <UButton
                  icon="i-heroicons-x-circle-20-solid"
                  color="error"
                  variant="ghost"
                  square
                  @click="submitHandshake(row.original.id, 'decline')"
                />
              </template>

              <span v-else class="pl-3 text-xs text-neutral-400">—</span>
            </div>
          </template>
        </UTable>
      </UCard>
    </UPageBody>

    <!-- Delete confirmation modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="space-y-4 p-6">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-triangle-alert" class="mt-0.5 shrink-0 text-red-500" size="20" />
            <div>
              <h3 class="font-semibold">Withdraw this application?</h3>
              <p class="text-muted mt-1 text-sm">
                Are you sure you want to withdraw your application for
                <strong>{{ jobTitleMap[offers?.find(o => o.id === offerToDelete)?.jobId ?? 0] ?? 'this job' }}</strong>?
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3">
            <UButton
              label="Cancel"
              variant="ghost"
              color="neutral"
              @click="showDeleteModal = false"
            />
            <UButton
              label="Withdraw application"
              color="error"
              icon="i-lucide-trash"
              :loading="isDeleting"
              @click="confirmDelete"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UPage>
</template>
