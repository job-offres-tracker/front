import type { Lieu, Offre } from './offre'

export const TYPES_EVENEMENT = ['ENTRETIEN', 'RELANCE', 'MAIL'] as const
export type TypeEvenement = (typeof TYPES_EVENEMENT)[number]

export const TYPE_EVENEMENT_LABELS: Record<TypeEvenement, string> = {
  ENTRETIEN: 'Entretien',
  RELANCE: 'Relance',
  MAIL: 'Mail',
}

export const TYPES_DOCUMENT = ['CV', 'FICHIER', 'TEXTE'] as const
export type TypeDocument = (typeof TYPES_DOCUMENT)[number]

export const TYPES_CANDIDATURE = ['OFFRE', 'SPONTANEE', 'PRISE_DE_CONTACT'] as const
export type TypeCandidature = (typeof TYPES_CANDIDATURE)[number]

export const TYPE_CANDIDATURE_LABELS: Record<TypeCandidature, string> = {
  OFFRE: 'Offre',
  SPONTANEE: 'Candidature spontanée',
  PRISE_DE_CONTACT: 'Prise de contact',
}

export const TYPES_ENTREPRISE = ['ESN', 'CABINET_RECRUTEMENT', 'EDITEUR'] as const
export type TypeEntreprise = (typeof TYPES_ENTREPRISE)[number]

export const TYPE_ENTREPRISE_LABELS: Record<TypeEntreprise, string> = {
  ESN: 'ESN',
  CABINET_RECRUTEMENT: 'Cabinet de recrutement',
  EDITEUR: 'Éditeur',
}

export const STATUTS_CANDIDATURE_OFFRE = ['POSTULE', 'REFUSE', 'ACCEPTE', 'RECALE'] as const
export type StatutCandidatureOffre = (typeof STATUTS_CANDIDATURE_OFFRE)[number]

export const STATUT_CANDIDATURE_OFFRE_LABELS: Record<StatutCandidatureOffre, string> = {
  POSTULE: 'Postulée',
  REFUSE: 'Refusée',
  ACCEPTE: 'Acceptée',
  RECALE: 'Recalée',
}

export const STATUTS_CANDIDATURE_SPONTANEE = ['ENVOYE', 'REFUSE', 'ACCEPTE', 'RECALE'] as const
export type StatutCandidatureSpontanee = (typeof STATUTS_CANDIDATURE_SPONTANEE)[number]

export const STATUT_CANDIDATURE_SPONTANEE_LABELS: Record<StatutCandidatureSpontanee, string> = {
  ENVOYE: 'Envoyée',
  REFUSE: 'Refusée',
  ACCEPTE: 'Acceptée',
  RECALE: 'Recalée',
}

export const STATUTS_PRISE_DE_CONTACT = ['ETABLI', 'REFUSE', 'ACCEPTE', 'RECALE'] as const
export type StatutPriseDeContact = (typeof STATUTS_PRISE_DE_CONTACT)[number]

export const STATUT_PRISE_DE_CONTACT_LABELS: Record<StatutPriseDeContact, string> = {
  ETABLI: 'Établie',
  REFUSE: 'Refusée',
  ACCEPTE: 'Acceptée',
  RECALE: 'Recalée',
}

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

interface CandidatureListItemBase {
  id: number
  entreprise?: string
  dateCandidature: string
}

export type CandidatureListItem =
  | (CandidatureListItemBase & {
      type: 'OFFRE'
      idExterne: string
      intitule: string
      statutCandidatureOffre: StatutCandidatureOffre
      lieu?: Lieu
    })
  | (CandidatureListItemBase & { type: 'SPONTANEE'; statutCandidatureSpontanee: StatutCandidatureSpontanee })
  | (CandidatureListItemBase & { type: 'PRISE_DE_CONTACT'; statutPriseDeContact: StatutPriseDeContact })

interface CandidatureDetailBase {
  id: number
  dateCandidature: string
  evenements: Evenement[]
  documents: DocumentCandidature[]
}

export type CandidatureDetail =
  | (CandidatureDetailBase & { type: 'OFFRE'; offre: Offre; statutCandidatureOffre: StatutCandidatureOffre })
  | (CandidatureDetailBase & {
      type: 'SPONTANEE'
      nomEntreprise: string
      urlEntreprise?: string
      typeEntreprise: TypeEntreprise
      statutCandidatureSpontanee: StatutCandidatureSpontanee
    })
  | (CandidatureDetailBase & {
      type: 'PRISE_DE_CONTACT'
      nomEntreprise: string
      urlEntreprise?: string
      typeEntreprise: TypeEntreprise
      statutPriseDeContact: StatutPriseDeContact
    })

export interface EvenementRequest {
  date: string
  type: TypeEvenement
  description?: string
}
