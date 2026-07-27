import type { EtatOffre, Lieu } from './offre'

export interface CreerOffreRequest {
  idExterne?: string
  intitule: string
  description?: string
  entreprise?: string
  lieu?: Lieu
  typeContrat?: string
  salaire?: string
  urlOrigine?: string
  dateCreation?: string
  provenance?: string
  etat?: EtatOffre
}
