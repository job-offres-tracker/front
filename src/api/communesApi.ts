import { request } from './apiClient'
import type { Commune } from '@src/models/commune'

export function getCommunes(q: string, signal?: AbortSignal): Promise<Commune[]> {
  const search = new URLSearchParams({ q })
  return request<Commune[]>(`/communes?${search.toString()}`, { signal })
}
