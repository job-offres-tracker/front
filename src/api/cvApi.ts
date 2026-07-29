import { request, requestBlob, requestUpload } from './apiClient'
import type { Cv } from '@src/models/cv'

export function getCvs(): Promise<Cv[]> {
  return request<Cv[]>('/cvs')
}

export function uploaderCv(file: File, nom: string): Promise<Cv> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('nom', nom)
  return requestUpload<Cv>('/cvs', formData)
}

export function telechargerCv(nomUnique: string): Promise<Blob> {
  return requestBlob(`/cvs/${encodeURIComponent(nomUnique)}`)
}
