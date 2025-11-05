<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FormField } from '../api/entities' // Importa a interface

const props = defineProps<{
  isVisible: boolean
  title: string
  initialData: Record<string, any> | null
  formFields: FormField[]
}>()

const emit = defineEmits(['save', 'close'])

const localData = ref<Record<string, any>>({})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      localData.value = { ...newVal }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  const isValid = props.formFields.every((field) => {
    const value = localData.value[field.key]
    return value !== null && value !== undefined && value !== ''
  })

  if (isValid) {
    emit('save', localData.value)
  } else {
    alert('Preencha todos os campos.')
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">{{ title }}</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="localData.id">
          <label class="block text-sm font-semibold text-gray-700 mb-1">ID</label>
          <input
            :value="localData.id"
            disabled
            class="block w-full border-2 border-gray-200 p-3 rounded-lg bg-gray-50"
          />
        </div>

        <div v-for="field in formFields" :key="field.key">
          <label :for="field.key" class="block text-sm font-semibold text-gray-700 mb-1">
            {{ field.label }}
          </label>

          <input
            :id="field.key"
            v-model="localData[field.key]"
            :type="field.type"
            :step="field.step"
            class="input-styled w-full"
          />
        </div>

        <div class="flex justify-end gap-3 pt-6">
          <button
            type="button"
            @click="handleClose"
            class="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
          >
            Cancelar
          </button>
          <button type="submit" class="btn-primary">Salvar Alterações</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 28rem;
  border: 3px solid var(--color-secondary);
}

.modal-title {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}
</style>
