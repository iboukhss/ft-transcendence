<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <UCollapsible class="flex flex-col gap-1" default-open>
    <UButton
      class="group -ml-3"
      :label="label"
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-chevron-down"
      :ui="{
        base: 'justify-between w-[calc(100%+0.75rem)]',
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
      }"
      block
    />

    <template #content>
      <slot />
    </template>
  </UCollapsible>
</template>
