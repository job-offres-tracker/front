import { useMemo } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { Navigate, Route, Routes } from 'react-router-dom'
import { createAppTheme } from './theme'
import { usePrefersDarkMode } from './hooks/usePrefersDarkMode'
import { AppLayout } from './components/AppLayout'
import { OffresPage } from './features/offres/OffresPage'
import { OffreDetailPage } from './features/offre-detail/OffreDetailPage'
import { OffreCreationPage } from './features/offre-creation/OffreCreationPage'
import { ParametresRecherchePage } from './features/parametres/recherche/ParametresRecherchePage'
import { ParametresCvPage } from './features/parametres/cv/ParametresCvPage'
import { CvsPage } from './features/cvs/CvsPage'
import { CvViewerPage } from './features/cv-viewer/CvViewerPage'

function App() {
  const prefersDark = usePrefersDarkMode()
  const theme = useMemo(() => createAppTheme(prefersDark ? 'dark' : 'light'), [prefersDark])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/offres" replace />} />
            <Route path="/offres" element={<OffresPage />} />
            <Route path="/offres/nouvelle" element={<OffreCreationPage />} />
            <Route path="/offres/:idExterne" element={<OffreDetailPage />} />
            <Route path="/parametres/recherche" element={<ParametresRecherchePage />} />
            <Route path="/parametres/cv" element={<ParametresCvPage />} />
            <Route path="/cvs" element={<CvsPage />} />
            <Route path="/cvs/:nomUnique" element={<CvViewerPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
