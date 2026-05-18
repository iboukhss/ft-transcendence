<script setup lang="ts">
import type { FormSubmitEvent, RadioGroupItem, SelectMenuItem } from '@nuxt/ui'

import type { RegisterDTO } from '#shared/dto/register.dto'

import { COUNTRY_KEYS, ACCOUNT_TYPE_KEYS } from '#shared/constants/enums'
import { registerSchema } from '#shared/dto/register.dto'
import { ACCOUNT_TYPE_INFO, COUNTRY_LABELS } from '~/utils/labels'

const accountTypeOptions: RadioGroupItem[] = ACCOUNT_TYPE_KEYS.map(k => ({
  id: k,
  label: ACCOUNT_TYPE_INFO[k].label,
  description: ACCOUNT_TYPE_INFO[k].description
}))

const countryOptions: SelectMenuItem[] = COUNTRY_KEYS.map(k => ({
  key: k,
  label: COUNTRY_LABELS[k]
}))

const accountType = ref('freelancer')

const freelancerState = reactive<Extract<RegisterDTO, { accountType: 'freelancer' }>>({
  accountType: 'freelancer',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  country: undefined
})

const companyState = reactive<Extract<RegisterDTO, { accountType: 'company' }>>({
  accountType: 'company',
  email: '',
  password: '',
  contactFirstName: '',
  contactLastName: '',
  companyName: '',
  country: undefined
})

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

      <UFormField>
        <URadioGroup v-model="accountType" value-key="id" :items="accountTypeOptions" />
      </UFormField>

      <UForm
        v-if="accountType === 'freelancer'"
        :schema="registerSchema"
        :state="freelancerState"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="First name" name="firstName">
            <UInput v-model="freelancerState.firstName" placeholder="Jane" class="w-full" />
          </UFormField>

          <UFormField label="Last name" name="lastName">
            <UInput v-model="freelancerState.lastName" placeholder="Doe" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Email" name="email">
          <UInput v-model="freelancerState.email" placeholder="jane@example.com" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="freelancerState.password" type="password" class="w-full" />
        </UFormField>

        <UFormField label="Country" name="country">
          <USelectMenu
            v-model="freelancerState.country"
            value-key="key"
            placeholder="Select country"
            :items="countryOptions"
            :search-input="false"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" block :loading="isLoading" :disabled="isLoading" size="lg">
          Create Account
        </UButton>
      </UForm>

      <UForm
        v-else
        :schema="registerSchema"
        :state="companyState"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="First name" name="contactFirstName">
            <UInput v-model="companyState.contactFirstName" placeholder="John" class="w-full" />
          </UFormField>

          <UFormField label="Last name" name="contactLastName">
            <UInput v-model="companyState.contactLastName" placeholder="Smith" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Company name" name="companyName">
          <UInput v-model="companyState.companyName" placeholder="Acme Corporation" class="w-full" />
        </UFormField>

        <UFormField label="Work email" name="email">
          <UInput v-model="companyState.email" placeholder="js@acme.com" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="companyState.password" type="password" class="w-full" />
        </UFormField>

        <UFormField label="Country" name="country">
          <USelectMenu
            v-model="companyState.country"
            value-key="key"
            placeholder="Select country"
            :items="countryOptions"
            :search-input="false"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" block :loading="isLoading" :disabled="isLoading" size="lg">
          Create Account
        </UButton>
      </UForm>
    </div>
  </div>
</template>
