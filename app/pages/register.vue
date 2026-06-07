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
const agreedToTerms = ref(false)
const isAdult = ref(false)

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
  <UPage>
    <UPageBody class="mx-auto max-w-xl space-y-8">
      <header class="space-y-1.5 text-center">
        <h2 class="text-3xl font-bold tracking-tight">Register</h2>
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
          <UFormField label="First name" name="firstName" required>
            <UInput v-model="freelancerState.firstName" placeholder="Jane" class="w-full" />
          </UFormField>

          <UFormField label="Last name" name="lastName" required>
            <UInput v-model="freelancerState.lastName" placeholder="Doe" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Email" name="email" required>
          <UInput v-model="freelancerState.email" placeholder="jane@example.com" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password" required>
          <UInput v-model="freelancerState.password" type="password" placeholder="Password (8 or more characters)" class="w-full" />
        </UFormField>

        <UFormField label="Country" name="country" required>
          <USelectMenu
            v-model="freelancerState.country"
            value-key="key"
            placeholder="Select country"
            :items="countryOptions"
            :search-input="false"
            class="w-full"
          />
        </UFormField>

        <UCheckbox v-model="agreedToTerms">
          <template #label>
            I understand and agree to the <NuxtLink to="/terms" class="text-primary underline">Terms of service</NuxtLink> and <NuxtLink to="/privacy" class="text-primary underline">Privacy policy</NuxtLink>
          </template>
        </UCheckbox>
        <UCheckbox v-model="isAdult">
          <template #label>
            I confirm that I am at least 18 years of age
          </template>
        </UCheckbox>

        <UButton type="submit" block :loading="isLoading" :disabled="isLoading || !agreedToTerms || !isAdult" size="lg">
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
          <UFormField label="First name" name="contactFirstName" required>
            <UInput v-model="companyState.contactFirstName" placeholder="John" class="w-full" />
          </UFormField>

          <UFormField label="Last name" name="contactLastName" required>
            <UInput v-model="companyState.contactLastName" placeholder="Smith" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Company name" name="companyName" required>
          <UInput v-model="companyState.companyName" placeholder="Acme Corporation" class="w-full" />
        </UFormField>

        <UFormField label="Work email" name="email" required>
          <UInput v-model="companyState.email" placeholder="john.smith@acme.com" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password" required>
          <UInput v-model="companyState.password" type="password" placeholder="Password (8 or more characters)" class="w-full" />
        </UFormField>

        <UFormField label="Country" name="country" required>
          <USelectMenu
            v-model="companyState.country"
            value-key="key"
            placeholder="Select country"
            :items="countryOptions"
            :search-input="false"
            class="w-full"
          />
        </UFormField>

        <UCheckbox v-model="agreedToTerms">
          <template #label>
            I understand and agree to the <NuxtLink to="/terms" class="text-primary underline">Terms of service</NuxtLink> and <NuxtLink to="/privacy" class="text-primary underline">Privacy policy</NuxtLink>
          </template>
        </UCheckbox>

        <UButton type="submit" block :loading="isLoading" :disabled="isLoading || !agreedToTerms" size="lg">
          Create Account
        </UButton>
      </UForm>
    </UPageBody>
  </UPage>
</template>
