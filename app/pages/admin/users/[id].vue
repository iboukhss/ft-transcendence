<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const userId = Number(route.params.id)

const { data: user, refresh } = await useFetch(`/api/admin/users/${userId}`)

useHead({ title: `Admin — ${user.value?.email ?? 'User'}` })

// Edit state — account fields
const accountState = reactive({
  email: user.value?.email ?? ''
})

// Edit state — profile fields (freelancer)
const freelancerState = reactive({
  firstName: user.value?.profile?.firstName ?? '',
  lastName: user.value?.profile?.lastName ?? '',
  bio: user.value?.profile?.bio ?? '',
  hourlyRate: user.value?.profile?.hourlyRate ?? null
})

// Edit state — profile fields (company)
const companyState = reactive({
  companyName: user.value?.profile?.companyName ?? '',
  contactFirstName: user.value?.profile?.contactFirstName ?? '',
  contactLastName: user.value?.profile?.contactLastName ?? '',
  website: user.value?.profile?.website ?? '',
  description: user.value?.profile?.description ?? ''
})

const isSaving = ref(false)

async function onSave() {
  isSaving.value = true
  try {
    const profileFields = user.value?.accountType === 'freelancer'
      ? freelancerState
      : companyState

    await $fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      body: {
        email: accountState.email,
        ...profileFields
      }
    })
    await refresh()
    toast.add({
      title: 'User updated',
      description: 'Changes saved.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err: any) {
    toast.add({
      title: 'Save failed',
      description: err.data?.message || 'Something went wrong.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isSaving.value = false
  }
}

// Delete flow — 4 guardrails
const showDeleteModal = ref(false)
const deleteConfirmEmail = ref('')
const deleteConfirmText = ref('')
const adminPassword = ref('')
const isDeleting = ref(false)

function openDeleteModal() {
  deleteConfirmEmail.value = ''
  deleteConfirmText.value = ''
  adminPassword.value = ''
  showDeleteModal.value = true
}

const deleteButtonDisabled = computed(() =>
  deleteConfirmEmail.value !== user.value?.email
  || deleteConfirmText.value !== 'DELETE'
  || !adminPassword.value
)

async function onDeleteUser() {
  isDeleting.value = true
  try {
    await $fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      body: { adminPassword: adminPassword.value }
    })
    toast.add({
      title: 'Account deleted',
      description: `Account ${user.value?.email} has been permanently deleted.`,
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    showDeleteModal.value = false
    navigateTo('/admin')
  }
  catch (err: any) {
    toast.add({
      title: 'Deletion failed',
      description: err.data?.message || 'Something went wrong.',
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
    <UPageBody class="mx-auto max-w-3xl space-y-8">
      <!-- Header -->
      <div class="mb-8 flex items-center gap-4">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          to="/admin"
          label="Back to users"
        />
      </div>

      <div class="mb-8">
        <h1 class="text-3xl font-bold">Edit User</h1>
        <div class="mt-2 flex items-center gap-2">
          <p class="text-muted text-sm">{{ user?.email }}</p>
          <UBadge
            :color="user?.accountType === 'freelancer' ? 'primary' : 'secondary'"
            variant="subtle"
            :label="user?.accountType"
          />
          <UBadge
            :color="user?.role === 'admin' ? 'error' : 'neutral'"
            variant="subtle"
            :label="user?.role"
          />
        </div>
      </div>

      <div class="space-y-8">
        <!-- Account fields -->
        <UCard title="Account" description="Login credentials and contact information">
          <div class="space-y-4">
            <UFormField label="Email" name="email">
              <UInput v-model="accountState.email" type="email" />
            </UFormField>
          </div>
        </UCard>

        <!-- Freelancer profile fields -->
        <UCard
          v-if="user?.accountType === 'freelancer'"
          title="Freelancer Profile"
          description="Public profile information"
        >
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="First name" name="firstName">
                <UInput v-model="freelancerState.firstName" />
              </UFormField>
              <UFormField label="Last name" name="lastName">
                <UInput v-model="freelancerState.lastName" />
              </UFormField>
            </div>
            <UFormField label="Bio" name="bio">
              <UTextarea v-model="freelancerState.bio" :rows="3" />
            </UFormField>
            <UFormField label="Hourly rate (€)" name="hourlyRate">
              <UInput v-model="freelancerState.hourlyRate" type="number" />
            </UFormField>
          </div>
        </UCard>

        <!-- Company profile fields -->
        <UCard
          v-if="user?.accountType === 'company'"
          title="Company Profile"
          description="Public profile information"
        >
          <div class="space-y-4">
            <UFormField label="Company name" name="companyName">
              <UInput v-model="companyState.companyName" />
            </UFormField>
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Contact first name" name="contactFirstName">
                <UInput v-model="companyState.contactFirstName" />
              </UFormField>
              <UFormField label="Contact last name" name="contactLastName">
                <UInput v-model="companyState.contactLastName" />
              </UFormField>
            </div>
            <UFormField label="Website" name="website">
              <UInput v-model="companyState.website" placeholder="https://..." />
            </UFormField>
            <UFormField label="Description" name="description">
              <UTextarea v-model="companyState.description" :rows="3" />
            </UFormField>
          </div>
        </UCard>

        <!-- Save button -->
        <div class="flex justify-end">
          <UButton
            label="Save changes"
            icon="i-lucide-save"
            :loading="isSaving"
            @click="onSave"
          />
        </div>

        <!-- Danger zone -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2 text-red-500">
              <UIcon name="i-lucide-triangle-alert" />
              <span class="font-semibold">Danger Zone</span>
            </div>
          </template>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Delete this account</p>
              <p class="text-muted mt-0.5 text-xs">
                Permanently delete {{ user?.email }} and all associated data.
              </p>
            </div>
            <UButton
              label="Delete account"
              color="error"
              variant="outline"
              icon="i-lucide-trash"
              @click="openDeleteModal"
            />
          </div>
        </UCard>
      </div>

      <!-- Delete confirmation modal — 4 guardrails -->
      <UModal v-model:open="showDeleteModal">
        <template #content>
          <div class="space-y-5 p-6">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-triangle-alert" class="mt-0.5 shrink-0 text-red-500" size="20" />
              <div>
                <h3 class="font-semibold">Delete account permanently?</h3>
                <p class="text-muted mt-1 text-sm">
                  This will permanently delete <strong>{{ user?.email }}</strong> and all
                  associated data. This action cannot be undone.
                </p>
              </div>
            </div>

            <!-- Guardrail 2 — type the user's email -->
            <UFormField
              label="Step 1 — Type the user's email"
              :hint="user?.email"
              name="confirmEmail"
            >
              <UInput
                v-model="deleteConfirmEmail"
                :placeholder="user?.email"
              />
            </UFormField>

            <!-- Guardrail 3 — type DELETE -->
            <UFormField
              label="Step 2 — Type DELETE to confirm"
              name="confirmText"
            >
              <UInput
                v-model="deleteConfirmText"
                placeholder="DELETE"
              />
            </UFormField>

            <!-- Guardrail 4 — admin password -->
            <UFormField
              label="Step 3 — Enter your admin password"
              name="adminPassword"
            >
              <UInput
                v-model="adminPassword"
                type="password"
                placeholder="Your password"
                autocomplete="current-password"
              />
            </UFormField>

            <div class="flex items-center justify-end gap-3">
              <UButton
                label="Cancel"
                variant="ghost"
                color="neutral"
                @click="showDeleteModal = false"
              />
              <UButton
                label="Permanently delete"
                color="error"
                icon="i-lucide-trash"
                :loading="isDeleting"
                :disabled="deleteButtonDisabled"
                @click="onDeleteUser"
              />
            </div>
          </div>
        </template>
      </UModal>
    </UPageBody>
  </UPage>
</template>
