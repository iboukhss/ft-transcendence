<script setup lang="ts">
const salaryRange = defineModel<[number, number]>({ default: () => [1, 500] })
</script>

<template>
  <LLFilterCollapsible label="Salary">
    <div class="mb-1 flex content-center items-center justify-between">
      <h2 class="text-default block text-sm font-medium">
        {{ salaryRange[0] }}€ - {{ salaryRange[1] }}€
      </h2>
    </div>
    <USlider
      v-model="salaryRange"
      :min="1"
      :max="500"

      class="mx-1 my-2 mb-4"
    />
  </LLFilterCollapsible>
</template>
