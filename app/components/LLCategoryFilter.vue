<script setup lang="ts">
import { JOB_CATEGORY_LABELS } from '~/utils/labels'

const selectedCategories = defineModel<string[]>({ default: () => [] })

const categoriesArray = Object.entries(JOB_CATEGORY_LABELS).map(([key, label]) => ({
  value: key,
  label
}))
</script>

<template>
  <LLFilterCollapsible label="Categories">
    <div class="mb-4 flex flex-col gap-1">
      <UCheckboxGroup
        v-model="selectedCategories"
        :items="categoriesArray"
        :ui="{
          fieldset: 'space-y-1'
        }"
      />
    </div>
  </LLFilterCollapsible>
</template>
