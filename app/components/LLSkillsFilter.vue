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
  <div class="flex flex-col gap-2">
    <UCheckboxGroup
      v-model="selectedSkills"
      :items="visibleSkills"
    />
    <UButton label="View more" @click="isExpanded = !isExpanded" />
  </div>
</template>
