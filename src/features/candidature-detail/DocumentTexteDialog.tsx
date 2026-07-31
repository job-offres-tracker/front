import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'

const CONTENU_MAX_LENGTH = 10_000

interface DocumentTexteDialogProps {
  open: boolean
  saving: boolean
  onCancel: () => void
  onConfirm: (libelle: string, contenu: string) => void
}

export function DocumentTexteDialog({ open, saving, onCancel, onConfirm }: DocumentTexteDialogProps) {
  const [libelle, setLibelle] = useState('')
  const [contenu, setContenu] = useState('')

  const handleClose = () => {
    setLibelle('')
    setContenu('')
    onCancel()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un document texte</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Libellé"
            value={libelle}
            onChange={(event) => setLibelle(event.target.value)}
            fullWidth
          />
          <TextField
            label="Contenu"
            value={contenu}
            onChange={(event) => setContenu(event.target.value.slice(0, CONTENU_MAX_LENGTH))}
            helperText={`${contenu.length} / ${CONTENU_MAX_LENGTH} caractères`}
            multiline
            minRows={5}
            fullWidth
            slotProps={{ htmlInput: { maxLength: CONTENU_MAX_LENGTH } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(libelle.trim(), contenu.trim())}
          disabled={saving || libelle.trim().length === 0 || contenu.trim().length === 0}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  )
}
