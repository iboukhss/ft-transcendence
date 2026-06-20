<script setup lang="ts">
const minSalary = defineModel<number>('min', { default: 1 })
const maxSalary = defineModel<number>('max', { default: 500 })

const sliderValue = computed({
  get: () => [minSalary.value, maxSalary.value] as [number, number],
  set: (val) => {
    minSalary.value = val[0]
    maxSalary.value = val[1]
  }
})
</script>

<template>
  <LLFilterCollapsible label="Salary">
    <div class="mb-1 flex content-center items-center justify-between">
      <h2 class="text-default block text-sm font-medium">
        {{ minSalary }}€ - {{ maxSalary }}€
      </h2>
    </div>

    <USlider
      v-model="sliderValue"
      :min="1"
      :max="500"
      class="mx-1 my-2 mb-4"
    />
  </LLFilterCollapsible>
</template>
