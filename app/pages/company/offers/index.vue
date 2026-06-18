<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { DashboardOfferDTO, OfferDTO } from '#shared/dto/offer.dto'

const { data: offers, refresh } = await useFetch('/api/offers')

const columns: TableColumn<DashboardOfferDTO>[] = [
  {
    id: 'applicant',
    header: 'Applicant'
  },
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
    header: 'Received on'
  },
  {
    id: 'actions'
  }
]

function getStatusProps(status: OfferDTO['status']) {
  switch (status) {
    case 'pending': return { color: 'warning' as const, variant: 'subtle' as const, label: 'Pending review' }
    case 'company_accepted': return { color: 'info' as const, variant: 'subtle' as const, label: 'Awaiting response' }
    case 'accepted': return { color: 'success' as const, variant: 'subtle' as const, label: 'Contract booked' }
    case 'rejected': return { color: 'error' as const, variant: 'subtle' as const, label: 'Offer declined' as const }
    case 'withdrawn': return { color: 'neutral' as const, variant: 'subtle' as const, label: 'Offer withdrawn' }
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
</script>

<template>
  <UPage>
    <UPageBody>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Received applications</h1>
      </div>

      <UCard>
        <UTable
          :data="offers?? []"
          :columns="columns"
        >
          <template #empty>
            <div>
              No applications received yet.
            </div>
          </template>

          <template #applicant-cell="{ row }">
            <ULink :to="`/public/profiles/${row.original.sellerId}`">
              {{ row.original.seller?.firstName }} {{ row.original.seller?.lastName }}
            </ULink>
          </template>

          <template #jobTitle-cell="{ row }">
            <ULink :to="`/public/jobs/${row.original.jobId}`">
              {{ row.original.job.title }}
            </ULink>
          </template>

          <template #proposedHourlyRate-cell="{ row }">
            €{{ row.original.proposedHourlyRate }} /hr
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
              <template
                v-if="row.original.status === 'pending'"
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
      </UCard>
    </UPageBody>
  </UPage>
</template>
