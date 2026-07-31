import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import type { SelectChangeEvent } from '@mui/material/Select'
import { getCvs } from '@src/api/cvApi'
import { messageErreur } from '@src/api/apiClient'
import type { Cv } from '@src/models/cv'

interface DocumentCvDialogProps {
  open: boolean
  saving: boolean
  onCancel: () => void
  onConfirm: (cvNomUnique: string) => void
}

export function DocumentCvDialog({ open, saving, onCancel, onConfirm }: DocumentCvDialogProps) {
  const [cvs, setCvs] = useState<Cv[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cvNomUnique, setCvNomUnique] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }
    setCvNomUnique('')
    setLoading(true)
    setError(null)
    getCvs()
      .then(setCvs)
      .catch((err: unknown) => setError(messageErreur(err)))
      .finally(() => setLoading(false))
  }, [open])

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Attacher un CV existant</DialogTitle>
      <DialogContent>
        {loading && <CircularProgress size={20} />}
        {!loading && error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && cvs.length === 0 && (
          <Alert severity="info">Aucun CV disponible dans le paramétrage.</Alert>
        )}
        {!loading && !error && cvs.length > 0 && (
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="cv-nom-unique-label">CV</InputLabel>
            <Select
              labelId="cv-nom-unique-label"
              label="CV"
              value={cvNomUnique}
              onChange={(event: SelectChangeEvent) => setCvNomUnique(event.target.value)}
            >
              {cvs.map((cv) => (
                <MenuItem key={cv.nomUnique} value={cv.nomUnique}>
                  {cv.nomOriginal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(cvNomUnique)}
          disabled={saving || cvNomUnique.length === 0}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  )
}
