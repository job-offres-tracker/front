import { useCallback, useEffect, useState } from 'react'
import {
  ajouterDocumentCv,
  ajouterDocumentFichier,
  ajouterDocumentTexte,
  ajouterEvenement,
  getCandidature,
  modifierEvenement,
  telechargerDocument,
} from '@src/api/candidaturesApi'
import { telechargerCv } from '@src/api/cvApi'
import { ApiError, messageErreur } from '@src/api/apiClient'
import { useSnackbar } from '@src/hooks/useSnackbar'
import type { CandidatureDetail, DocumentCandidature, EvenementRequest } from '@src/models/candidature'

function telechargerBlob(blob: Blob, nomFichier: string) {
  const url = URL.createObjectURL(blob)
  const lien = document.createElement('a')
  lien.href = url
  lien.download = nomFichier
  lien.click()
  URL.revokeObjectURL(url)
}

export function useCandidatureDetail(id: number) {
  const [candidature, setCandidature] = useState<CandidatureDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const snackbar = useSnackbar()

  const fetchCandidature = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      const result = await getCandidature(id)
      setCandidature(result)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true)
      } else {
        setError(messageErreur(err))
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCandidature()
  }, [fetchCandidature])

  async function executerAction(action: () => Promise<unknown>, messageSucces: string): Promise<boolean> {
    setSaving(true)
    try {
      await action()
      snackbar.showSuccess(messageSucces)
      await fetchCandidature()
      return true
    } catch (err) {
      snackbar.showError(err)
      return false
    } finally {
      setSaving(false)
    }
  }

  const creerEvenement = (payload: EvenementRequest) =>
    executerAction(() => ajouterEvenement(id, payload), 'Événement ajouté')

  const editerEvenement = (evenementId: number, payload: EvenementRequest) =>
    executerAction(() => modifierEvenement(id, evenementId, payload), 'Événement modifié')

  const ajouterCv = (cvNomUnique: string) =>
    executerAction(() => ajouterDocumentCv(id, cvNomUnique), 'Document ajouté')

  const ajouterFichier = (file: File, libelle: string) =>
    executerAction(() => ajouterDocumentFichier(id, file, libelle), 'Document ajouté')

  const ajouterTexte = (libelle: string, contenu: string) =>
    executerAction(() => ajouterDocumentTexte(id, libelle, contenu), 'Document ajouté')

  const telecharger = async (document: DocumentCandidature) => {
    try {
      const blob = document.cvNomUnique
        ? await telechargerCv(document.cvNomUnique)
        : await telechargerDocument(id, document.id)
      telechargerBlob(blob, document.libelle)
    } catch (err) {
      snackbar.showError(err)
    }
  }

  return {
    candidature,
    loading,
    error,
    notFound,
    saving,
    snackbar,
    creerEvenement,
    editerEvenement,
    ajouterCv,
    ajouterFichier,
    ajouterTexte,
    telecharger,
  }
}
