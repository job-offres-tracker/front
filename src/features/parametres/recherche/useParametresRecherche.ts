import { useEffect, useState } from 'react'
import { getParametresRecherche, modifierParametresRecherche } from '@src/api/parametresApi'
import { useSnackbar } from '@src/hooks/useSnackbar'
import type { ParametresRecherche } from '@src/models/parametresRecherche'

const VALEURS_INITIALES: ParametresRecherche = { motsCles: [], communes: [], typeContrat: null }

export function useParametresRecherche() {
  const [parametres, setParametres] = useState<ParametresRecherche>(VALEURS_INITIALES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const snackbar = useSnackbar()

  useEffect(() => {
    getParametresRecherche()
      .then(setParametres)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  const enregistrer = async (): Promise<void> => {
    setSaving(true)
    try {
      const resultat = await modifierParametresRecherche(parametres)
      setParametres(resultat)
      snackbar.showSuccess('Paramètres de recherche enregistrés')
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setSaving(false)
    }
  }

  return { parametres, setParametres, loading, error, saving, enregistrer, snackbar }
}
