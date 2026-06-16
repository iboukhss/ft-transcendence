<script setup lang="ts">
import type { PasswordDTO } from '#shared/dto/password.dto.js'
import { passwordSchema } from '#shared/dto/password.dto.js'
import { emailSchema } from '#shared/dto/email.dto.js'

const toast = useToast()
const { user, fetch } = useUserSession()

const isUpdatingEmail = ref(false)
const isUpdatingPassword = ref(false)

const emailState = reactive({
  email: ''
})

const passwordState = reactive<PasswordDTO>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

async function onEmailSubmit() {
  isUpdatingEmail.value = true
  try {
    await $fetch('/api/auth/change-email', {
      method: 'PATCH',
      body: emailState
    })
    await fetch() // refresh session with new email
    toast.add({
      title: 'Success',
      description: 'Email updated successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    emailState.email = ''
  }
  catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Something went wrong',
      color: 'error',
      icon: 'i-lucide-circle-x'
    })
  }
  finally {
    isUpdatingEmail.value = false
  }
}

async function onPasswordSubmit() {
  isUpdatingPassword.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'PATCH',
      body: passwordState
    })
    toast.add({
      title: 'Success',
      description: 'Password updated successfully.',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
    passwordState.oldPassword = ''
    passwordState.newPassword = ''
    passwordState.confirmPassword = ''
  }
  catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Something went wrong',
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
      @submit="onEmailSubmit"
    >
      <UCard
        title="Email"
        description="Your email will be used for login and notifications"
      >
        <UFormField name="email">
          <UInput
            v-model="emailState.email"
            type="email"
            :placeholder="user?.email ?? 'your@email.com'"
            color="neutral"
          />
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
