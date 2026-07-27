import { useCallback, useEffect, useReducer, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getOffres, mettreAJourEtat, synchroniser } from '@src/api/offresApi'
import { messageErreur } from '@src/api/apiClient'
import { useSnackbar } from '@src/hooks/useSnackbar'
import { initEtatDepuisParams, offresReducer } from './offresReducer'
import type { EtatOffre, Offre } from '@src/models/offre'
import type { PagedResponse } from '@src/models/pagedResponse'

export function useOffres() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, dispatch] = useReducer(offresReducer, searchParams, initEtatDepuisParams)
  const { selectedEtatFilter, appliedEtat, page, pageSize, selectedIds, bulkTargetEtat } = state

  const [data, setData] = useState<PagedResponse<Offre> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const snackbar = useSnackbar()

  const fetchOffres = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getOffres({ page, taille: pageSize, etat: appliedEtat })
      setData(result)
    } catch (err) {
      setError(messageErreur(err))
    } finally {
      setLoading(false)
    }
  }, [appliedEtat, page, pageSize])

  useEffect(() => {
    fetchOffres()
  }, [fetchOffres])

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('etat', appliedEtat)
        next.set('page', String(page))
        next.set('taille', String(pageSize))
        return next
      },
      { replace: true },
    )
  }, [appliedEtat, page, pageSize, setSearchParams])

  const executerMiseAJour = useCallback(
    async (etat: EtatOffre, idsExternes: string[]) => {
      setUpdating(true)
      try {
        await mettreAJourEtat({ idsExternes, etat })
        snackbar.showSuccess('État mis à jour avec succès')
        dispatch({ type: 'MISE_A_JOUR_REUSSIE' })
        await fetchOffres()
      } catch (err) {
        snackbar.showError(err)
        dispatch({ type: 'MISE_A_JOUR_ECHOUEE' })
      } finally {
        setUpdating(false)
      }
    },
    [fetchOffres],
  )

  useEffect(() => {
    if (!bulkTargetEtat || selectedIds.size === 0) {
      return
    }
    // Ne dépend volontairement que de bulkTargetEtat : on ne veut déclencher la mise à jour
    // qu'au choix d'un nouvel état cible, pas à chaque changement de la sélection.
    executerMiseAJour(bulkTargetEtat, Array.from(selectedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkTargetEtat])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await synchroniser()
      snackbar.showSuccess('Synchronisation terminée')
      await fetchOffres()
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setSyncing(false)
    }
  }

  return {
    filtre: {
      valeur: selectedEtatFilter,
      onChange: (etat: EtatOffre) => dispatch({ type: 'CHANGER_FILTRE', etat }),
      onRechercher: () => dispatch({ type: 'RECHERCHER' }),
    },
    liste: { data, loading, error },
    pagination: {
      page,
      pageSize,
      onPageChange: (newPage: number) => dispatch({ type: 'CHANGER_PAGE', page: newPage }),
      onPageSizeChange: (newPageSize: number) => dispatch({ type: 'CHANGER_TAILLE_PAGE', pageSize: newPageSize }),
    },
    selection: {
      selectedIds,
      toggleOne: (idExterne: string) => dispatch({ type: 'BASCULER_SELECTION', idExterne }),
      toggleAll: (checked: boolean) => {
        const ids = data?.resultats.map((offre) => offre.idExterne) ?? []
        dispatch({ type: 'BASCULER_TOUT', ids, checked })
      },
    },
    miseAJour: {
      cible: bulkTargetEtat,
      onCibleChange: (etat: EtatOffre) => dispatch({ type: 'CHANGER_ETAT_CIBLE', etat }),
      enCours: updating,
    },
    synchronisation: {
      enCours: syncing,
      onSynchroniser: handleSync,
    },
    snackbar,
  }
}
