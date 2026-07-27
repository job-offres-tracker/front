import type { EtatOffre } from './offre'

export interface MettreAJourEtatRequest {
  idsExternes: string[]
  etat: EtatOffre
}
