<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { JobDTO } from '#shared/dto/job.dto'

const { data: jobs } = useFetch('/api/jobs/company')

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
    header: 'Hourly rate'
  },
  {
    accessorKey: 'duration',
    header: 'Duration'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  }
]
</script>

<template>
  <UPage>
    <UPageBody>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Job postings</h1>
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
