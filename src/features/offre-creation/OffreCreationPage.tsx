import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Autocomplete from '@mui/material/Autocomplete'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReplayIcon from '@mui/icons-material/Replay'
import DownloadIcon from '@mui/icons-material/Download'
import type { SelectChangeEvent } from '@mui/material/Select'
import { AppSnackbar } from '@src/components/AppSnackbar'
import { ETATS_OFFRE, ETAT_LABELS, type EtatOffre } from '@src/models/offre'
import type { Commune } from '@src/models/commune'
import type { BrouillonOffre } from '@src/models/brouillonOffre'
import { useCreerOffre } from './useCreerOffre'
import { useRechercheCommune } from './useRechercheCommune'
import { useImporterOffre } from './useImporterOffre'

interface FormulaireOffre {
  idExterne: string
  intitule: string
  description: string
  entreprise: string
  lieuLibelle: string
  lieuCodeCommune: string
  lieuAdresse: string
  typeContrat: string
  salaire: string
  urlOrigine: string
  dateCreation: string
  provenance: string
  etat: EtatOffre | ''
}

const FORMULAIRE_INITIAL: FormulaireOffre = {
  idExterne: '',
  intitule: '',
  description: '',
  entreprise: '',
  lieuLibelle: '',
  lieuCodeCommune: '',
  lieuAdresse: '',
  typeContrat: '',
  salaire: '',
  urlOrigine: '',
  dateCreation: '',
  provenance: '',
  etat: '',
}

function libelleCommune(commune: Commune): string {
  return `${commune.nom} (${commune.codeInsee})`
}

function versDateCreation(datePublication: string | undefined): string | undefined {
  return datePublication && /^\d{4}-\d{2}-\d{2}$/.test(datePublication) ? `${datePublication}T00:00` : undefined
}

