import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import MuiLink from '@mui/material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DescriptionIcon from '@mui/icons-material/Description'
import { StatutCandidatureChip } from '@src/components/StatutCandidatureChip'
import { formatDateCreation } from '@src/utils/formatDate'
import type { Offre } from '@src/models/offre'

interface OffreEncartProps {
  offre: Offre
  dateCandidature: string
  onVoirDescription: () => void
}

export function OffreEncart({ offre, dateCandidature, onVoirDescription }: OffreEncartProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
            {offre.intitule}
          </Typography>
          <StatutCandidatureChip type="OFFRE" etat={offre.etat} />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Date de candidature :</strong> {formatDateCreation(dateCandidature)}
          </Typography>
          <Typography variant="body2">
            <strong>Entreprise :</strong> {offre.entreprise ?? '—'}
          </Typography>
          <Typography variant="body2">
            <strong>Type de contrat :</strong> {offre.typeContrat ?? '—'}
          </Typography>
          <Typography variant="body2">
            <strong>Salaire :</strong> {offre.salaire ?? '—'}
          </Typography>
          <Typography variant="body2">
            <strong>Lieu :</strong> {[offre.lieu?.libelle, offre.lieu?.adresse].filter(Boolean).join(' — ') || '—'}
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

        <Box>
          <Button variant="outlined" startIcon={<DescriptionIcon />} onClick={onVoirDescription}>
            Voir la description
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}
