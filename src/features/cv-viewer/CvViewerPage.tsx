import { Link, useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DownloadIcon from '@mui/icons-material/Download'
import { useCvViewer } from './useCvViewer'

export function CvViewerPage() {
  const { nomUnique } = useParams<{ nomUnique: string }>()
  const { cv, objectUrl, loading, error, notFound } = useCvViewer(nomUnique ?? '')

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
        <Button component={Link} to="/cvs" startIcon={<ArrowBackIcon />}>
          Retour à la liste
        </Button>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          {cv?.nomOriginal ?? 'CV'}
        </Typography>
        {cv && objectUrl && (
          <Button
            component="a"
            href={objectUrl}
            download={cv.nomOriginal}
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Télécharger
          </Button>
        )}
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && notFound && (
        <Alert severity="warning">
          CV introuvable.{' '}
          <Link to="/cvs" style={{ color: 'inherit' }}>
            Retourner à la liste
          </Link>
        </Alert>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && objectUrl && (
        <Box
          component="iframe"
          src={objectUrl}
          title={cv?.nomOriginal ?? 'Aperçu du CV'}
          sx={{ width: '100%', height: '80vh', border: 'none', borderRadius: 1 }}
        />
      )}
    </Container>
  )
}
