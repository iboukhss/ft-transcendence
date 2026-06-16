<script setup lang="ts">
import type { EmailDTO } from '#shared/dto/email.dto'
import type { PasswordDTO } from '#shared/dto/password.dto'

import { emailSchema } from '#shared/dto/email.dto'
import { passwordSchema } from '#shared/dto/password.dto'

const { user, fetch: fetchUserSession } = useUserSession()
const toast = useToast()

const emailState = reactive<EmailDTO>({
  email: user.value?.email ?? ''
})

const isUpdatingEmail = ref(false)

async function onEmailSubmit() {
  isUpdatingEmail.value = true

  try {
    await $fetch('/api/auth/change-email', {
      method: 'PATCH',
      body: emailState
    })

    await fetchUserSession()

    toast.add({
      title: 'Email updated',
      description: 'Your email has been updated successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err: any) {
    toast.add({
      title: 'Update failed',
      description: err.data?.message || 'Something went wrong while updating your email.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isUpdatingEmail.value = false
  }
}

const passwordState = reactive<PasswordDTO>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isUpdatingPassword = ref(false)

async function onPasswordSubmit() {
  isUpdatingPassword.value = true

  try {
    await $fetch('/api/auth/change-password', {
      method: 'PATCH',
      body: passwordState
    })

    passwordState.oldPassword = ''
    passwordState.newPassword = ''
    passwordState.confirmPassword = ''

    toast.add({
      title: 'Password updated',
      description: 'Your password has been updated successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  }
  catch (err: any) {
    toast.add({
      title: 'Update failed',
      description: err.data?.message || 'Something went wrong while updating your password.',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isUpdatingPassword.value = false
  }
}
</script>

<template>
  <UPageBody class="space-y-8">
    <div class="px-2 text-3xl font-bold tracking-tight">
      <h1>Account security</h1>
    </div>

    <UForm
      :schema="emailSchema"
      :state="emailState"
      :validate-on="[]"
      @submit="onEmailSubmit"
    >
      <UCard
        title="Email"
        description="Your email will be used for login and notifications"
      >
        <UFormField label="New email" name="email">
          <UInput v-model="emailState.email" />
        </UFormField>

        <template #footer>
          <UButton
            type="submit"
            label="Change email"
            variant="outline"
            :loading="isUpdatingEmail"
          />
        </template>
      </UCard>
    </UForm>

    <UForm
      :schema="passwordSchema"
      :state="passwordState"
      :validate-on="[]"
      @submit="onPasswordSubmit"
    >
      <UCard
        title="Password"
        description="Make sure to use a strong password"
      >
        <div class="space-y-4">
          <UFormField label="Current password" name="oldPassword">
            <UInput v-model="passwordState.oldPassword" type="password" />
          </UFormField>

          <UFormField label="New password" name="newPassword">
            <UInput v-model="passwordState.newPassword" type="password" />
          </UFormField>

          <UFormField label="Confirm new password" name="confirmPassword">
            <UInput v-model="passwordState.confirmPassword" type="password" />
          </UFormField>
        </div>

        <template #footer>
          <UButton
            type="submit"
            label="Update password"
            variant="outline"
            :loading="isUpdatingPassword"
          />
        </template>
      </UCard>
    </UForm>
  </UPageBody>
</template>
