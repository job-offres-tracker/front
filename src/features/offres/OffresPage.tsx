import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import SyncIcon from '@mui/icons-material/Sync'
import AddIcon from '@mui/icons-material/Add'
import { Link, useNavigate } from 'react-router-dom'
import { AppSnackbar } from '@src/components/AppSnackbar'
import { EtatFilterBar } from './EtatFilterBar'
import { OffresTable } from './OffresTable'
import { BulkUpdateBar } from './BulkUpdateBar'
import { useOffres } from './useOffres'

export function OffresPage() {
  const { filtre, liste, pagination, selection, miseAJour, synchronisation, snackbar } = useOffres()
  const navigate = useNavigate()

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
              Suivi des offres d'emploi
            </Typography>
            <Button component={Link} to="/offres/nouvelle" variant="outlined" startIcon={<AddIcon />}>
              Nouvelle offre
            </Button>
            <Button
              variant="outlined"
              startIcon={
                synchronisation.enCours ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />
              }
              onClick={synchronisation.onSynchroniser}
              disabled={synchronisation.enCours}
            >
              Synchroniser
            </Button>
          </Stack>

          <EtatFilterBar
            value={filtre.valeur}
            onChange={filtre.onChange}
            onSearch={filtre.onRechercher}
            loading={liste.loading}
          />

          <BulkUpdateBar
            selectedCount={selection.selectedIds.size}
            targetEtat={miseAJour.cible}
            onTargetEtatChange={miseAJour.onCibleChange}
            updating={miseAJour.enCours}
          />

          <Divider />

          {liste.error && <Alert severity="error">{liste.error}</Alert>}

          {liste.loading && !liste.data ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            liste.data && (
              <OffresTable
                offres={liste.data.resultats}
                totalElements={liste.data.totalElements}
                page={pagination.page}
                pageSize={pagination.pageSize}
                selectedIds={selection.selectedIds}
                onToggleOne={selection.toggleOne}
                onToggleAll={selection.toggleAll}
                onPageChange={pagination.onPageChange}
                onPageSizeChange={pagination.onPageSizeChange}
                onRowClick={(idExterne) => navigate(`/offres/${idExterne}`)}
              />
            )
          )}
        </Stack>
      </Container>

      <AppSnackbar state={snackbar.state} onClose={snackbar.close} />
    </>
  )
}
