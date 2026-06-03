<script setup lang="ts">
import type { PasswordDTO } from '#shared/dto/password.dto.js'

import { passwordSchema } from '#shared/dto/password.dto.js'

const toast = useToast()

const isUpdatingPassword = ref(false)

const emailState = ref({
  email: 'jane@example.com'
})

const passwordState = reactive<PasswordDTO>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

async function onPasswordSubmit() {
  isUpdatingPassword.value = true

  try {
    await $fetch('/api/auth/change-password', {
      method: 'PUT',
      body: passwordState
    })

    toast.add({
      title: 'Success',
      description: 'Password updated sucessfully.',
      color: 'success'
    })
  }
  catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Something went wrong',
      color: 'error'
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

    <UForm>
      <UCard
        title="Email"
        description="Your email will be used for login and notifications"
      >
        <UFormField>
          <UInput v-model="emailState.email" />
        </UFormField>

        <template #footer>
          <UButton
            type="submit"
            label="Change email"
            variant="outline"
          />
        </template>
      </UCard>
    </UForm>

    <UForm
      :schema="passwordSchema"
      :state="passwordState"
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
