<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { OfferDTO } from '#shared/dto/offer.dto'

const { data: offers } = await useFetch('/api/offers')

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
    header: 'Submitted on'
  }
]
</script>

<template>
  <UPage>
    <UPageBody>
      <div>
        <h1 class="tracking tight text-3xl font-bold">Your applications</h1>
      </div>

      <UCard>
        <UTable
          :data="offers ?? []"
          :columns="columns"
        />
      </UCard>
    </UPageBody>
  </UPage>
</template>
