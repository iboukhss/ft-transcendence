<script setup lang="ts">
import { SKILL_LABELS } from '~/utils/labels'

const selectedSkills = ref<string[]>([])

const skillsArray = Object.entries(SKILL_LABELS).map(([key, label]) => ({
  key,
  label
}))
</script>

<template>
  <div class="flex flex-col gap-2">
    <UCheckbox
      v-for="index in skillsArray"
      :key="index.key"
      :v-model="selectedSkills"
      :label="index.label"
      class="gap-1"
    />
  </div>
</template>
