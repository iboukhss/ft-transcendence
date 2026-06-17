<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { OfferDTO } from '#shared/dto/offer.dto'

const { data: offers, refresh } = await useFetch('/api/offers')

const columns: TableColumn<OfferDTO>[] = [
  {
    accessorKey: 'jobId',
    header: 'Job ID'
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
    id: 'actions',
    header: 'Actions'
  }
]

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
        <h1 class="text-3xl font-bold tracking-tight">Received applications</h1>
      </div>

      <UCard>
        <UTable
          :data="offers?? []"
          :columns="columns"
        >
          <template #status-cell="{ row }">
            <UBadge
              v-bind="getStatusProps(row.original.status)"
            />
          </template>

          <template #actions-cell="{ row }">
            <div
              v-if="row.original.status === 'pending'"
              class="flex items-center gap-2"
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
            </div>

            <span v-else class="pl-3 text-xs text-neutral-400">—</span>
          </template>
        </UTable>
      </UCard>
    </UPageBody>
  </UPage>
</template>
