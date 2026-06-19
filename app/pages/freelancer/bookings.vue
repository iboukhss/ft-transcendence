<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { COUNTRY_LABELS, WORKPLACE_LABELS } from '~/utils/labels'

const { data: rawJobs } = useFetch('/api/profiles/freelancer-contracts')

const jobs = computed(() => {
  if (!rawJobs.value)
    return []
  return rawJobs.value
    .filter(row => row.status === 'booked')
    .map(row => ({
      ...row,
      locationExpanded: COUNTRY_LABELS[row.location as keyof typeof COUNTRY_LABELS] ?? row.location,
      workplaceClean: WORKPLACE_LABELS[row.workplace as keyof typeof WORKPLACE_LABELS] ?? row.workplace
    }))
})

const columns: TableColumn<any>[] = [
  {
    accessorKey: 'companyName',
    header: 'Company'
  },
  {
    accessorKey: 'title',
    header: 'Job title'
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'hourlyRate',
    header: 'Hourly rate (€)'
  },
  {
    accessorKey: 'duration',
    header: 'Duration (Months)'
  },
  {
    accessorKey: 'locationExpanded',
    header: 'Location'
  },
  {
    accessorKey: 'workplaceClean',
    header: 'Workplace'
  }
]
</script>

<template>
  <UPage>
    <UPageBody>
      <div>
        <h1 class="tracking tight text-3xl font-bold">My active contracts</h1>
      </div>

      <UCard>
        <div class="overflow-x-auto">
          <UTable
            :data="jobs ?? []"
            :columns="columns"
            class="min-w-max"
          />
        </div>

        <div v-if="!jobs?.length" class="py-8 text-center text-muted text-sm">
          You don't have any active contracts yet.
        </div>
      </UCard>
    </UPageBody>
  </UPage>
</template>
