<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

import type { JobDTO } from '#shared/dto/job.dto'

import { JOB_CATEGORY_LABELS } from '~/utils/labels'

const toast = useToast()
const { user } = useUserSession()

const { data: jobs, refresh } = await useFetch('/api/jobs', {
  query: {
    companyId: user.value?.id,
    limit: 100
  }
})

const columns: TableColumn<JobDTO>[] = [
  {
    id: 'jobTitle',
    header: 'Job'
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
  },
  {
    id: 'actions'
  }
]

function getStatusProps(status: JobDTO['status']) {
  switch (status) {
    case 'active': return { color: 'info' as const, variant: 'subtle' as const, label: 'Active' }
    case 'paused': return { color: 'warning' as const, variant: 'subtle' as const, label: 'Paused' }
    case 'booked': return { color: 'success' as const, variant: 'subtle' as const, label: 'Booked' as const }
    case 'deleted': return { color: 'error' as const, variant: 'subtle' as const, label: 'Deleted' }
  }
}

// Delete modal
const showDeleteModal = ref(false)
const jobToDelete = ref<JobDTO | null>(null)
const isDeleting = ref(false)

function openDeleteModal(job: JobDTO) {
  jobToDelete.value = job
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (!jobToDelete.value) return

  isDeleting.value = true

  try {
    await $fetch(`/api/jobs/company/${jobToDelete.value.id}`, { method: 'DELETE' })
    toast.add({
      title: 'Job deleted',
      description: 'Job has been deleted sucessfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    showDeleteModal.value = false
    jobToDelete.value = null
    await refresh()
  }
  catch (err: any) {
    toast.add({
      title: 'Deletion failed',
      description: err.data?.message || 'Something went while deleting your job.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UPage>
    <UPageBody>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Job postings</h1>
        <UButton
          label="Post a new job"
          icon="i-lucide-plus"
          variant="subtle"
          to="/company/jobs/create"
        />
      </div>

      <UCard>
        <UTable
          :data="jobs?.items ?? []"
          :columns="columns"
        >
          <template #empty>
            <div>You haven't posted any jobs yet.</div>
          </template>

          <template #jobTitle-cell="{ row }">
            <ULink
              :to="`/public/jobs/${row.original.id}`"
            >
              {{ row.original.title }}
            </ULink>
          </template>

          <template #category-cell="{ row }">
            <div>{{ JOB_CATEGORY_LABELS[row.original.category] }}</div>
          </template>

          <template #hourlyRate-cell="{ row }">
            €{{ row.original.hourlyRate }} /hr
          </template>

          <template #duration-cell="{ row }">
            {{ row.original.duration }} month{{ row.original.duration > 1 ? 's' : '' }}
          </template>

          <template #status-cell="{ row }">
            <UBadge v-bind="getStatusProps(row.original.status)" />
          </template>

          <template #actions-header>
            <div class="text-center">Actions</div>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex w-full items-center justify-center gap-2">
              <UButton
                label="Update"
                icon="i-lucide-pencil"
                variant="subtle"
                color="neutral"
                size="sm"
                @click="navigateTo(`/company/jobs/${row.original.id}/edit`)"
              />
              <UButton
                label="Delete"
                icon="i-lucide-trash"
                variant="subtle"
                color="error"
                size="sm"
                @click="openDeleteModal(row.original)"
              />
            </div>
          </template>
        </UTable>
      </UCard>
    </UPageBody>

    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="space-y-4 p-6">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-triangle-alert" class="mt-0.5 shrink-0 text-red-500" size="20" />
            <div>
              <h3 class="font-semibold">Delete this job posting?</h3>
              <p class="text-muted mt-1 text-sm">
                Are you sure you want to permanently delete
                <strong>{{ jobToDelete?.title }}</strong>?
                This will also remove all applications received for this job.
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
              label="Delete job"
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
