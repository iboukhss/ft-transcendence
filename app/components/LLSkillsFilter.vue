<script setup lang="ts">
import { SKILL_LABELS } from '~/utils/labels'

// const selectedSkills = ref<string[]>([])
const selectedSkills = defineModel<string[]>({ default: () => [] })
const isExpanded = ref(false)

const COLLAPSED_COUNT = 7

const visibleSkills = computed(() => {
  if (isExpanded.value)
    return skillsArray
  return skillsArray.slice(0, COLLAPSED_COUNT)
})

const skillsArray = Object.entries(SKILL_LABELS).map(([key, label]) => ({
  value: key,
  label: label
}))

if (!isExpanded.value)
  skillsArray.slice(0, COLLAPSED_COUNT)
</script>

<template>
  <div class="mb-1 flex content-center items-center justify-between">
    <h2 class="text-default block text-sm font-medium">Skills</h2>
  </div>
  <div class="mb-4 flex flex-col gap-1">
    <UCheckboxGroup
      v-model="selectedSkills"
      :items="visibleSkills"
      :ui="{
        fieldset: 'space-y-1'
      }"
    />
    <UButton
      :label="isExpanded ? 'View less' : 'View more'"
      color="primary"
      variant="ghost"
      :icon="isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
      class="-ms-2"
      @click="isExpanded = !isExpanded"
    />
  </div>
</template>
