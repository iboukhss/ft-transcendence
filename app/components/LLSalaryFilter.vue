<script setup lang="ts">
const salaryRange = defineModel<[number, number]>({ default: () => [1, 500] })
</script>

<template>
  <LLFilterCollapsible label="Salary">
    <USlider
      v-model="salaryRange"
      :min="1"
      :max="500"
      :tooltip="{
        content: { side: 'bottom', sideOffset: 12 },
        open: true
      }"
      class="mx-1 my-2 mb-12"
    />
  </LLFilterCollapsible>
</template>
