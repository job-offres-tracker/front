import type { EtatOffre, Lieu, Offre } from './offre'

export const TYPES_EVENEMENT = ['ENTRETIEN', 'RELANCE', 'MAIL'] as const
export type TypeEvenement = (typeof TYPES_EVENEMENT)[number]

export const TYPE_EVENEMENT_LABELS: Record<TypeEvenement, string> = {
  ENTRETIEN: 'Entretien',
  RELANCE: 'Relance',
  MAIL: 'Mail',
}

export const TYPES_DOCUMENT = ['CV', 'FICHIER', 'TEXTE'] as const
export type TypeDocument = (typeof TYPES_DOCUMENT)[number]

export interface Evenement {
  id: number
  date: string
  type: TypeEvenement
  description?: string
}

export interface DocumentCandidature {
  id: number
  type: TypeDocument
  libelle: string
  cvNomUnique?: string
  tailleOctets?: number
  contentType?: string
  contenuTexte?: string
  dateAjout: string
}

export interface CandidatureListItem {
  id: number
  idExterne: string
  intitule: string
  etat: EtatOffre
  entreprise?: string
  lieu?: Lieu
  dateCandidature: string
}

export interface CandidatureDetail {
  id: number
  dateCandidature: string
  offre: Offre
  evenements: Evenement[]
  documents: DocumentCandidature[]
}

export interface EvenementRequest {
  date: string
  type: TypeEvenement
  description?: string
}
