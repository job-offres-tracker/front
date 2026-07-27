import { useCallback, useEffect, useState } from 'react'
import { getOffre, mettreAJourEtat } from '@src/api/offresApi'
import { ApiError, messageErreur } from '@src/api/apiClient'
import { useSnackbar } from '@src/hooks/useSnackbar'
import type { EtatOffre, Offre } from '@src/models/offre'

export function useOffreDetail(idExterne: string) {
  const [offre, setOffre] = useState<Offre | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [updating, setUpdating] = useState(false)
  const snackbar = useSnackbar()

  const fetchOffre = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      const result = await getOffre(idExterne)
      setOffre(result)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true)
      } else {
        setError(messageErreur(err))
      }
    } finally {
      setLoading(false)
    }
  }, [idExterne])

  useEffect(() => {
    fetchOffre()
  }, [fetchOffre])

  const changerEtat = async (etat: EtatOffre) => {
    setUpdating(true)
    try {
      await mettreAJourEtat({ idsExternes: [idExterne], etat })
      snackbar.showSuccess('État mis à jour avec succès')
      await fetchOffre()
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setUpdating(false)
    }
  }

  return { offre, loading, error, notFound, updating, snackbar, changerEtat }
}
