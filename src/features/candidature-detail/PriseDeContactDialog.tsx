import { useEffect, useState, type ChangeEvent } from 'react'
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

type Formulaire = Record<keyof ModifierPriseDeContactRequest, string>

const FORMULAIRE_VIDE: Formulaire = { urlEntreprise: '', poste: '', client: '' }

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
  const [formulaire, setFormulaire] = useState<Formulaire>(FORMULAIRE_VIDE)

  useEffect(() => {
    if (open) {
      setFormulaire({
        urlEntreprise: urlEntreprise ?? '',
        poste: poste ?? '',
        client: client ?? '',
      })
    }
  }, [open, urlEntreprise, poste, client])

  const handleChange = (champ: keyof Formulaire) => (event: ChangeEvent<HTMLInputElement>) =>
    setFormulaire((prev) => ({ ...prev, [champ]: event.target.value }))

  const handleSubmit = () => {
    const initial: Formulaire = {
      urlEntreprise: urlEntreprise ?? '',
      poste: poste ?? '',
      client: client ?? '',
    }
    const payload: ModifierPriseDeContactRequest = {}
    for (const champ of Object.keys(formulaire) as (keyof Formulaire)[]) {
      const valeur = formulaire[champ].trim()
      if (valeur !== initial[champ]) {
        payload[champ] = valeur || null
      }
    }
    onSubmit(payload)
  }

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Modifier la prise de contact</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="URL du site de l'entreprise"
            value={formulaire.urlEntreprise}
            onChange={handleChange('urlEntreprise')}
            fullWidth
          />
          <TextField
            label="Poste"
            value={formulaire.poste}
            onChange={handleChange('poste')}
            fullWidth
          />
          {typeEntrepriseAutoriseClient(typeEntreprise) && (
            <TextField
              label="Client"
              value={formulaire.client}
              onChange={handleChange('client')}
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
