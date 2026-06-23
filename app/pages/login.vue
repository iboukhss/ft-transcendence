<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

import type { LoginDTO } from '#shared/dto/login.dto'

import { loginSchema } from '#shared/dto/login.dto'

const route = useRoute()

const state = reactive({
  email: '',
  password: '',
  remember: false
})

const toast = useToast()
const isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<LoginDTO>) {
  isLoading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data
    })

    // NOTE(isma): Had a race condition where the UI didn't update after login
    const { fetch: refreshSession } = useUserSession()
    await refreshSession()

    toast.add({
      title: 'Logged in',
      description: 'Welcome back!',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })

    const destination = (route.query.redirectTo as string) || '/'

    await navigateTo(destination)
  }
  catch (err: any) {
    toast.add({
      title: 'Login failed',
      description: err.data?.message || 'Invalid credentials.',
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
  <UPage>
    <UPageBody class="mx-auto max-w-xl space-y-8">
      <header class="space-y-1.5 text-center">
        <h2 class="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p class="text-muted text-sm">Enter your credentials to access your LuxLink account.</p>
      </header>

      <USeparator />

      <UForm
        :schema="loginSchema"
        :state="state"
        :validate-on="[]"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" placeholder="jane@example.com" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>

        <UCheckbox v-model="state.remember" label="Remember me" />

        <UButton
          type="submit"
          :loading="isLoading"
          :disabled="isLoading"
          size="lg"
          block
        >
          Log In
        </UButton>
      </UForm>
    </UPageBody>
  </UPage>
</template>
