import { ref } from 'vue'

interface SnackbarState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const snackbarState = ref<SnackbarState>({
  show: false,
  message: '',
  type: 'info',
})

export function useSnackbar() {
  const showSnackbar = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
  ) => {
    snackbarState.value = {
      show: true,
      message,
      type,
    }
  }

  const hideSnackbar = () => {
    snackbarState.value.show = false
  }

  return {
    snackbarState,
    showSnackbar,
    hideSnackbar,
  }
}
