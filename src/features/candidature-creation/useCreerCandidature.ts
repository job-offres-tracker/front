import { useState } from 'react'
import { creerCandidatureSpontanee, creerPriseDeContact } from '@src/api/candidaturesApi'
import { useSnackbar } from '@src/hooks/useSnackbar'
import type { CreerCandidatureSpontaneeRequest } from '@src/models/creerCandidatureSpontaneeRequest'
import type { CreerPriseDeContactRequest } from '@src/models/creerPriseDeContactRequest'
import type { CandidatureDetail } from '@src/models/candidature'

export function useCreerCandidature(onCreated: (candidature: CandidatureDetail) => void) {
  const [creating, setCreating] = useState(false)
  const snackbar = useSnackbar()

  const soumettreSpontanee = async (payload: CreerCandidatureSpontaneeRequest): Promise<void> => {
    setCreating(true)
    try {
      const candidature = await creerCandidatureSpontanee(payload)
      onCreated(candidature)
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setCreating(false)
    }
  }

  const soumettrePriseDeContact = async (payload: CreerPriseDeContactRequest): Promise<void> => {
    setCreating(true)
    try {
      const candidature = await creerPriseDeContact(payload)
      onCreated(candidature)
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setCreating(false)
    }
  }

  return { soumettreSpontanee, soumettrePriseDeContact, creating, snackbar }
}
