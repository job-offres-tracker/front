import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
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
    <Box sx={{ minHeight: '100%', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Suivi des offres d'emploi
          </Typography>
          <Button component={Link} to="/offres/nouvelle" variant="outlined" color="inherit" startIcon={<AddIcon />} sx={{ mr: 2 }}>
            Nouvelle offre
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={
              synchronisation.enCours ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />
            }
            onClick={synchronisation.onSynchroniser}
            disabled={synchronisation.enCours}
          >
            Synchroniser
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
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
    </Box>
  )
}
