import type { ReactNode } from 'react'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import type { SvgIconComponent } from '@mui/icons-material'
import WorkOutlineIcon from '@mui/icons-material/WorkOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined'
import { StatutCandidatureChip } from '@src/components/StatutCandidatureChip'
import { formatDateCreation } from '@src/utils/formatDate'
import {
  TYPE_CANDIDATURE_LABELS,
  type StatutCandidatureOffre,
  type StatutCandidatureSpontanee,
  type StatutPriseDeContact,
  type TypeCandidature,
} from '@src/models/candidature'

const ICONES: Record<TypeCandidature, SvgIconComponent> = {
  OFFRE: WorkOutlineIcon,
  SPONTANEE: SendOutlinedIcon,
  PRISE_DE_CONTACT: RecordVoiceOverOutlinedIcon,
}

const COULEURS_BORDURE: Record<TypeCandidature, string> = {
  OFFRE: 'primary.main',
  SPONTANEE: 'info.main',
  PRISE_DE_CONTACT: 'secondary.main',
}

type CandidatureTypeEncartProps = {
  titre: string
  dateCandidature: string
  children: ReactNode
} & (
  | { type: 'OFFRE'; statut: StatutCandidatureOffre }
  | { type: 'SPONTANEE'; statut: StatutCandidatureSpontanee }
  | { type: 'PRISE_DE_CONTACT'; statut: StatutPriseDeContact }
)

export function CandidatureTypeEncart(props: CandidatureTypeEncartProps) {
  const { titre, dateCandidature, children } = props
  const Icon = ICONES[props.type]

  return (
    <Paper variant="outlined" sx={{ p: 3, borderLeft: 4, borderLeftColor: COULEURS_BORDURE[props.type] }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
            <Icon fontSize="small" />
            <Typography variant="overline" sx={{ lineHeight: 1 }}>
              {TYPE_CANDIDATURE_LABELS[props.type]}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
              {titre}
            </Typography>
            {props.type === 'OFFRE' ? (
              <StatutCandidatureChip type="OFFRE" statut={props.statut} />
            ) : props.type === 'SPONTANEE' ? (
              <StatutCandidatureChip type="SPONTANEE" statut={props.statut} />
            ) : (
              <StatutCandidatureChip type="PRISE_DE_CONTACT" statut={props.statut} />
            )}
          </Stack>
        </Stack>

        <Typography variant="body2">
          <strong>Date de candidature :</strong> {formatDateCreation(dateCandidature)}
        </Typography>

        {children}
      </Stack>
    </Paper>
  )
}
