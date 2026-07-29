import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { useParametresCv } from './useParametresCv'

export function ParametresCvPage() {
  const { tailleMaxMo, setTailleMaxMo, loading, error, saving, enregistrer, snackbar } = useParametresCv()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Paramètres CV
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="Taille maximale (Mo)"
              type="number"
              value={tailleMaxMo}
              onChange={(event) => setTailleMaxMo(Number(event.target.value))}
              helperText="Seuls les fichiers PDF sont acceptés à l'upload"
              slotProps={{ htmlInput: { min: 0, step: 0.5 } }}
              sx={{ maxWidth: 260 }}
            />

            <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={enregistrer}
                disabled={saving || tailleMaxMo <= 0}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                Enregistrer
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {snackbar.notificationNode}
    </Container>
  )
}
