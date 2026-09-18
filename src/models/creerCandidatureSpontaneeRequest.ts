import type { StatutCandidatureSpontanee, TypeEntreprise } from './candidature'

export interface CreerCandidatureSpontaneeRequest {
  nomEntreprise: string
  urlEntreprise?: string
  typeEntreprise: TypeEntreprise
  statut?: StatutCandidatureSpontanee
  dateCandidature?: string
}
