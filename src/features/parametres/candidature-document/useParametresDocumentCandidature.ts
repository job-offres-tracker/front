import { useEffect, useState } from 'react'
import { getParametresDocumentCandidature, modifierParametresDocumentCandidature } from '@src/api/parametresApi'
import { useSnackbar } from '@src/hooks/useSnackbar'

const OCTETS_PAR_MO = 1024 * 1024

export function useParametresDocumentCandidature() {
  const [tailleMaxMo, setTailleMaxMo] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const snackbar = useSnackbar()

  useEffect(() => {
    getParametresDocumentCandidature()
      .then((parametres) => setTailleMaxMo(parametres.tailleMaxOctets / OCTETS_PAR_MO))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  const enregistrer = async (): Promise<void> => {
    setSaving(true)
    try {
      const resultat = await modifierParametresDocumentCandidature({ tailleMaxOctets: Math.round(tailleMaxMo * OCTETS_PAR_MO) })
      setTailleMaxMo(resultat.tailleMaxOctets / OCTETS_PAR_MO)
      snackbar.showSuccess('Paramètres enregistrés')
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setSaving(false)
    }
  }

  return { tailleMaxMo, setTailleMaxMo, loading, error, saving, enregistrer, snackbar }
}
