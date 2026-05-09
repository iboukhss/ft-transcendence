<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem, SelectMenuItem } from '@nuxt/ui'

import type { RegisterDTO } from '#shared/dto/register.dto'

import { COUNTRY_KEYS, ACCOUNT_TYPE_KEYS } from '#shared/constants/enums'
import { registerSchema } from '#shared/dto/register.dto'
import { ACCOUNT_TYPE_INFO, COUNTRY_LABELS } from '~/utils/labels'

// Good read: https://ui.nuxt.com/docs/components/form

// Partial makes every property in Schema optional (T | undefined)
const state = reactive<Partial<RegisterDTO>>({
  accountType: 'freelancer',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  country: undefined
})

const accountOptions: RadioGroupItem[] = ACCOUNT_TYPE_KEYS.map(k => ({
  id: k,
  label: ACCOUNT_TYPE_INFO[k].label,
  description: ACCOUNT_TYPE_INFO[k].description
}))

const countryOptions: SelectMenuItem[] = COUNTRY_KEYS.map(k => ({
  key: k,
  label: COUNTRY_LABELS[k]
}))

const toast = useToast()
const isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<RegisterDTO>) {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: event.data
    })

    toast.add({
      title: 'Created',
      description: 'Welcome to LuxLink!',
      color: 'success'
    })

    await navigateTo('/')
  }
  catch (err: any) {
    toast.add({
      title: 'Registration failed',
      description: err.data?.message || 'Something went wrong',
      color: 'error'
    })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center px-4">
    <div class="w-full max-w-xl space-y-6">
      <header class="text-center">
        <h2 class="text-xl font-bold">Register</h2>
        <p class="text-muted text-sm">Create your LuxLink account.</p>
      </header>

      <USeparator />

      <UForm :schema="registerSchema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField name="accountType">
          <URadioGroup v-model="state.accountType" value-key="id" :items="accountOptions" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="First name" name="firstName">
            <UInput v-model="state.firstName" placeholder="Jane" class="w-full" />
          </UFormField>

          <UFormField label="Last name" name="lastName">
            <UInput v-model="state.lastName" placeholder="Doe" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" placeholder="jane@example.com" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>

        <UFormField label="Country" name="country">
          <USelectMenu
            v-model="state.country"
            value-key="key"
            placeholder="Select country"
            :items="countryOptions"
            :search-input="false"
            class="w-full" />
        </UFormField>

        <UButton type="submit" block :loading="isLoading" :disabled="isLoading" size="lg">
          Create Account
        </UButton>
      </UForm>
    </div>
  </div>
</template>
