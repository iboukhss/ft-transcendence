<script setup lang="ts">
const aboutText = defineModel<string | null>({ required: true })

defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  save: [newValue: string, done: (success: boolean) => void]
}>()

const isEditing = ref(false)
const isLoading = ref(false)
const localState = ref('')

const toggleEdit = () => {
  if (!isEditing.value) {
    localState.value = aboutText.value ?? ''
  }
  isEditing.value = !isEditing.value
}

const onSave = () => {
  isLoading.value = true

  emit('save', localState.value, (success) => {
    isLoading.value = false
    if (success) {
      isEditing.value = false
    }
  })
}
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-xl font-semibold">About</h2>
      <UButton
        v-if="!isEditing"
        icon="i-lucide-pencil"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="toggleEdit"
      />
    </div>

    <div v-if="isEditing" class="space-y-3">
      <UTextarea v-model="localState" :placeholder="placeholder" class="w-full" />
      <div class="flex justify-end gap-3">
        <UButton label="Cancel" variant="ghost" color="neutral" @click="toggleEdit" />
        <UButton label="Save" color="primary" :loading="isLoading" @click="onSave" />
      </div>
    </div>

    <div v-else>
      <p v-if="aboutText" class="leading-relaxed whitespace-pre-line">{{ aboutText }}</p>
      <p v-else class="text-muted text-sm italic">{{ placeholder || 'No information provided' }}</p>
    </div>
  </div>
</template>
