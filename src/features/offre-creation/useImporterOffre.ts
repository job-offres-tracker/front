import { useState } from 'react'
import { importerOffre } from '@src/api/offresApi'
import { useSnackbar } from '@src/hooks/useSnackbar'
import type { BrouillonOffre } from '@src/models/brouillonOffre'

export function useImporterOffre(onImported: (brouillon: BrouillonOffre) => void) {
  const [importing, setImporting] = useState(false)
  const snackbar = useSnackbar()

  const importer = async (url: string): Promise<void> => {
    setImporting(true)
    try {
      const brouillon = await importerOffre(url)
      onImported(brouillon)
      snackbar.showSuccess('Offre importée — vérifiez les champs avant de valider')
    } catch (err) {
      snackbar.showError(err)
    } finally {
      setImporting(false)
    }
  }

  return { importer, importing, snackbar }
}
