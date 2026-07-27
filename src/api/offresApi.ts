import { request } from './apiClient'
import type { EtatOffre, Offre } from '@src/models/offre'
import type { PagedResponse } from '@src/models/pagedResponse'
import type { MettreAJourEtatRequest } from '@src/models/mettreAJourEtatRequest'
import type { CreerOffreRequest } from '@src/models/creerOffreRequest'
import type { BrouillonOffre } from '@src/models/brouillonOffre'

export interface ConsulterOffresParams {
  page: number
  taille: number
  etat?: EtatOffre
}

export function getOffres(params: ConsulterOffresParams): Promise<PagedResponse<Offre>> {
  const search = new URLSearchParams()
  search.set('page', String(params.page))
  search.set('taille', String(params.taille))
  if (params.etat) {
    search.append('etats', params.etat)
  }
  return request<PagedResponse<Offre>>(`/api/v1/offres?${search.toString()}`)
}

export function getOffre(idExterne: string): Promise<Offre> {
  return request<Offre>(`/api/v1/offres/${encodeURIComponent(idExterne)}`)
}

export function creerOffre(payload: CreerOffreRequest): Promise<Offre> {
  return request<Offre>('/api/v1/offres', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function mettreAJourEtat(payload: MettreAJourEtatRequest): Promise<void> {
  return request<void>('/api/v1/offres/etat', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function synchroniser(): Promise<void> {
  return request<void>('/api/v1/offres/synchroniser', { method: 'POST' })
}

export function importerOffre(url: string): Promise<BrouillonOffre> {
  return request<BrouillonOffre>('/api/v1/offres/importer', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })
}
