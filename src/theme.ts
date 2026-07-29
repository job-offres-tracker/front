import { createTheme } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material'

// Couleur primaire choisie séparément par mode : le violet de marque en clair est trop
// sombre pour rester lisible (texte des boutons outlined/text) sur un fond sombre.
const COULEUR_PRIMAIRE: Record<PaletteMode, string> = {
  light: '#4b3f72',
  dark: '#a496d6',
}

// Couleur de police (titres, texte de tableau, corps de texte...) par mode.
const COULEUR_TEXTE: Record<PaletteMode, { primary: string; secondary: string }> = {
  light: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.6)' },
  dark: { primary: '#e2f1de', secondary: '#b7c4b4' },
}

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: COULEUR_PRIMAIRE[mode] },
      text: COULEUR_TEXTE[mode],
    },
    shape: { borderRadius: 10 },
  })
}
