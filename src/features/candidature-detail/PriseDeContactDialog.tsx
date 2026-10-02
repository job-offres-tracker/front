import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import type { ModifierPriseDeContactRequest } from '@src/models/modifierPriseDeContactRequest'
import type { TypeEntreprise } from '@src/models/candidature'

interface PriseDeContactDialogProps {
  open: boolean
  urlEntreprise?: string
  poste?: string
  client?: string
  typeEntreprise: TypeEntreprise
  saving: boolean
  onCancel: () => void
  onSubmit: (payload: ModifierPriseDeContactRequest) => void
}

function typeEntrepriseAutoriseClient(typeEntreprise: TypeEntreprise): boolean {
  return typeEntreprise === 'ESN' || typeEntreprise === 'CABINET_RECRUTEMENT'
}

export function PriseDeContactDialog({
  open,
  urlEntreprise,
  poste,
  client,
  typeEntreprise,
  saving,
  onCancel,
  onSubmit,
}: PriseDeContactDialogProps) {
  const [urlEntrepriseSaisie, setUrlEntrepriseSaisie] = useState('')
  const [posteSaisi, setPosteSaisi] = useState('')
  const [clientSaisi, setClientSaisi] = useState('')

  useEffect(() => {
    if (open) {
      setUrlEntrepriseSaisie(urlEntreprise ?? '')
      setPosteSaisi(poste ?? '')
      setClientSaisi(client ?? '')
    }
  }, [open, urlEntreprise, poste, client])

  const handleSubmit = () => {
    onSubmit({
      urlEntreprise: urlEntrepriseSaisie.trim() || undefined,
      poste: posteSaisi.trim() || undefined,
      client: clientSaisi.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Modifier la prise de contact</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="URL du site de l'entreprise"
            value={urlEntrepriseSaisie}
            onChange={(event) => setUrlEntrepriseSaisie(event.target.value)}
            fullWidth
          />
          <TextField
            label="Poste"
            value={posteSaisi}
            onChange={(event) => setPosteSaisi(event.target.value)}
            fullWidth
          />
          {typeEntrepriseAutoriseClient(typeEntreprise) && (
            <TextField
              label="Client"
              value={clientSaisi}
              onChange={(event) => setClientSaisi(event.target.value)}
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={saving}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
