import type { StatutPriseDeContact, TypeEntreprise } from './candidature'

export interface CreerPriseDeContactRequest {
  nomEntreprise: string
  urlEntreprise?: string
  typeEntreprise: TypeEntreprise
  poste?: string
  client?: string
  statut?: StatutPriseDeContact
  dateCandidature?: string
}
