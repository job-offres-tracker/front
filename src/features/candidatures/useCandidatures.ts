import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCandidatures } from '@src/api/candidaturesApi'
import { messageErreur } from '@src/api/apiClient'
import type { CandidatureListItem } from '@src/models/candidature'
import type { PagedResponse } from '@src/models/pagedResponse'

function lireEntierParam(searchParams: URLSearchParams, cle: string, valeurParDefaut: number): number {
  const valeur = Number(searchParams.get(cle))
  return Number.isInteger(valeur) && valeur >= 0 ? valeur : valeurParDefaut
}

export function useCandidatures() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(() => lireEntierParam(searchParams, 'page', 0))
  const [pageSize, setPageSize] = useState(() => lireEntierParam(searchParams, 'taille', 20) || 20)

  const [data, setData] = useState<PagedResponse<CandidatureListItem> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCandidatures = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getCandidatures({ page, taille: pageSize })
      setData(result)
    } catch (err) {
      setError(messageErreur(err))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchCandidatures()
  }, [fetchCandidatures])

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('page', String(page))
        next.set('taille', String(pageSize))
        return next
      },
      { replace: true },
    )
  }, [page, pageSize, setSearchParams])

  return {
    liste: { data, loading, error },
    pagination: {
      page,
      pageSize,
      onPageChange: setPage,
      onPageSizeChange: (nouvelleTaille: number) => {
        setPageSize(nouvelleTaille)
        setPage(0)
      },
    },
  }
}
