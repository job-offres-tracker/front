import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useRechercheCommune } from '@src/hooks/useRechercheCommune'
import type { Commune } from '@src/models/commune'
import { useParametresRecherche } from './useParametresRecherche'

const NB_COMMUNES_MAX = 5

export function ParametresRecherchePage() {
  const { parametres, setParametres, loading, error, saving, enregistrer, snackbar } = useParametresRecherche()
  const { options, loading: communeLoading, rechercher } = useRechercheCommune()

  const [nouveauMotCle, setNouveauMotCle] = useState('')
  const [communeInputValue, setCommuneInputValue] = useState('')

  const communesAuMax = parametres.communes.length >= NB_COMMUNES_MAX

  const ajouterMotCle = () => {
    const valeur = nouveauMotCle.trim()
    if (!valeur || parametres.motsCles.includes(valeur)) {
      return
    }
    setParametres((prev) => ({ ...prev, motsCles: [...prev.motsCles, valeur] }))
    setNouveauMotCle('')
  }

  const retirerMotCle = (motCle: string) => {
    setParametres((prev) => ({ ...prev, motsCles: prev.motsCles.filter((m) => m !== motCle) }))
  }

  const ajouterCommune = (commune: Commune) => {
    if (communesAuMax || parametres.communes.some((c) => c.codeInsee === commune.codeInsee)) {
      return
    }
    setParametres((prev) => ({
      ...prev,
      communes: [...prev.communes, { codeInsee: commune.codeInsee, libelle: commune.nom }],
    }))
    setCommuneInputValue('')
  }

  const retirerCommune = (codeInsee: string) => {
    setParametres((prev) => ({ ...prev, communes: prev.communes.filter((c) => c.codeInsee !== codeInsee) }))
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Paramètres de recherche
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Type de contrat"
              placeholder="CDI"
              value={parametres.typeContrat ?? ''}
              onChange={(event) =>
                setParametres((prev) => ({ ...prev, typeContrat: event.target.value || null }))
              }
              helperText="Code France Travail, ex. CDI, CDD, MIS"
              sx={{ maxWidth: 260 }}
            />

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="subtitle1">Mots-clés</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {parametres.motsCles.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Aucun mot-clé configuré
                  </Typography>
                )}
                {parametres.motsCles.map((motCle) => (
                  <Chip key={motCle} label={motCle} onDelete={() => retirerMotCle(motCle)} />
                ))}
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Nouveau mot-clé"
                  value={nouveauMotCle}
                  onChange={(event) => setNouveauMotCle(event.target.value)}
                  onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      ajouterMotCle()
                    }
                  }}
                  fullWidth
                  size="small"
                />
                <Button variant="outlined" onClick={ajouterMotCle} disabled={nouveauMotCle.trim().length === 0}>
                  Ajouter
                </Button>
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="subtitle1">Communes ({parametres.communes.length}/{NB_COMMUNES_MAX})</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {parametres.communes.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Aucune commune configurée
                  </Typography>
                )}
                {parametres.communes.map((commune) => (
                  <Chip
                    key={commune.codeInsee}
                    label={`${commune.libelle} (${commune.codeInsee})`}
                    onDelete={() => retirerCommune(commune.codeInsee)}
                  />
                ))}
              </Stack>
              <Autocomplete<Commune, false, false, false>
                options={options}
                loading={communeLoading}
                filterOptions={(opts) => opts}
                disabled={communesAuMax}
                inputValue={communeInputValue}
                getOptionLabel={(option) => `${option.nom} (${option.codeInsee})`}
                onInputChange={(_, valeur, reason) => {
                  setCommuneInputValue(valeur)
                  if (reason === 'input') {
                    rechercher(valeur)
                  }
                }}
                onChange={(_, valeur) => {
                  if (valeur) {
                    ajouterCommune(valeur)
                  }
                }}
                value={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ajouter une commune"
                    size="small"
                    helperText={communesAuMax ? '5 communes maximum atteint' : ' '}
                  />
                )}
              />
            </Stack>

            <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={enregistrer}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                Enregistrer
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {snackbar.notificationNode}
    </Container>
  )
}
