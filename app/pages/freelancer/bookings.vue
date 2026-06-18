<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { JobDTO } from '#shared/dto/job.dto'

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

const columns: TableColumn<JobDTO>[] = [
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
        <UTable
          :data="jobs ?? []"
          :columns="columns"
        />
      </UCard>
    </UPageBody>
  </UPage>
</template>
