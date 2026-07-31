import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from 'react-router-dom'
import { CandidaturesTable } from './CandidaturesTable'
import { useCandidatures } from './useCandidatures'

export function CandidaturesPage() {
  const { liste, pagination } = useCandidatures()
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h5" component="h1">
          Candidatures
        </Typography>

        {liste.error && <Alert severity="error">{liste.error}</Alert>}

        {liste.loading && !liste.data ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          liste.data && (
            <CandidaturesTable
              candidatures={liste.data.resultats}
              totalElements={liste.data.totalElements}
              page={pagination.page}
              pageSize={pagination.pageSize}
              onPageChange={pagination.onPageChange}
              onPageSizeChange={pagination.onPageSizeChange}
              onRowClick={(id) => navigate(`/candidatures/${id}`)}
            />
          )
        )}
      </Stack>
    </Container>
  )
}
