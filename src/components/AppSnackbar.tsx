import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import type { SnackbarState } from '@src/hooks/useSnackbar'

interface AppSnackbarProps {
  state: SnackbarState
  onClose: () => void
}

export function AppSnackbar({ state, onClose }: AppSnackbarProps) {
  return (
    <Snackbar
      open={state.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={state.severity} onClose={onClose}>
        {state.message}
      </Alert>
    </Snackbar>
  )
}
