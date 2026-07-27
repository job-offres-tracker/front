import { useCallback, useEffect, useRef, useState } from 'react'
import { getCommunes } from '@src/api/communesApi'
import type { Commune } from '@src/models/commune'

const DEBOUNCE_MS = 300
const LONGUEUR_MIN_RECHERCHE = 2

export function useRechercheCommune() {
  const [options, setOptions] = useState<Commune[]>([])
  const [loading, setLoading] = useState(false)
  const [serviceIndisponible, setServiceIndisponible] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const derniereRechercheRef = useRef('')

  const executerRecherche = useCallback((q: string) => {
    derniereRechercheRef.current = q
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    getCommunes(q, controller.signal)
      .then((communes) => {
        setOptions(communes)
        setServiceIndisponible(false)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        setOptions([])
        setServiceIndisponible(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const rechercher = useCallback(
    (q: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      const valeur = q.trim()
      if (valeur.length < LONGUEUR_MIN_RECHERCHE) {
        setOptions([])
        return
      }
      timeoutRef.current = setTimeout(() => executerRecherche(valeur), DEBOUNCE_MS)
    },
    [executerRecherche],
  )

  const reessayer = useCallback(() => {
    if (derniereRechercheRef.current) {
      executerRecherche(derniereRechercheRef.current)
    }
  }, [executerRecherche])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      abortRef.current?.abort()
    }
  }, [])

  return { options, loading, serviceIndisponible, rechercher, reessayer }
}
