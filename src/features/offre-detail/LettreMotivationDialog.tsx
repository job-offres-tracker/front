import { Link as RouterLink } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import type { SelectChangeEvent } from '@mui/material/Select'
import { CONTENU_MAX_LENGTH, useLettreMotivationDialog } from './useLettreMotivationDialog'

interface LettreMotivationDialogProps {
  open: boolean
  idExterne: string
  onClose: () => void
  onPostuleSuccess: () => Promise<void>
}

export function LettreMotivationDialog({ open, idExterne, onClose, onPostuleSuccess }: LettreMotivationDialogProps) {
  const {
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
  } = useLettreMotivationDialog(idExterne, open, onPostuleSuccess)

  const busy = generating || posting

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Lettre de motivation</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {etape === 'choix-cv' && (
            <>
              {loadingCvs && <CircularProgress size={20} />}
              {!loadingCvs && cvs.length === 0 && (
                <Alert severity="info">
                  Aucun CV disponible.{' '}
                  <RouterLink to="/cvs" onClick={onClose}>
                    Uploader un CV
                  </RouterLink>
                </Alert>
              )}
              {!loadingCvs && cvs.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel id="lettre-cv-nom-unique-label">CV</InputLabel>
                  <Select
                    labelId="lettre-cv-nom-unique-label"
                    label="CV"
                    value={cvNomUnique}
                    onChange={(event: SelectChangeEvent) => setCvNomUnique(event.target.value)}
                    disabled={generating}
                  >
                    {cvs.map((cv) => (
                      <MenuItem key={cv.nomUnique} value={cv.nomUnique}>
                        {cv.nomOriginal}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}

          {etape === 'brouillon' && (
            <TextField
              label="Brouillon de la lettre de motivation"
              value={contenu}
              onChange={(event) => setContenu(event.target.value.slice(0, CONTENU_MAX_LENGTH))}
              helperText={`${contenu.length} / ${CONTENU_MAX_LENGTH} caractères`}
              multiline
              minRows={12}
              fullWidth
              disabled={posting}
              slotProps={{ htmlInput: { maxLength: CONTENU_MAX_LENGTH } }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          {etape === 'choix-cv' ? 'Annuler' : 'Fermer'}
        </Button>
        {etape === 'choix-cv' && (
          <Button
            variant="contained"
            onClick={genererLettre}
            disabled={generating || cvNomUnique.length === 0}
            startIcon={generating ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Générer la lettre
          </Button>
        )}
        {etape === 'brouillon' && (
          <Button
            variant="contained"
            onClick={postuler}
            disabled={posting || contenu.trim().length === 0}
            startIcon={posting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Postulé
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
