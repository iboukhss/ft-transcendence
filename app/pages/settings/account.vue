<script setup lang="ts">
import type { PasswordDTO } from '#shared/dto/password.dto.js'

import { passwordSchema } from '#shared/dto/password.dto.js'

const toast = useToast()

const isEditingEmail = ref(false)
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
  <div class="space-y-8">
    <header>
      <h1 class="text-xl font-semibold">Account security</h1>
      <p class="text-muted text-sm">Manage your login credentials</p>
    </header>

    <section class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold">Email</h2>
          <p class="text-muted text-sm">Your email is used for login and notifications</p>
        </div>
        <UButton
          v-if="!isEditingEmail"
          label="Change email"
          variant="subtle"
          color="neutral"
          @click="isEditingEmail = true"
        />
      </div>

      <div class="space-y-6">
        <UFormField label="Email">
          <UInput
            v-model="emailState.email"
            :disabled="!isEditingEmail"
            :variant="isEditingEmail ? 'outline' : 'subtle'"
          />
        </UFormField>

        <div v-if="isEditingEmail" class="flex justify-end gap-3 pt-2">
          <UButton
            label="Cancel"
            variant="ghost"
            color="neutral"
            @click="isEditingEmail = false"
          />
          <UButton
            label="Save"
            color="primary"
          />
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold">Password</h2>
          <p class="text-muted text-sm">Ensure your account is using a strong password</p>
        </div>
      </div>

      <UForm
        :schema="passwordSchema"
        :state="passwordState"
        class="space-y-4"
        @submit="onPasswordSubmit"
      >
        <UFormField label="Current password" name="oldPassword">
          <UInput v-model="passwordState.oldPassword" type="password" />
        </UFormField>

        <UFormField label="New password" name="newPassword">
          <UInput v-model="passwordState.newPassword" type="password" />
        </UFormField>

        <UFormField label="Confirm new password" name="confirmPassword">
          <UInput v-model="passwordState.confirmPassword" type="password" />
        </UFormField>

        <div>
          <UButton
            label="Update password"
            type="submit"
            color="primary"
            :loading="isUpdatingPassword"
          />
        </div>
      </UForm>
    </section>
  </div>
</template>
