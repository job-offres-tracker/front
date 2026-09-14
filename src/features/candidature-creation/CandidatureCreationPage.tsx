import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import type { SelectChangeEvent } from '@mui/material/Select'
import {
  STATUTS_CANDIDATURE_SPONTANEE,
  STATUT_CANDIDATURE_SPONTANEE_LABELS,
  STATUTS_PRISE_DE_CONTACT,
  STATUT_PRISE_DE_CONTACT_LABELS,
  TYPES_ENTREPRISE,
  TYPE_ENTREPRISE_LABELS,
  TYPE_CANDIDATURE_LABELS,
  type StatutCandidatureSpontanee,
  type StatutPriseDeContact,
  type TypeCandidature,
  type TypeEntreprise,
} from '@src/models/candidature'
import { useCreerCandidature } from './useCreerCandidature'

type TypeCandidatureCreable = Extract<TypeCandidature, 'SPONTANEE' | 'PRISE_DE_CONTACT'>

const TYPES_CANDIDATURE_CREABLES: TypeCandidatureCreable[] = ['SPONTANEE', 'PRISE_DE_CONTACT']

interface FormulaireCandidature {
  type: TypeCandidatureCreable | ''
  nomEntreprise: string
  urlEntreprise: string
  typeEntreprise: TypeEntreprise | ''
  statut: StatutCandidatureSpontanee | StatutPriseDeContact | ''
  dateCandidature: string
}

const FORMULAIRE_INITIAL: FormulaireCandidature = {
  type: '',
  nomEntreprise: '',
  urlEntreprise: '',
  typeEntreprise: '',
  statut: '',
  dateCandidature: '',
}

export function CandidatureCreationPage() {
  const navigate = useNavigate()
  const { soumettreSpontanee, soumettrePriseDeContact, creating, snackbar } = useCreerCandidature((candidature) =>
    navigate(`/candidatures/${candidature.id}`),
  )

  const [formulaire, setFormulaire] = useState<FormulaireCandidature>(FORMULAIRE_INITIAL)
  const [soumis, setSoumis] = useState(false)

  const typeInvalide = formulaire.type === ''
  const nomEntrepriseInvalide = formulaire.nomEntreprise.trim().length === 0
  const typeEntrepriseInvalide = formulaire.typeEntreprise === ''

  const handleChange =
    (champ: 'nomEntreprise' | 'urlEntreprise' | 'dateCandidature') => (event: ChangeEvent<HTMLInputElement>) => {
      setFormulaire((prev) => ({ ...prev, [champ]: event.target.value }))
    }

  const handleTypeChange = (event: SelectChangeEvent) => {
    const type = event.target.value as TypeCandidatureCreable | ''
    setFormulaire((prev) => ({ ...prev, type, statut: '' }))
  }

  const handleTypeEntrepriseChange = (event: SelectChangeEvent) => {
    setFormulaire((prev) => ({ ...prev, typeEntreprise: event.target.value as TypeEntreprise | '' }))
  }

  const handleStatutChange = (event: SelectChangeEvent) => {
    setFormulaire((prev) => ({ ...prev, statut: event.target.value as StatutCandidatureSpontanee | StatutPriseDeContact | '' }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSoumis(true)
    if (typeInvalide || nomEntrepriseInvalide || typeEntrepriseInvalide) {
      return
    }

    const payload = {
      nomEntreprise: formulaire.nomEntreprise.trim(),
      urlEntreprise: formulaire.urlEntreprise.trim() || undefined,
      typeEntreprise: formulaire.typeEntreprise as TypeEntreprise,
      dateCandidature: formulaire.dateCandidature || undefined,
    }

    if (formulaire.type === 'SPONTANEE') {
      await soumettreSpontanee({ ...payload, statut: (formulaire.statut as StatutCandidatureSpontanee) || undefined })
    } else if (formulaire.type === 'PRISE_DE_CONTACT') {
      await soumettrePriseDeContact({ ...payload, statut: (formulaire.statut as StatutPriseDeContact) || undefined })
    }
  }

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <Button component={Link} to="/candidatures" startIcon={<ArrowBackIcon />}>
            Retour à la liste
          </Button>
          <Typography variant="h5" component="h1">
            Nouvelle candidature
          </Typography>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth error={soumis && typeInvalide}>
              <InputLabel id="type-candidature-label">Type de candidature</InputLabel>
              <Select
                labelId="type-candidature-label"
                label="Type de candidature"
                value={formulaire.type}
                onChange={handleTypeChange}
              >
                {TYPES_CANDIDATURE_CREABLES.map((valeur) => (
                  <MenuItem key={valeur} value={valeur}>
                    {TYPE_CANDIDATURE_LABELS[valeur]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Nom de l'entreprise"
              value={formulaire.nomEntreprise}
              onChange={handleChange('nomEntreprise')}
              error={soumis && nomEntrepriseInvalide}
              helperText={soumis && nomEntrepriseInvalide ? "Le nom de l'entreprise est obligatoire" : ' '}
              required
              fullWidth
            />

            <TextField
              label="URL du site de l'entreprise"
              value={formulaire.urlEntreprise}
              onChange={handleChange('urlEntreprise')}
              fullWidth
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth error={soumis && typeEntrepriseInvalide}>
                <InputLabel id="type-entreprise-label">Type d'entreprise</InputLabel>
                <Select
                  labelId="type-entreprise-label"
                  label="Type d'entreprise"
                  value={formulaire.typeEntreprise}
                  onChange={handleTypeEntrepriseChange}
                >
                  {TYPES_ENTREPRISE.map((valeur) => (
                    <MenuItem key={valeur} value={valeur}>
                      {TYPE_ENTREPRISE_LABELS[valeur]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={typeInvalide}>
                <InputLabel id="statut-candidature-label">Statut</InputLabel>
                <Select
                  labelId="statut-candidature-label"
                  label="Statut"
                  value={formulaire.statut}
                  onChange={handleStatutChange}
                >
                  <MenuItem value="">
                    <em>
                      Non précisé (
                      {formulaire.type === 'PRISE_DE_CONTACT'
                        ? STATUT_PRISE_DE_CONTACT_LABELS.ETABLI
                        : STATUT_CANDIDATURE_SPONTANEE_LABELS.ENVOYE}
                      )
                    </em>
                  </MenuItem>
                  {formulaire.type === 'PRISE_DE_CONTACT'
                    ? STATUTS_PRISE_DE_CONTACT.map((valeur) => (
                        <MenuItem key={valeur} value={valeur}>
                          {STATUT_PRISE_DE_CONTACT_LABELS[valeur]}
                        </MenuItem>
                      ))
                    : STATUTS_CANDIDATURE_SPONTANEE.map((valeur) => (
                        <MenuItem key={valeur} value={valeur}>
                          {STATUT_CANDIDATURE_SPONTANEE_LABELS[valeur]}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Date de la candidature"
              type="datetime-local"
              value={formulaire.dateCandidature}
              onChange={handleChange('dateCandidature')}
              slotProps={{ inputLabel: { shrink: true } }}
              helperText="Optionnel — date de saisie par défaut"
              fullWidth
            />

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button component={Link} to="/candidatures" disabled={creating}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={creating}
                startIcon={creating ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                Créer la candidature
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      {snackbar.notificationNode}
    </>
  )
}
