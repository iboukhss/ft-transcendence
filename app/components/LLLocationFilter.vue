<script setup lang="ts">
import { COUNTRY_LABELS } from '~/utils/labels'

const selectedCountries = defineModel<string[]>({ default: () => [] })

const countriesArray = Object.entries(COUNTRY_LABELS).map(([key, label]) => ({
  value: key,
  label
}))
</script>

<template>
  <div class="mb-1 flex content-center items-center justify-between">
    <h2 class="text-default block text-sm font-medium">Locations</h2>
  </div>
  <div class="mb-4 flex flex-col gap-1">
    <UCheckboxGroup
      v-model="selectedCountries"
      :items="countriesArray"
      :ui="{
        fieldset: 'space-y-1'
      }"
    />
  </div>
</template>
