import Chip from '@mui/material/Chip'
import type { ChipProps } from '@mui/material/Chip'
import {
  STATUT_CANDIDATURE_OFFRE_LABELS,
  STATUT_CANDIDATURE_SPONTANEE_LABELS,
  STATUT_PRISE_DE_CONTACT_LABELS,
  type StatutCandidatureOffre,
  type StatutCandidatureSpontanee,
  type StatutPriseDeContact,
} from '@src/models/candidature'

const COULEURS_OFFRE: Record<StatutCandidatureOffre, ChipProps['color']> = {
  POSTULE: 'primary',
  ACCEPTE: 'success',
  REFUSE: 'error',
  RECALE: 'error',
}

const COULEURS_SPONTANEE: Record<StatutCandidatureSpontanee, ChipProps['color']> = {
  ENVOYE: 'primary',
  ACCEPTE: 'success',
  REFUSE: 'error',
  RECALE: 'error',
}

const COULEURS_PRISE_DE_CONTACT: Record<StatutPriseDeContact, ChipProps['color']> = {
  ETABLI: 'primary',
  ACCEPTE: 'success',
  REFUSE: 'error',
  RECALE: 'error',
}

export type StatutCandidatureChipProps =
  | { type: 'OFFRE'; statut: StatutCandidatureOffre }
  | { type: 'SPONTANEE'; statut: StatutCandidatureSpontanee }
  | { type: 'PRISE_DE_CONTACT'; statut: StatutPriseDeContact }

export function StatutCandidatureChip(props: StatutCandidatureChipProps) {
  switch (props.type) {
    case 'OFFRE':
      return <Chip label={STATUT_CANDIDATURE_OFFRE_LABELS[props.statut]} color={COULEURS_OFFRE[props.statut]} size="small" />
    case 'SPONTANEE':
      return (
        <Chip label={STATUT_CANDIDATURE_SPONTANEE_LABELS[props.statut]} color={COULEURS_SPONTANEE[props.statut]} size="small" />
      )
    case 'PRISE_DE_CONTACT':
      return (
        <Chip
          label={STATUT_PRISE_DE_CONTACT_LABELS[props.statut]}
          color={COULEURS_PRISE_DE_CONTACT[props.statut]}
          size="small"
        />
      )
  }
}
