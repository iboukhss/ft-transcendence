<script setup lang="ts">
</script>

<template>
  <UPageBody class="space-y-8">
    <div class="px-2 text-3xl font-bold tracking-tight">
      <h1>Request data</h1>
    </div>
    <UCard
      title="Theme"
      description="Switch between light and dark theme""
    >
      <div class="">
        <UColorModeSelect />
        <UButton>Download/export my data</UButton>
      </div>
    </UCard>
  </UPageBody>
</template>
