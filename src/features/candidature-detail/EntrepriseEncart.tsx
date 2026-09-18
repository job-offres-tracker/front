import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MuiLink from '@mui/material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
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
} & ({ type: 'SPONTANEE'; statut: StatutCandidatureSpontanee } | { type: 'PRISE_DE_CONTACT'; statut: StatutPriseDeContact })

export function EntrepriseEncart(props: EntrepriseEncartProps) {
  const { nomEntreprise, urlEntreprise, typeEntreprise, dateCandidature } = props

  const contenu = (
    <Stack spacing={1}>
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
  )

  return props.type === 'SPONTANEE' ? (
    <CandidatureTypeEncart type="SPONTANEE" titre={nomEntreprise} dateCandidature={dateCandidature} statut={props.statut}>
      {contenu}
    </CandidatureTypeEncart>
  ) : (
    <CandidatureTypeEncart
      type="PRISE_DE_CONTACT"
      titre={nomEntreprise}
      dateCandidature={dateCandidature}
      statut={props.statut}
    >
      {contenu}
    </CandidatureTypeEncart>
  )
}
