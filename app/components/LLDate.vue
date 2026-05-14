<script setup lang="ts">
const props = defineProps<{
  date: string | Date
}>()

const formattedDate = computed(() => {
  if (!props.date) {
    return ''
  }

  return new Date(props.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})
</script>

<template>
  <time :datetime="date.toString()" class="text-inherit">
    {{ formattedDate }}
  </time>
</template>
