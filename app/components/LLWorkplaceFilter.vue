<script setup lang="ts">
import { WORKPLACE_LABELS } from '~/utils/labels'

const selectedWorkplaces = defineModel<string[]>({ default: () => [] })

const workplacesArray = Object.entries(WORKPLACE_LABELS).map(([keyof, label]) => ({
  value: keyof,
  label
}))
</script>

<template>
  <LLFilterCollapsible label="Workplaces">
    <div class="mb-4 flex flex-col gap-1">
      <UCheckboxGroup
        v-model="selectedWorkplaces"
        :items="workplacesArray"
        :ui="{
          fieldset: 'space-y-1'
        }"
      />
    </div>
  </LLFilterCollapsible>
</template>
