import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

interface DocumentFichierDialogProps {
  file: File | null
  saving: boolean
  onCancel: () => void
  onConfirm: (libelle: string) => void
}

export function DocumentFichierDialog({ file, saving, onCancel, onConfirm }: DocumentFichierDialogProps) {
  const [libelle, setLibelle] = useState('')

  useEffect(() => {
    if (file) {
      setLibelle(file.name)
    }
  }, [file])

  return (
    <Dialog open={file !== null} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Ajouter un document</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nom du document"
          value={libelle}
          onChange={(event) => setLibelle(event.target.value)}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(libelle.trim())}
          disabled={saving || libelle.trim().length === 0}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  )
}
