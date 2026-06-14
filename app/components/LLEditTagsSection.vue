<script setup lang="ts">
const tags = defineModel<string[]>({ required: true })

defineProps<{
  title: string
  options: { key: string, label: string }[]
  labels: Record<string, string>
  placeholder?: string
}>()

const emit = defineEmits<{
  save: [newTags: string[], done: (success: boolean) => void]
}>()

const isEditing = ref(false)
const isLoading = ref(false)
const localState = ref<string[]>([])

const toggleEdit = () => {
  if (!isEditing.value) {
    localState.value = [...tags.value]
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
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
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
      <UInputMenu
        v-model="localState"
        multiple
        :items="options"
        value-key="key"
        option-attribute="label"
        :placeholder="!localState.length ? (placeholder || 'Type to search...') : ''"
        size="lg"
        color="neutral"
        variant="outline"
        class="w-full"
      />

      <div class="flex flex-wrap justify-end gap-3 pt-1">
        <UButton label="Cancel" variant="ghost" color="neutral" @click="toggleEdit" />
        <UButton label="Save" color="primary" :loading="isLoading" @click="onSave" />
      </div>
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <template v-if="tags.length">
        <UBadge
          v-for="tag in tags"
          :key="tag"
          variant="soft"
          color="secondary"
          size="lg"
        >
          {{ labels[tag] || tag }}
        </UBadge>
      </template>
      <p v-else class="text-muted italic">{{ placeholder || 'None added yet.' }}</p>
    </div>
  </div>
</template>
