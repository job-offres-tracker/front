import { useEffect, useState } from 'react'
import { getCvs } from '@src/api/cvApi'
import { genererLettreMotivation, mettreAJourEtat } from '@src/api/offresApi'
import { ajouterDocumentCv, ajouterDocumentTexte, getCandidatureParOffre } from '@src/api/candidaturesApi'
import { messageErreur } from '@src/api/apiClient'
import type { Cv } from '@src/models/cv'

export const CONTENU_MAX_LENGTH = 10_000

type Etape = 'choix-cv' | 'brouillon'

interface ProgressionPostulation {
  candidatureId: number | null
  cvDocumentAjoute: boolean
  texteDocumentAjoute: boolean
}

const PROGRESSION_INITIALE: ProgressionPostulation = {
  candidatureId: null,
  cvDocumentAjoute: false,
  texteDocumentAjoute: false,
}

export function useLettreMotivationDialog(idExterne: string, open: boolean, onPostuleSuccess: () => Promise<void>) {
  const [etape, setEtape] = useState<Etape>('choix-cv')
  const [cvs, setCvs] = useState<Cv[]>([])
  const [loadingCvs, setLoadingCvs] = useState(false)
  const [cvNomUnique, setCvNomUnique] = useState('')
  const [generating, setGenerating] = useState(false)
  const [contenu, setContenu] = useState('')
  const [posting, setPosting] = useState(false)
  const [progression, setProgression] = useState<ProgressionPostulation>(PROGRESSION_INITIALE)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    setEtape('choix-cv')
    setCvNomUnique('')
    setContenu('')
    setProgression(PROGRESSION_INITIALE)
    setError(null)
    setLoadingCvs(true)
    getCvs()
      .then(setCvs)
      .catch((err: unknown) => setError(messageErreur(err)))
      .finally(() => setLoadingCvs(false))
  }, [open])

  const genererLettre = async () => {
    setGenerating(true)
    setError(null)
    try {
      const lettre = await genererLettreMotivation(idExterne, cvNomUnique)
      setContenu(lettre.contenu.slice(0, CONTENU_MAX_LENGTH))
      setEtape('brouillon')
    } catch (err) {
      setError(messageErreur(err))
    } finally {
      setGenerating(false)
    }
  }

  const postuler = async () => {
    setPosting(true)
    setError(null)
    try {
      let { candidatureId, cvDocumentAjoute, texteDocumentAjoute } = progression

      if (candidatureId === null) {
        await mettreAJourEtat({ idsExternes: [idExterne], etat: 'POSTULE' })
        const candidature = await getCandidatureParOffre(idExterne)
        candidatureId = candidature.id
        setProgression((prev) => ({ ...prev, candidatureId }))
      }
      if (!cvDocumentAjoute) {
        await ajouterDocumentCv(candidatureId, cvNomUnique)
        cvDocumentAjoute = true
        setProgression((prev) => ({ ...prev, cvDocumentAjoute }))
      }
      if (!texteDocumentAjoute) {
        await ajouterDocumentTexte(candidatureId, 'Lettre de motivation', contenu)
        texteDocumentAjoute = true
        setProgression((prev) => ({ ...prev, texteDocumentAjoute }))
      }
      await onPostuleSuccess()
    } catch (err) {
      setError(messageErreur(err))
    } finally {
      setPosting(false)
    }
  }

  return {
    etape,
    cvs,
    loadingCvs,
    cvNomUnique,
    setCvNomUnique,
    generating,
    genererLettre,
    contenu,
    setContenu,
    posting,
    postuler,
    error,
  }
}
