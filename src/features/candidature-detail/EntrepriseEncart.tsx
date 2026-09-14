import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import MuiLink from '@mui/material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { StatutCandidatureChip } from '@src/components/StatutCandidatureChip'
import { formatDateCreation } from '@src/utils/formatDate'
import { TYPE_ENTREPRISE_LABELS, type StatutCandidatureSpontanee, type StatutPriseDeContact, type TypeEntreprise } from '@src/models/candidature'

interface EntrepriseEncartProps {
  type: 'SPONTANEE' | 'PRISE_DE_CONTACT'
  nomEntreprise: string
  urlEntreprise?: string
  typeEntreprise: TypeEntreprise
  statutCandidatureSpontanee?: StatutCandidatureSpontanee
  statutPriseDeContact?: StatutPriseDeContact
  dateCandidature: string
}

export function EntrepriseEncart({
  type,
  nomEntreprise,
  urlEntreprise,
  typeEntreprise,
  statutCandidatureSpontanee,
  statutPriseDeContact,
  dateCandidature,
}: EntrepriseEncartProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
            {nomEntreprise}
          </Typography>
          <StatutCandidatureChip
            type={type}
            statutCandidatureSpontanee={statutCandidatureSpontanee}
            statutPriseDeContact={statutPriseDeContact}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Date de candidature :</strong> {formatDateCreation(dateCandidature)}
          </Typography>
          <Typography variant="body2">
            <strong>Type d'entreprise :</strong> {TYPE_ENTREPRISE_LABELS[typeEntreprise]}
          </Typography>
          <Typography variant="body2">
            <strong>Site de l'entreprise :</strong>{' '}
            {urlEntreprise ? (
              <MuiLink
                href={urlEntreprise}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
              >
                Voir le site
                <OpenInNewIcon fontSize="inherit" />
              </MuiLink>
            ) : (
              '—'
            )}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}
