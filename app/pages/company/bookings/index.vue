<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { BookingDTO, DashboardBookingDTO } from '#shared/dto/booking.dto'

const { data: bookings } = useFetch('/api/bookings')

const columns: TableColumn<DashboardBookingDTO>[] = [
  {
    accessorKey: 'id',
    header: 'Contract ID'
  },
  {
    id: 'jobTitle',
    header: 'Job'
  },
  {
    id: 'sellerName',
    header: 'Seller'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'duration',
    header: 'Duration'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'createdAt',
    header: 'Booked on'
  }
]

function getStatusProps(status: BookingDTO['status']) {
  switch (status) {
    case 'upcoming': return { color: 'info' as const, variant: 'subtle' as const, label: 'Upcoming' }
    case 'ongoing': return { color: 'success' as const, variant: 'subtle' as const, label: 'In progress' }
    case 'completed': return { color: 'success' as const, variant: 'subtle' as const, label: 'Completed' }
    case 'cancelled': return { color: 'error' as const, variant: 'subtle' as const, label: 'Cancelled' as const }
    case 'disputed': return { color: 'warning' as const, variant: 'subtle' as const, label: 'Disputed' as const }
    default: {
      status satisfies never
    }
  }
}
</script>

<template>
  <UPage>
    <UPageBody>
      <div>
        <h1 class="tracking tight text-3xl font-bold">Active contracts</h1>
      </div>

      <UCard>
        <UTable
          :data="bookings ?? []"
          :columns="columns"
        >
          <template #empty>
            <div>You don't have any active contracts yet.</div>
          </template>

          <template #jobTitle-cell="{ row }">
            <ULink
              :to="`/public/jobs/${row.original.jobId}`"
            >
              {{ row.original.job.title }}
            </ULink>
          </template>

          <template #sellerName-cell="{ row }">
            <ULink
              :to="`/public/profiles/${row.original.sellerId}`"
            >
              {{ row.original.seller.firstName }} {{ row.original.seller.lastName }}
            </ULink>
          </template>

          <template #price-cell="{ row }">
            {{ new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(row.original.price) }}
          </template>

          <template #duration-cell="{ row }">
            {{ row.original.duration }} month{{ row.original.duration > 1 ? 's' : '' }}
          </template>

          <template #status-cell="{ row }">
            <UBadge v-bind="getStatusProps(row.original.status)" />
          </template>

          <template #createdAt-cell="{ row }">
            {{ new Date(row.original.createdAt).toLocaleDateString() }}
          </template>
        </UTable>
      </UCard>
    </UPageBody>
  </UPage>
</template>
