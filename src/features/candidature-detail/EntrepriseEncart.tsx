import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MuiLink from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import EditIcon from '@mui/icons-material/Edit'
import {
  TYPE_ENTREPRISE_LABELS,
  type StatutCandidatureSpontanee,
  type StatutPriseDeContact,
  type TypeEntreprise,
} from '@src/models/candidature'
import { CandidatureTypeEncart } from './CandidatureTypeEncart'

type EntrepriseEncartProps = {
  nomEntreprise: string
  urlEntreprise?: string
  typeEntreprise: TypeEntreprise
  dateCandidature: string
} & (
  | { type: 'SPONTANEE'; statut: StatutCandidatureSpontanee }
  | { type: 'PRISE_DE_CONTACT'; statut: StatutPriseDeContact; poste?: string; client?: string; onEditer?: () => void }
)

function typeEntrepriseAutoriseClient(typeEntreprise: TypeEntreprise): boolean {
  return typeEntreprise === 'ESN' || typeEntreprise === 'CABINET_RECRUTEMENT'
}

export function EntrepriseEncart(props: EntrepriseEncartProps) {
  const { nomEntreprise, urlEntreprise, typeEntreprise, dateCandidature } = props

  const siteEntreprise = (
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
  )

  if (props.type === 'SPONTANEE') {
    return (
      <CandidatureTypeEncart type="SPONTANEE" titre={nomEntreprise} dateCandidature={dateCandidature} statut={props.statut}>
        <Stack spacing={1}>
          <Typography variant="body2">
            <strong>Type d'entreprise :</strong> {TYPE_ENTREPRISE_LABELS[typeEntreprise]}
          </Typography>
          {siteEntreprise}
        </Stack>
      </CandidatureTypeEncart>
    )
  }

  return (
    <CandidatureTypeEncart type="PRISE_DE_CONTACT" titre={nomEntreprise} dateCandidature={dateCandidature} statut={props.statut}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            <strong>Type d'entreprise :</strong> {TYPE_ENTREPRISE_LABELS[typeEntreprise]}
          </Typography>
          {props.onEditer && (
            <Tooltip title="Modifier">
              <IconButton size="small" onClick={props.onEditer} aria-label="Modifier la prise de contact">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        {siteEntreprise}
        <Typography variant="body2">
          <strong>Poste :</strong> {props.poste ?? '—'}
        </Typography>
        {typeEntrepriseAutoriseClient(typeEntreprise) && (
          <Typography variant="body2">
            <strong>Client :</strong> {props.client ?? '—'}
          </Typography>
        )}
      </Stack>
    </CandidatureTypeEncart>
  )
}
