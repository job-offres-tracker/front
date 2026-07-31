import DOMPurify from 'dompurify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import MuiLink from '@mui/material/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { SelectChangeEvent } from '@mui/material/Select'
import { EtatChip } from '@src/components/EtatChip'
import { formatDateCreation } from '@src/utils/formatDate'
import { ETATS_OFFRE, ETATS_POST_CANDIDATURE, ETAT_LABELS, type EtatOffre } from '@src/models/offre'
import { useOffreDetail } from './useOffreDetail'

export function OffreDetailPage() {
  const { idExterne } = useParams<{ idExterne: string }>()
  const navigate = useNavigate()
  const { offre, loading, error, notFound, updating, snackbar, changerEtat } = useOffreDetail(idExterne ?? '')

  const handleEtatChange = (event: SelectChangeEvent) => {
    changerEtat(event.target.value as EtatOffre)
  }

  // Une fois une candidature engagée (POSTULE/ENTRETIEN/ACCEPTE/RECALE), il n'est plus possible
  // de revenir à NON_LU/LU (voir TransitionEtatInvalideException côté backend).
  const etatsSelectionnables = offre && ETATS_POST_CANDIDATURE.includes(offre.etat)
    ? ETATS_OFFRE.filter((etat) => etat !== 'NON_LU' && etat !== 'LU')
    : ETATS_OFFRE

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Retour à la liste
          </Button>
          <Typography variant="h5" component="h1">
            Détail de l'offre
          </Typography>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && notFound && (
          <Alert severity="warning">
            Offre introuvable.{' '}
            <Link to="/offres" style={{ color: 'inherit' }}>
              Retourner à la liste
            </Link>
          </Alert>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && offre && (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                  {offre.intitule}
                </Typography>
                <EtatChip etat={offre.etat} />
              </Stack>

              <FormControl size="small" sx={{ maxWidth: 260 }}>
                <InputLabel id="etat-offre-label">État</InputLabel>
                <Select
                  labelId="etat-offre-label"
                  label="État"
                  value={offre.etat}
                  onChange={handleEtatChange}
                  disabled={updating}
                >
                  {etatsSelectionnables.map((etat) => (
                    <MenuItem key={etat} value={etat}>
                      {ETAT_LABELS[etat]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider />

              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Date création :</strong> {formatDateCreation(offre.dateCreation)}
                </Typography>
                <Typography variant="body2">
                  <strong>Entreprise :</strong> {offre.entreprise ?? '—'}
                </Typography>
                <Typography variant="body2">
                  <strong>Salaire :</strong> {offre.salaire ?? '—'}
                </Typography>
                <Typography variant="body2">
                  <strong>Lieu :</strong>{' '}
                  {[offre.lieu?.libelle, offre.lieu?.adresse].filter(Boolean).join(' — ') || '—'}
                </Typography>
                <Typography variant="body2">
                  <strong>Origine :</strong> {offre.provenance ?? '—'}
                </Typography>
                <Typography variant="body2">
                  <strong>Offre originale :</strong>{' '}
                  {offre.urlOrigine ? (
                    <MuiLink
                      href={offre.urlOrigine}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                    >
                      Voir l'offre originale
                      <OpenInNewIcon fontSize="inherit" />
                    </MuiLink>
                  ) : (
                    '—'
                  )}
                </Typography>
              </Stack>

              <Divider />

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Description
                </Typography>
                {offre.description ? (
                  <Box
                    sx={{ whiteSpace: 'pre-wrap', '& img': { maxWidth: '100%' } }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(offre.description) }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucune description
                  </Typography>
                )}
              </Box>
            </Stack>
          </Paper>
        )}
      </Container>

      {snackbar.notificationNode}
    </>
  )
}
