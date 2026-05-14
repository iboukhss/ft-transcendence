<script setup lang="ts">
</script>

<template>
  <div class="space-y-8">
    <header>
      <h1 class="text-xl font-semibold">Preferences</h1>
      <p class="text-muted text-sm">Tailor your experience to your needs</p>
    </header>

    <section>
      <UFormField
        label="Theme"
        description="Switch between light and dark theme"
      >
        <USelect
          v-model="theme"
          :items="['System', 'Light', 'Dark']"
          icon="i-lucide-sun-moon"
          class="w-40"
        />
      </UFormField>
    </section>
  </div>
</template>
