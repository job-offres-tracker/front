import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiLink from '@mui/material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DescriptionIcon from '@mui/icons-material/Description'
import { EtatChip } from '@src/components/EtatChip'
import type { StatutCandidatureOffre } from '@src/models/candidature'
import type { Offre } from '@src/models/offre'
import { CandidatureTypeEncart } from './CandidatureTypeEncart'

interface OffreEncartProps {
  offre: Offre
  statutCandidatureOffre: StatutCandidatureOffre
  dateCandidature: string
  onVoirDescription: () => void
}

export function OffreEncart({ offre, statutCandidatureOffre, dateCandidature, onVoirDescription }: OffreEncartProps) {
  return (
    <CandidatureTypeEncart type="OFFRE" titre={offre.intitule} dateCandidature={dateCandidature} statut={statutCandidatureOffre}>
      <Stack spacing={1}>
        <Typography variant="body2" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <strong>État de l'offre :</strong> <EtatChip etat={offre.etat} />
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
    </CandidatureTypeEncart>
  )
}
