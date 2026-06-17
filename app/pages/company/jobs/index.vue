<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { JobDTO } from '#shared/dto/job.dto'

const toast = useToast()
const { user } = useUserSession()

const { data: jobs, refresh } = await useFetch('/api/jobs', {
  query: { userId: user.value?.id ?? undefined }
})

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
      description: `"${jobToDelete.value.title}" has been permanently deleted.`,
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    showDeleteModal.value = false
    jobToDelete.value = null
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

const columns: TableColumn<JobDTO>[] = [
  { accessorKey: 'title', header: 'Job title' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'hourlyRate', header: 'Hourly rate' },
  { accessorKey: 'duration', header: 'Duration' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: 'Actions' }
]
</script>

<template>
  <UPage>
    <UPageBody>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Job postings</h1>
        <UButton
          label="Post a new job"
          icon="i-lucide-plus"
          to="/company/jobs/create"
        />
      </div>

      <UCard>
        <UTable :data="jobs ?? []" :columns="columns">
          <template #hourlyRate-cell="{ row }">
            €{{ row.original.hourlyRate }}/hr
          </template>

          <template #duration-cell="{ row }">
            {{ row.original.duration }} month{{ row.original.duration > 1 ? 's' : '' }}
          </template>

          <template #status-cell="{ row }">
            <UBadge
              :color="row.original.status === 'active' ? 'success' : 'neutral'"
              variant="subtle"
              :label="row.original.status"
            />
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton
                variant="solid"
                color="success"
                icon="i-lucide-pencil"
                size="sm"
                label="Update"
                @click="navigateTo(`/company/jobs/${row.original.id}/edit`)"
              />
              <UButton
                variant="outline"
                color="error"
                icon="i-lucide-trash"
                size="sm"
                label="Delete"
                @click="openDeleteModal(row.original)"
              />
            </div>
          </template>
        </UTable>

        <div v-if="!jobs?.length" class="py-8 text-center text-muted text-sm">
          You haven't posted any jobs yet.
        </div>
      </UCard>
    </UPageBody>

    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-triangle-alert" class="text-red-500 mt-0.5 shrink-0" size="20" />
            <div>
              <h3 class="font-semibold">Delete this job posting?</h3>
              <p class="text-muted text-sm mt-1">
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
