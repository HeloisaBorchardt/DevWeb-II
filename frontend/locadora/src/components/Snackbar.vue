<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(false)

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      visible.value = true
      if (props.duration > 0) {
        setTimeout(() => {
          visible.value = false
          emit('close')
        }, props.duration)
      }
    } else {
      visible.value = false
    }
  },
  { immediate: true },
)

const getIcon = () => {
  switch (props.type) {
    case 'success':
      return 'mdi-check-circle'
    case 'error':
      return 'mdi-alert-circle'
    case 'warning':
      return 'mdi-alert'
    default:
      return 'mdi-information'
  }
}

const close = () => {
  visible.value = false
  emit('close')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" :class="['snackbar', type]">
      <i :class="['mdi', getIcon(), 'snackbar-icon']"></i>
      <span class="snackbar-message">{{ message }}</span>
      <button @click="close" class="snackbar-close">
        <i class="mdi mdi-close"></i>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  min-width: 300px;
  max-width: 500px;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 9999;
  animation: slideIn 0.3s ease-out;
  color: white;
  font-weight: 500;
}

.snackbar.success {
  background-color: var(--color-secondary);
}

.snackbar.error {
  background-color: var(--color-primary);
}

.snackbar.warning {
  background-color: #f59e0b;
}

.snackbar.info {
  background-color: #3b82f6;
}

.snackbar-icon {
  font-size: 1.5rem;
}

.snackbar-message {
  flex: 1;
}

.snackbar-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.snackbar-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
