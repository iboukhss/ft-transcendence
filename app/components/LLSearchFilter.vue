<script setup lang="ts">
defineProps<{
  label: string
}>()

const search = defineModel<string>({ default: '' })
</script>

<template>
  <h2 class="mb-4 text-sm font-semibold uppercase">Filters</h2>
  <UFormField>
    <template #label>
      {{ label }}
    </template>
    <UInput
      v-model="search"
      icon="i-lucide-search"
      autofocus
      class="mb-4"
    />
  </UFormField>
</template>
