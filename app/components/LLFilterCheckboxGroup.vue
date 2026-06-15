<script setup lang="ts">
import { transformLabelsToOptions } from '~/utils/filters'

const modelValue = defineModel<string[]>({ default: () => [] })

const props = defineProps<{
  label: string
  rawLabelsMap?: Record<string, string>
  items?: { value: string, label: string }[]
}>()

const items = computed(() => {
  if (props.items)
    return props.items

  if (props.rawLabelsMap)
    return transformLabelsToOptions(props.rawLabelsMap)

  return []
})
</script>

<template>
  <LLFilterCollapsible :label="label">
    <div class="mb-4 flex flex-col gap-1">
      <UCheckboxGroup
        v-model="modelValue"
        :items="items"
        :ui="{
          fieldset: 'space-y-1'
        }"
      />
      <slot />
    </div>
  </LLFilterCollapsible>
</template>
