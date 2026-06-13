<script setup lang="ts">
const minSalary = defineModel<number>({ default: 1 })
const maxSalary = defineModel<number>({ default: 500 })

const sliderValue = computed({
  get() {
    return [minSalary.value, maxSalary.value] as [number, number]
  },
  set(newValue) {
    minSalary.value = newValue[0]
    maxSalary.value = newValue[1]
  }
})
</script>

<template>
  <LLFilterCollapsible label="Salary">
    <USlider v-model="sliderValue" />
  </LLFilterCollapsible>
</template>
