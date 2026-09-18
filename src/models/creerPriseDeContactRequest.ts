import type { StatutPriseDeContact, TypeEntreprise } from './candidature'

export interface CreerPriseDeContactRequest {
  nomEntreprise: string
  urlEntreprise?: string
  typeEntreprise: TypeEntreprise
  statut?: StatutPriseDeContact
  dateCandidature?: string
}
