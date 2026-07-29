import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getCvs, telechargerCv } from '@src/api/cvApi'
import { ApiError, messageErreur } from '@src/api/apiClient'
import type { Cv } from '@src/models/cv'

export function useCvViewer(nomUnique: string) {
  const location = useLocation()

  const [cv, setCv] = useState<Cv | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let url: string | null = null
    let cancelled = false

    const charger = async () => {
      setLoading(true)
      setError(null)
      setNotFound(false)
      try {
        const cvFromState = (location.state as { cv?: Cv } | null)?.cv
        const cvCourant = cvFromState ?? (await getCvs()).find((c) => c.nomUnique === nomUnique)
        if (!cvCourant) {
          setNotFound(true)
          return
        }
        const blob = await telechargerCv(nomUnique)
        if (cancelled) return
        url = URL.createObjectURL(blob)
        setCv(cvCourant)
        setObjectUrl(url)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
        } else {
          setError(messageErreur(err))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    charger()

    return () => {
      cancelled = true
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [nomUnique, location.state])

  return { cv, objectUrl, loading, error, notFound }
}
