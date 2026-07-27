import Chip from '@mui/material/Chip'
import type { ChipProps } from '@mui/material/Chip'
import { ETAT_LABELS, type EtatOffre } from '@src/models/offre'

const COULEURS: Record<EtatOffre, ChipProps['color']> = {
  NON_LU: 'default',
  LU: 'info',
  POSTULE: 'primary',
  ENTRETIEN: 'warning',
  ACCEPTE: 'success',
  REFUSE: 'error',
  RECALE: 'error',
}

export function EtatChip({ etat }: { etat: EtatOffre }) {
  return <Chip label={ETAT_LABELS[etat]} color={COULEURS[etat]} size="small" />
}
