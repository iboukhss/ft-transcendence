<script setup lang="ts">
import type { LoginDTO } from '#shared/dto/login.dto'
import type { FormSubmitEvent } from '@nuxt/ui'

import { loginSchema } from '#shared/dto/login.dto'

const state = reactive({
  email: '',
  password: '',
  remember: false
})

const toast = useToast()
const isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<LoginDTO>) {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data
    })

    toast.add({
      title: 'Success',
      description: 'Welcome back!',
      color: 'success'
    })

    await navigateTo('/')
  }
  catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Invalid credentials',
      color: 'error'
    })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center py-12 px-4">
    <div class="w-full max-w-lg space-y-6">
      <header class="text-center">
        <h2 class="text-xl font-bold">Welcome Back</h2>
        <p class="text-sm text-muted">Enter your credentials to access your LuxLink account.</p>
      </header>

      <USeparator />

      <UForm :schema="loginSchema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" placeholder="jane@example.com" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>

        <UCheckbox v-model="state.remember" label="Remember me" />

        <UButton type="submit" :loading="isLoading" :disabled="isLoading" block size="lg">
          Log In
        </UButton>
      </UForm>
    </div>
  </div>
</template>
