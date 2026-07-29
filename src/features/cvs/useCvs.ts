import { useEffect, useState } from 'react'
import { getCvs, uploaderCv } from '@src/api/cvApi'
import { useSnackbar } from '@src/hooks/useSnackbar'
import type { Cv } from '@src/models/cv'

export function useCvs() {
  const [cvs, setCvs] = useState<Cv[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const snackbar = useSnackbar()

  const chargerListe = () => {
    setLoading(true)
    getCvs()
      .then(setCvs)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    chargerListe()
  }, [])

  const uploader = async (file: File, nom: string): Promise<void> => {
    if (file.type !== 'application/pdf') {
      snackbar.showError(new Error('Seuls les fichiers PDF sont acceptés'))
      return
    }
    setUploading(true)
    try {
      await uploaderCv(file, nom)
      chargerListe()
      snackbar.showSuccess('CV ajouté')
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setUploading(false)
    }
  }

  return { cvs, loading, error, uploading, uploader, snackbar }
}
