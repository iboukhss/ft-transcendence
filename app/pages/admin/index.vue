<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

useHead({ title: 'Admin — LuxLink' })

const search = ref('')

const { data: users, refresh } = await useFetch('/api/admin/users', {
  query: { search }
})

const columns = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'accountType', accessorKey: 'accountType', header: 'Type' },
  { id: 'role', accessorKey: 'role', header: 'Role' },
  { id: 'createdAt', accessorKey: 'createdAt', header: 'Created' },
  { id: 'actions', header: '' }
]

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <UPage>
    <UPageBody>
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p class="text-muted mt-1 text-sm">Manage user accounts</p>
        </div>
        <UBadge color="error" variant="subtle" label="Admin access" icon="i-lucide-shield-alert" />
      </div>

      <!-- Search -->
      <div class="mb-6">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search by email..."
          class="max-w-sm"
        />
      </div>

      <!-- User table -->
      <UCard>
        <UTable
          :data="users ?? []"
          :columns="columns"
        >
          <template #accountType-cell="{ row }">
            <UBadge
              :color="row.original.accountType === 'freelancer' ? 'primary' : 'secondary'"
              variant="subtle"
              :label="row.original.accountType"
            />
          </template>

          <template #role-cell="{ row }">
            <UBadge
              :color="row.original.role === 'admin' ? 'error' : 'neutral'"
              variant="subtle"
              :label="row.original.role"
            />
          </template>

          <template #createdAt-cell="{ row }">
            {{ formatDate(row.original.createdAt) }}
          </template>

          <template #actions-cell="{ row }">
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-pencil"
              size="sm"
              :to="`/admin/users/${row.original.id}`"
            />
          </template>
        </UTable>
      </UCard>

      <p class="text-muted mt-4 text-xs">
        {{ users?.length ?? 0 }} user(s) found
      </p>
    </UPageBody>
  </UPage>
</template>
