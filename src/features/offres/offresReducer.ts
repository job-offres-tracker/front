import { ETATS_OFFRE, type EtatOffre } from '@src/models/offre'

export interface FiltreEtSelectionState {
  selectedEtatFilter: EtatOffre
  appliedEtat: EtatOffre
  page: number
  pageSize: number
  selectedIds: Set<string>
  bulkTargetEtat: EtatOffre | ''
}

export const ETAT_INITIAL: FiltreEtSelectionState = {
  selectedEtatFilter: 'NON_LU',
  appliedEtat: 'NON_LU',
  page: 0,
  pageSize: 20,
  selectedIds: new Set(),
  bulkTargetEtat: '',
}

function estEtatOffre(valeur: string | null): valeur is EtatOffre {
  return ETATS_OFFRE.includes(valeur as EtatOffre)
}

// Reprend le filtre/pagination depuis l'URL (?etat=&page=&taille=) si présents, pour
// restaurer la liste dans l'état où l'utilisateur l'avait laissée en revenant du détail d'une offre.
export function initEtatDepuisParams(searchParams: URLSearchParams): FiltreEtSelectionState {
  const etatParam = searchParams.get('etat')
  const etat = estEtatOffre(etatParam) ? etatParam : ETAT_INITIAL.appliedEtat
  const page = Number(searchParams.get('page'))
  const pageSize = Number(searchParams.get('taille'))

  return {
    ...ETAT_INITIAL,
    selectedEtatFilter: etat,
    appliedEtat: etat,
    page: Number.isInteger(page) && page >= 0 ? page : ETAT_INITIAL.page,
    pageSize: Number.isInteger(pageSize) && pageSize > 0 ? pageSize : ETAT_INITIAL.pageSize,
  }
}

export type FiltreEtSelectionAction =
  | { type: 'CHANGER_FILTRE'; etat: EtatOffre }
  | { type: 'RECHERCHER' }
  | { type: 'CHANGER_PAGE'; page: number }
  | { type: 'CHANGER_TAILLE_PAGE'; pageSize: number }
  | { type: 'BASCULER_SELECTION'; idExterne: string }
  | { type: 'BASCULER_TOUT'; ids: string[]; checked: boolean }
  | { type: 'CHANGER_ETAT_CIBLE'; etat: EtatOffre }
  | { type: 'MISE_A_JOUR_REUSSIE' }
  | { type: 'MISE_A_JOUR_ECHOUEE' }

export function offresReducer(
  state: FiltreEtSelectionState,
  action: FiltreEtSelectionAction,
): FiltreEtSelectionState {
  switch (action.type) {
    case 'CHANGER_FILTRE':
      return { ...state, selectedEtatFilter: action.etat }

    case 'RECHERCHER':
      return { ...state, appliedEtat: state.selectedEtatFilter, page: 0, selectedIds: new Set() }

    case 'CHANGER_PAGE':
      return { ...state, page: action.page, selectedIds: new Set() }

    case 'CHANGER_TAILLE_PAGE':
      return { ...state, pageSize: action.pageSize, page: 0, selectedIds: new Set() }

    case 'BASCULER_SELECTION': {
      const selectedIds = new Set(state.selectedIds)
      if (selectedIds.has(action.idExterne)) {
        selectedIds.delete(action.idExterne)
      } else {
        selectedIds.add(action.idExterne)
      }
      return { ...state, selectedIds }
    }

    case 'BASCULER_TOUT': {
      const selectedIds = new Set(state.selectedIds)
      action.ids.forEach((id) => (action.checked ? selectedIds.add(id) : selectedIds.delete(id)))
      return { ...state, selectedIds }
    }

    case 'CHANGER_ETAT_CIBLE':
      return { ...state, bulkTargetEtat: action.etat }

    case 'MISE_A_JOUR_REUSSIE':
      return { ...state, selectedIds: new Set(), bulkTargetEtat: '' }

    case 'MISE_A_JOUR_ECHOUEE':
      return { ...state, bulkTargetEtat: '' }
  }
}
