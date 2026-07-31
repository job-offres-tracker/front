import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import type { SelectChangeEvent } from '@mui/material/Select'
import { TYPES_EVENEMENT, TYPE_EVENEMENT_LABELS, type Evenement, type EvenementRequest, type TypeEvenement } from '@src/models/candidature'

interface EvenementDialogProps {
  open: boolean
  evenement?: Evenement | null
  saving: boolean
  onCancel: () => void
  onSubmit: (payload: EvenementRequest) => void
}

function dateAujourdhui(): string {
  return new Date().toISOString().slice(0, 10)
}

export function EvenementDialog({ open, evenement, saving, onCancel, onSubmit }: EvenementDialogProps) {
  const [date, setDate] = useState('')
  const [type, setType] = useState<TypeEvenement>('ENTRETIEN')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (open) {
      setDate(evenement?.date ?? dateAujourdhui())
      setType(evenement?.type ?? 'ENTRETIEN')
      setDescription(evenement?.description ?? '')
    }
  }, [open, evenement])

  const handleSubmit = () => {
    onSubmit({ date, type, description: description.trim() || undefined })
  }

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{evenement ? "Modifier l'événement" : 'Ajouter un événement'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="type-evenement-label">Type</InputLabel>
            <Select
              labelId="type-evenement-label"
              label="Type"
              value={type}
              onChange={(event: SelectChangeEvent) => setType(event.target.value as TypeEvenement)}
            >
              {TYPES_EVENEMENT.map((typeEvenement) => (
                <MenuItem key={typeEvenement} value={typeEvenement}>
                  {TYPE_EVENEMENT_LABELS[typeEvenement]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || date.length === 0}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {evenement ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
