import Chip from '@mui/material/Chip'
import type { ChipProps } from '@mui/material/Chip'
import { ETAT_LABELS, type EtatOffre } from '@src/models/offre'
import {
  STATUT_CANDIDATURE_SPONTANEE_LABELS,
  STATUT_PRISE_DE_CONTACT_LABELS,
  type StatutCandidatureSpontanee,
  type StatutPriseDeContact,
  type TypeCandidature,
} from '@src/models/candidature'

const COULEURS_OFFRE: Record<EtatOffre, ChipProps['color']> = {
  NON_LU: 'default',
  LU: 'info',
  POSTULE: 'primary',
  ENTRETIEN: 'warning',
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

interface StatutCandidatureChipProps {
  type: TypeCandidature
  etat?: EtatOffre
  statutCandidatureSpontanee?: StatutCandidatureSpontanee
  statutPriseDeContact?: StatutPriseDeContact
}

export function StatutCandidatureChip({ type, etat, statutCandidatureSpontanee, statutPriseDeContact }: StatutCandidatureChipProps) {
  if (type === 'OFFRE' && etat) {
    return <Chip label={ETAT_LABELS[etat]} color={COULEURS_OFFRE[etat]} size="small" />
  }
  if (type === 'SPONTANEE' && statutCandidatureSpontanee) {
    return (
      <Chip
        label={STATUT_CANDIDATURE_SPONTANEE_LABELS[statutCandidatureSpontanee]}
        color={COULEURS_SPONTANEE[statutCandidatureSpontanee]}
        size="small"
      />
    )
  }
  if (type === 'PRISE_DE_CONTACT' && statutPriseDeContact) {
    return (
      <Chip
        label={STATUT_PRISE_DE_CONTACT_LABELS[statutPriseDeContact]}
        color={COULEURS_PRISE_DE_CONTACT[statutPriseDeContact]}
        size="small"
      />
    )
  }
  return <Chip label="—" size="small" />
}
