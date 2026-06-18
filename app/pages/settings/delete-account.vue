<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()
const isLoading = ref(false)
const { clear } = useUserSession()
//const router = useRouter()

const schema = z.object({
  confirmText: z.literal('DELETE', {
    errorMap: () => ({ message: 'Please type DELETE exactly as shown' })
  }),
  password: z.string().min(1, 'Password is required')
})

type Schema = z.infer<typeof schema>

const state = reactive<Partial<Schema>>({
  confirmText: '',
  password: ''
})

async function onDeleteAccount() {
  isLoading.value = true
  try {
    await $fetch('/api/account', {
      method: 'DELETE',
      body: { password: state.password }
    })
    toast.add({
      title: 'Account deleted',
      description: 'Your account has been permanently deleted.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    await clear()
    navigateTo('/')
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
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onDeleteAccount"
      >
        <!-- Step 1: type DELETE -->
        <UFormField
          label="Step 1 — Type DELETE to confirm"
          name="confirmText"
          hint="Type the word DELETE in capitals"
        >
          <UInput
            v-model="state.confirmText"
            placeholder="DELETE"
          />
        </UFormField>

        <!-- Step 2: enter password -->
        <UFormField
          label="Step 2 — Enter your password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Your current password"
            autocomplete="current-password"
          />
        </UFormField>

        <div class="flex items-center justify-start gap-4">
          <UButton
            type="submit"
            label="Permanently delete my account"
            :loading="isLoading"
            color="error"
            icon="i-lucide-trash"
          />
          <UButton
            variant="solid"
            color="neutral"
            :ui="{
              base: 'bg-white/90 text-neutral-900 hover:bg-white/80 dark:bg-neutral-100/85 dark:text-neutral-900'
            }"
            to="/settings"
          >
            Cancel
          </UButton>
        </div>
      </UForm>
    </UCard>

  </UPageBody>
</template>
