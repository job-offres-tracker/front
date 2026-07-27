import { useState } from 'react'
import { creerOffre as creerOffreApi } from '@src/api/offresApi'
import { useSnackbar } from '@src/hooks/useSnackbar'
import type { CreerOffreRequest } from '@src/models/creerOffreRequest'
import type { Offre } from '@src/models/offre'

export function useCreerOffre(onCreated: (offre: Offre) => void) {
  const [creating, setCreating] = useState(false)
  const snackbar = useSnackbar()

  const soumettre = async (payload: CreerOffreRequest): Promise<void> => {
    setCreating(true)
    try {
      const offre = await creerOffreApi(payload)
      onCreated(offre)
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setCreating(false)
    }
  }

  return { soumettre, creating, snackbar }
}