export function OffreCreationPage() {
  const navigate = useNavigate()
  const { soumettre, creating, snackbar } = useCreerOffre(() => navigate('/offres'))
  const { options: communeOptions, loading: communeLoading, serviceIndisponible: communeIndisponible, rechercher: rechercherCommunes, reessayer: reessayerRechercheCommune } = useRechercheCommune()

  const [formulaire, setFormulaire] = useState<FormulaireOffre>(FORMULAIRE_INITIAL)
  const [soumis, setSoumis] = useState(false)
  const [urlImport, setUrlImport] = useState('')
  const [lieuInputValue, setLieuInputValue] = useState('')

  const appliquerBrouillon = (brouillon: BrouillonOffre) => {
    const idExterne = brouillon.referenceExterne
      ? [brouillon.provenance, brouillon.referenceExterne].filter(Boolean).join('-')
      : undefined

    setFormulaire((prev) => ({
      ...prev,
      idExterne: idExterne ?? prev.idExterne,
      intitule: brouillon.intitule ?? prev.intitule,
      description: brouillon.description ?? prev.description,
      entreprise: brouillon.entreprise ?? prev.entreprise,
      lieuLibelle: brouillon.lieuLibelle ?? prev.lieuLibelle,
      lieuCodeCommune: '',
      typeContrat: brouillon.typeContrat ?? prev.typeContrat,
      salaire: brouillon.salaire ?? prev.salaire,
      urlOrigine: brouillon.urlOrigine ?? prev.urlOrigine,
      dateCreation: versDateCreation(brouillon.datePublication) ?? prev.dateCreation,
      provenance: brouillon.provenance ?? prev.provenance,
    }))
    if (brouillon.lieuLibelle) {
      setLieuInputValue(brouillon.lieuLibelle)
      rechercherCommunes(brouillon.lieuLibelle)
    }
  }

  const { importer, importing, snackbar: snackbarImport } = useImporterOffre(appliquerBrouillon)

  const lieuValue = useMemo<Commune | string | null>(
    () =>
      formulaire.lieuCodeCommune
        ? { nom: formulaire.lieuLibelle, codeInsee: formulaire.lieuCodeCommune, codesPostaux: [] }
        : formulaire.lieuLibelle || null,
    [formulaire.lieuLibelle, formulaire.lieuCodeCommune],
  )

  const intituleInvalide = formulaire.intitule.trim().length === 0

  const handleChange =
    (champ: keyof FormulaireOffre) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormulaire((prev) => ({ ...prev, [champ]: event.target.value }))
    }

  const handleEtatChange = (event: SelectChangeEvent) => {
    setFormulaire((prev) => ({ ...prev, etat: event.target.value as EtatOffre | '' }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSoumis(true)
    if (intituleInvalide) {
      return
    }

    const lieu =
      formulaire.lieuLibelle.trim() || formulaire.lieuAdresse.trim()
        ? {
            libelle: formulaire.lieuLibelle.trim() || undefined,
            codeCommune: formulaire.lieuCodeCommune.trim() || undefined,
            adresse: formulaire.lieuAdresse.trim() || undefined,
          }
        : undefined

    await soumettre({
      idExterne: formulaire.idExterne.trim() || undefined,
      intitule: formulaire.intitule.trim(),
      description: formulaire.description.trim() || undefined,
      entreprise: formulaire.entreprise.trim() || undefined,
      lieu,
      typeContrat: formulaire.typeContrat.trim() || undefined,
      salaire: formulaire.salaire.trim() || undefined,
      urlOrigine: formulaire.urlOrigine.trim() || undefined,
      dateCreation: formulaire.dateCreation || undefined,
      provenance: formulaire.provenance.trim() || undefined,
      etat: formulaire.etat || undefined,
    })
  }

  return (
    <Box sx={{ minHeight: '100%', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Button component={Link} to="/offres" color="inherit" startIcon={<ArrowBackIcon />} sx={{ mr: 2 }}>
            Retour à la liste
          </Button>
          <Typography variant="h6" component="h1">
            Nouvelle offre
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-start' } }}>
            <TextField
              label="Importer depuis une URL"
              placeholder="https://www.hellowork.com/..."
              value={urlImport}
              onChange={(event) => setUrlImport(event.target.value)}
              helperText="Les champs extraits par l'IA restent à vérifier avant de créer l'offre"
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => importer(urlImport.trim())}
              disabled={importing || urlImport.trim().length === 0}
              startIcon={importing ? <CircularProgress size={16} /> : <DownloadIcon />}
              sx={{ flexShrink: 0 }}
            >
              Importer
            </Button>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Intitulé"
              value={formulaire.intitule}
              onChange={handleChange('intitule')}
              error={soumis && intituleInvalide}
              helperText={soumis && intituleInvalide ? "L'intitulé est obligatoire" : ' '}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formulaire.description}
              onChange={handleChange('description')}
              multiline
              minRows={4}
              fullWidth
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Entreprise" value={formulaire.entreprise} onChange={handleChange('entreprise')} fullWidth />
              <TextField
                label="Type de contrat"
                value={formulaire.typeContrat}
                onChange={handleChange('typeContrat')}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Autocomplete<Commune, false, false, true>
                sx={{ flex: 1 }}
                freeSolo={communeIndisponible}
                options={communeOptions}
                loading={communeLoading}
                filterOptions={(opts) => opts}
                value={lieuValue}
                inputValue={lieuInputValue}
                getOptionLabel={(option) => (typeof option === 'string' ? option : libelleCommune(option))}
                isOptionEqualToValue={(option, val) => option.codeInsee === val.codeInsee}
                onInputChange={(_, valeur, reason) => {
                  setLieuInputValue(valeur)
                  if (reason === 'input') {
                    setFormulaire((prev) => ({ ...prev, lieuLibelle: valeur, lieuCodeCommune: '' }))
                    rechercherCommunes(valeur)
                  } else if (reason === 'clear') {
                    setFormulaire((prev) => ({ ...prev, lieuLibelle: '', lieuCodeCommune: '' }))
                    rechercherCommunes('')
                  }
                }}
                onChange={(_, valeur) => {
                  if (typeof valeur === 'string' || valeur === null) {
                    setFormulaire((prev) => ({
                      ...prev,
                      lieuLibelle: valeur ?? '',
                      lieuCodeCommune: '',
                    }))
                    setLieuInputValue(valeur ?? '')
                  } else {
                    setFormulaire((prev) => ({ ...prev, lieuLibelle: valeur.nom, lieuCodeCommune: valeur.codeInsee }))
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lieu (libellé)"
                    helperText={
                      communeIndisponible ? 'Recherche de communes indisponible — vous pouvez saisir le lieu librement' : ' '
                    }
                    slotProps={{
                      ...params.slotProps,
                      input: {
                        ...params.slotProps.input,
                        endAdornment: (
                          <>
                            {communeLoading ? <CircularProgress size={16} /> : null}
                            {communeIndisponible ? (
                              <Tooltip title="Réessayer la recherche">
                                <IconButton size="small" onClick={reessayerRechercheCommune} aria-label="Réessayer la recherche de communes">
                                  <ReplayIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            {params.slotProps.input.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />
              <TextField
                label="Lieu (adresse)"
                value={formulaire.lieuAdresse}
                onChange={handleChange('lieuAdresse')}
                sx={{ flex: 1 }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Salaire" value={formulaire.salaire} onChange={handleChange('salaire')} fullWidth />
              <TextField
                label="URL d'origine"
                value={formulaire.urlOrigine}
                onChange={handleChange('urlOrigine')}
                fullWidth
              />
            </Stack>

            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Identifiant externe"
                value={formulaire.idExterne}
                onChange={handleChange('idExterne')}
                helperText="Optionnel — généré automatiquement si laissé vide"
                fullWidth
              />
              <TextField
                label="Provenance"
                value={formulaire.provenance}
                onChange={handleChange('provenance')}
                placeholder="LinkedIn, Indeed, site entreprise..."
                helperText="Optionnel — « Manuelle » par défaut"
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Date de création"
                type="datetime-local"
                value={formulaire.dateCreation}
                onChange={handleChange('dateCreation')}
                slotProps={{ inputLabel: { shrink: true } }}
                helperText="Optionnel — date de saisie par défaut"
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="etat-creation-label">État</InputLabel>
                <Select labelId="etat-creation-label" label="État" value={formulaire.etat} onChange={handleEtatChange}>
                  <MenuItem value="">
                    <em>Non précisé (Non lu)</em>
                  </MenuItem>
                  {ETATS_OFFRE.map((valeur) => (
                    <MenuItem key={valeur} value={valeur}>
                      {ETAT_LABELS[valeur]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button component={Link} to="/offres" disabled={creating}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={creating}
                startIcon={creating ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                Créer l'offre
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>

      <AppSnackbar state={snackbar.state} onClose={snackbar.close} />
      <AppSnackbar state={snackbarImport.state} onClose={snackbarImport.close} />
    </Box>
  )
}
