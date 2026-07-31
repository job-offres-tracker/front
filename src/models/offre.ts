export const ETATS_OFFRE = [
  'NON_LU',
  'LU',
  'REFUSE',
  'POSTULE',
  'ENTRETIEN',
  'ACCEPTE',
  'RECALE',
] as const

export type EtatOffre = (typeof ETATS_OFFRE)[number]

export const ETAT_LABELS: Record<EtatOffre, string> = {
  NON_LU: 'Non lu',
  LU: 'Lu',
  REFUSE: 'Refusé',
  POSTULE: 'Postulé',
  ENTRETIEN: 'Entretien',
  ACCEPTE: 'Accepté',
  RECALE: 'Recalé',
}

// États à partir desquels une candidature existe déjà : il n'est plus possible de
// revenir à NON_LU/LU (voir TransitionEtatInvalideException côté backend).
export const ETATS_POST_CANDIDATURE: EtatOffre[] = ['POSTULE', 'ENTRETIEN', 'ACCEPTE', 'RECALE']

export interface Lieu {
  libelle?: string
  codeCommune?: string
  latitude?: number
  longitude?: number
  adresse?: string
}

export interface Offre {
  idExterne: string
  intitule: string
  description?: string
  entreprise?: string
  lieu?: Lieu
  typeContrat?: string
  salaire?: string
  urlOrigine?: string
  dateCreation: string
  etat: EtatOffre
  provenance?: string
}
