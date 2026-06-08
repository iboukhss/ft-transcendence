<script setup lang="ts">
const toast = useToast()
const confirmText = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()

async function onDeleteAccount() {
  isLoading.value = true
  try {
    await $fetch('/api/account', {
      method: 'DELETE',
      body: { password: password.value }
    })
    toast.add({
      title: 'Account deleted',
      description: 'Your account has been permanently deleted.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    router.push('/')
  }
  catch (err: any) {
    toast.add({
      title: 'Deletion failed',
      description: err.data?.message || 'Something went wrong. Please try again.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UPageBody class="space-y-8">
    <div class="px-2 text-3xl font-bold tracking-tight">
      <h1>Delete Account</h1>
    </div>

    <!-- Warning card -->
    <UCard>
      <div class="flex items-start gap-4">
        <UIcon
          name="i-lucide-triangle-alert"
          class="text-red-500 mt-0.5 shrink-0"
          size="24"
        />
        <div class="space-y-2 text-sm">
          <p class="font-semibold text-red-500">
            This action is permanent and cannot be undone.
          </p>
          <p class="text-muted">
            Deleting your account will immediately remove:
          </p>
          <ul class="list-disc pl-5 space-y-1 text-muted">
            <li>Your profile and all personal information</li>
            <li>All job offers you have posted or applied to</li>
            <li>All bookings and offers associated with your account</li>
            <li>Your account credentials and session</li>
          </ul>
          <p class="text-muted">
            In accordance with our
            <ULink to="/privacy" class="text-primary underline">Privacy Policy</ULink>,
            certain data may be retained for up to 3 years as required by Luxembourg law.
          </p>
        </div>
      </div>
    </UCard>

    <!-- Confirmation form -->
    <UCard
      title="Confirm deletion"
      description="Please complete both steps below to permanently delete your account."
    >
      <div class="space-y-6">

        <!-- Step 1: type DELETE -->
        <UFormField
          label="Step 1 — Type DELETE to confirm"
          name="confirmText"
          :hint="`Type the word DELETE in capitals`"
        >
          <UInput
            v-model="confirmText"
            placeholder="DELETE"
            :color="confirmText && confirmText !== 'DELETE' ? 'error' : 'neutral'"
          />
          <template #help>
            <span
              v-if="confirmText && confirmText !== 'DELETE'"
              class="text-red-500 text-xs"
            >
              Please type DELETE exactly as shown
            </span>
          </template>
        </UFormField>

        <!-- Step 2: enter password -->
        <UFormField
          label="Step 2 — Enter your password"
          name="password"
        >
          <UInput
            v-model="password"
            type="password"
            placeholder="Your current password"
            autocomplete="current-password"
          />
        </UFormField>

      </div>

      <template #footer>
        <div class="flex items-center justify-start gap-6">
          <ULink to="/settings" class="text-sm text-muted hover:text-primary">
            Cancel
          </ULink>
          <UButton
            #block
		class="w-72"
		label="Permanently delete my account"
            :loading="isLoading"
            :disabled="isLoading || confirmText !== 'DELETE' || !password"
            color="error"
            icon="i-lucide-trash"
            @click="onDeleteAccount"
          >
            Permanently delete my account
          </UButton>
        </div>
      </template>
    </UCard>

  </UPageBody>
</template>
