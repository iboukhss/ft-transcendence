<script setup lang="ts">
import { SKILL_LABELS } from '~/utils/labels'

// const selectedSkills = ref<string[]>([])
const selectedSkills = defineModel<string[]>({ default: () => [] })

const skillsArray = Object.entries(SKILL_LABELS).map(([key, label]) => ({
  value: key,
  label: label
}))
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- <UCheckbox
      v-for="skill in skillsArray"
      :key="skill.key"
      v-model="selectedSkills"
      :name="skill.key"
      :value="skill.key"
      :label="skill.label"
      class="gap-1"
    /> -->
    <UCheckboxGroup
      v-model="selectedSkills"
      :items="skillsArray"
    />
  </div>
</template>
