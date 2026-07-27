export interface PagedResponse<T> {
  page: number
  taille: number
  nombreResultats: number
  totalElements: number
  totalPages: number
  resultats: T[]
}
