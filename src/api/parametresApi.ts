import { request } from './apiClient'
import type { ParametresRecherche } from '@src/models/parametresRecherche'
import type { ParametresCv } from '@src/models/parametresCv'
import type { ParametresDocumentCandidature } from '@src/models/parametresDocumentCandidature'

export function getParametresRecherche(): Promise<ParametresRecherche> {
  return request<ParametresRecherche>('/parametres/recherche')
}

export function modifierParametresRecherche(payload: ParametresRecherche): Promise<ParametresRecherche> {
  return request<ParametresRecherche>('/parametres/recherche', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function getParametresCv(): Promise<ParametresCv> {
  return request<ParametresCv>('/parametres/cv')
}

export function modifierParametresCv(payload: ParametresCv): Promise<ParametresCv> {
  return request<ParametresCv>('/parametres/cv', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function getParametresDocumentCandidature(): Promise<ParametresDocumentCandidature> {
  return request<ParametresDocumentCandidature>('/parametres/document-candidature')
}

export function modifierParametresDocumentCandidature(
  payload: ParametresDocumentCandidature,
): Promise<ParametresDocumentCandidature> {
  return request<ParametresDocumentCandidature>('/parametres/document-candidature', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
