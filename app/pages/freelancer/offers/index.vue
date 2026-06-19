<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { DashboardOfferDTO, OfferDTO } from '#shared/dto/offer.dto'

const toast = useToast()

const { data: offers, refresh } = await useFetch('/api/offers')

const columns: TableColumn<DashboardOfferDTO>[] = [
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
    id: 'actions'
  }
]

// Shoutout reddit: https://www.reddit.com/r/typescript/comments/1mvinj4/exhaustive_switch_expressions_in_typescript/n9tyv7n/

function getStatusProps(status: OfferDTO['status']) {
  switch (status) {
    case 'pending': return { color: 'warning' as const, variant: 'subtle' as const, label: 'Pending review' }
    case 'company_accepted': return { color: 'info' as const, variant: 'subtle' as const, label: 'Offer received' }
    case 'accepted': return { color: 'success' as const, variant: 'subtle' as const, label: 'Contract booked' }
    case 'company_rejected': return { color: 'error' as const, variant: 'subtle' as const, label: 'Company declined' as const }
    case 'freelancer_rejected': return { color: 'error' as const, variant: 'subtle' as const, label: 'Freelancer declined' as const }
    case 'withdrawn': return { color: 'neutral' as const, variant: 'subtle' as const, label: 'Offer withdrawn' }
    default: {
      status satisfies never
    }
  }
}

// Delete — confirmation modal
const showDeleteModal = ref(false)
const offerToDelete = ref<DashboardOfferDTO | null>(null)
const isDeleting = ref(false)

function openDeleteModal(offer: DashboardOfferDTO) {
  offerToDelete.value = offer
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!offerToDelete.value) return

  isDeleting.value = true

  try {
    await $fetch(`/api/offers/${offerToDelete.value.id}`, { method: 'DELETE' })

    toast.add({
      title: 'Application withdrawn',
      description: 'Your application has been withdrawn successfully.',
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
    await $fetch(`/api/offers/${offerId}/status`, {
      method: 'POST',
      body: { action }
    })

    await refresh()
  }
  catch (err: any) {
    alert(err.statusMessage || 'An error occured')
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
	<div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <UTable
          :data="offers ?? []"
          :columns="columns"
	class="min-w-max"
        >
          <template #empty>
            <div>
              You haven't submitted any applications yet.
            </div>
          </template>

          <template #jobTitle-cell="{ row }">
            <ULink
              :to="`/public/jobs/${row.original.jobId}`"
            >
              {{ row.original.job.title }}
            </ULink>
          </template>

          <template #proposedHourlyRate-cell="{ row }">
            <div>€{{ row.original.proposedHourlyRate }} /hr</div>
          </template>

          <template #status-cell="{ row }">
            <UBadge v-bind="getStatusProps(row.original.status)" />
          </template>

          <template #createdAt-cell="{ row }">
            {{ new Date(row.original.createdAt).toLocaleDateString() }}
          </template>

          <template #actions-header>
            <div class="text-center">Actions</div>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex w-full items-center justify-center gap-2">
              <template v-if="row.original.status === 'pending'">
                <UButton
                  label="Update"
                  icon="i-lucide-pencil"
                  variant="subtle"
                  color="neutral"
                  size="sm"
                  @click="navigateTo(`/freelancer/offers/${row.original.id}/edit`)"
                />
                <UButton
                  label="Withdraw"
                  icon="i-lucide-file-x"
                  variant="subtle"
                  color="error"
                  size="sm"
                  @click="openDeleteModal(row.original)"
                />
              </template>

              <template
                v-else-if="row.original.status === 'company_accepted'"
              >
                <UButton
                  label="Accept"
                  icon="i-lucide-check"
                  variant="subtle"
                  color="success"
                  size="sm"
                  @click="submitHandshake(row.original.id, 'accept')"
                />
                <UButton
                  label="Decline"
                  icon="i-lucide-x"
                  variant="subtle"
                  color="error"
                  size="sm"
                  @click="submitHandshake(row.original.id, 'decline')"
                />
              </template>

              <span v-else>—</span>
            </div>
          </template>
        </UTable>
	</div>
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
                <strong>{{ offerToDelete?.job?.title ?? 'this job' }}</strong>?
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
              icon="i-lucide-file-x"
              :loading="isDeleting"
              @click="confirmDelete"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UPage>
</template>
