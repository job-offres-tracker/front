import { request, requestBlob, requestUpload } from './apiClient'
import type { PagedResponse } from '@src/models/pagedResponse'
import type { CandidatureDetail, CandidatureListItem, DocumentCandidature, EvenementRequest, Evenement } from '@src/models/candidature'
import type { CreerCandidatureSpontaneeRequest } from '@src/models/creerCandidatureSpontaneeRequest'
import type { CreerPriseDeContactRequest } from '@src/models/creerPriseDeContactRequest'
import type { ModifierStatutCandidatureRequest } from '@src/models/modifierStatutCandidatureRequest'

export interface ConsulterCandidaturesParams {
  page: number
  taille: number
}

export function getCandidatures(params: ConsulterCandidaturesParams): Promise<PagedResponse<CandidatureListItem>> {
  const search = new URLSearchParams()
  search.set('page', String(params.page))
  search.set('taille', String(params.taille))
  return request<PagedResponse<CandidatureListItem>>(`/candidatures?${search.toString()}`)
}

export function getCandidature(id: number): Promise<CandidatureDetail> {
  return request<CandidatureDetail>(`/candidatures/${id}`)
}

export function getCandidatureParOffre(idExterne: string): Promise<CandidatureDetail> {
  return request<CandidatureDetail>(`/candidatures/par-offre/${encodeURIComponent(idExterne)}`)
}

export function creerCandidatureSpontanee(payload: CreerCandidatureSpontaneeRequest): Promise<CandidatureDetail> {
  return request<CandidatureDetail>('/candidatures/spontanee', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function creerPriseDeContact(payload: CreerPriseDeContactRequest): Promise<CandidatureDetail> {
  return request<CandidatureDetail>('/candidatures/prise-de-contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function modifierStatutCandidature(candidatureId: number, statut: string): Promise<CandidatureDetail> {
  const payload: ModifierStatutCandidatureRequest = { statut }
  return request<CandidatureDetail>(`/candidatures/${candidatureId}/statut`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function ajouterEvenement(candidatureId: number, payload: EvenementRequest): Promise<Evenement> {
  return request<Evenement>(`/candidatures/${candidatureId}/evenements`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function modifierEvenement(candidatureId: number, evenementId: number, payload: EvenementRequest): Promise<Evenement> {
  return request<Evenement>(`/candidatures/${candidatureId}/evenements/${evenementId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function ajouterDocumentCv(candidatureId: number, cvNomUnique: string): Promise<DocumentCandidature> {
  return request<DocumentCandidature>(`/candidatures/${candidatureId}/documents/cv`, {
    method: 'POST',
    body: JSON.stringify({ cvNomUnique }),
  })
}

export function ajouterDocumentFichier(candidatureId: number, file: File, libelle: string): Promise<DocumentCandidature> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('libelle', libelle)
  return requestUpload<DocumentCandidature>(`/candidatures/${candidatureId}/documents/fichier`, formData)
}

export function ajouterDocumentTexte(candidatureId: number, libelle: string, contenu: string): Promise<DocumentCandidature> {
  return request<DocumentCandidature>(`/candidatures/${candidatureId}/documents/texte`, {
    method: 'POST',
    body: JSON.stringify({ libelle, contenu }),
  })
}

export function telechargerDocument(candidatureId: number, documentId: number): Promise<Blob> {
  return requestBlob(`/candidatures/${candidatureId}/documents/${documentId}/fichier`)
}
