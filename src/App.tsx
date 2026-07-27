import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { Navigate, Route, Routes } from 'react-router-dom'
import { theme } from './theme'
import { OffresPage } from './features/offres/OffresPage'
import { OffreDetailPage } from './features/offre-detail/OffreDetailPage'
import { OffreCreationPage } from './features/offre-creation/OffreCreationPage'

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Navigate to="/offres" replace />} />
          <Route path="/offres" element={<OffresPage />} />
          <Route path="/offres/nouvelle" element={<OffreCreationPage />} />
          <Route path="/offres/:idExterne" element={<OffreDetailPage />} />
        </Routes>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
