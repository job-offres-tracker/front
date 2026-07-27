import { useState } from 'react'
import { messageErreur } from '@src/api/apiClient'

export interface SnackbarState {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

export function useSnackbar() {
  const [state, setState] = useState<SnackbarState>({ open: false, message: '', severity: 'success' })

  const showSuccess = (message: string) => setState({ open: true, message, severity: 'success' })
  const showError = (err: unknown) => setState({ open: true, message: messageErreur(err), severity: 'error' })
  const close = () => setState((prev) => ({ ...prev, open: false }))

  return { state, showSuccess, showError, close }
}
