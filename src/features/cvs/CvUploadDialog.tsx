import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

interface CvUploadDialogProps {
  file: File | null
  uploading: boolean
  onCancel: () => void
  onConfirm: (nom: string) => void
}

export function CvUploadDialog({ file, uploading, onCancel, onConfirm }: CvUploadDialogProps) {
  const [nom, setNom] = useState('')

  useEffect(() => {
    if (file) {
      setNom(file.name)
    }
  }, [file])

  return (
    <Dialog open={file !== null} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Ajouter un CV</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Nom du CV"
          value={nom}
          onChange={(event) => setNom(event.target.value)}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={uploading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(nom.trim())}
          disabled={uploading || nom.trim().length === 0}
          startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Uploader
        </Button>
      </DialogActions>
    </Dialog>
  )
}
