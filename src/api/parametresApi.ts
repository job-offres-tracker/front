import { request } from './apiClient'
import type { ParametresRecherche } from '@src/models/parametresRecherche'
import type { ParametresCv } from '@src/models/parametresCv'

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
