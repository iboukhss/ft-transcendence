<script setup lang="ts">
import { transformLabelsToOptions } from '~/utils/filters'
import { SKILL_LABELS } from '~/utils/labels'

const selectedSkills = defineModel<string[]>({ default: () => [] })
const isExpanded = ref(false)

const COLLAPSED_COUNT = 7

const allSkills = transformLabelsToOptions(SKILL_LABELS)

const visibleSkills = computed(() => {
  if (isExpanded.value)
    return allSkills
  return allSkills.slice(0, COLLAPSED_COUNT)
})
</script>

<template>
  <LLFilterCheckboxGroup
    v-model="selectedSkills"
    label="Skills"
    :items="visibleSkills"
  >
    <UButton
      :label="isExpanded ? 'View less' : 'View more'"
      color="primary"
      variant="ghost"
      :icon="isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
      class="-ms-2"
      @click="isExpanded = !isExpanded"
    />
  </LLFilterCheckboxGroup>
</template>
