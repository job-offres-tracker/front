import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import { formatDateCreation } from '@src/utils/formatDate'
import { formatTailleFichier } from '@src/utils/formatFileSize'
import { telechargerCv } from '@src/api/cvApi'
import type { Cv } from '@src/models/cv'
import { useCvs } from './useCvs'
import { CvUploadDialog } from './CvUploadDialog'

export function CvsPage() {
  const { cvs, loading, error, uploading, uploader, snackbar } = useCvs()
  const navigate = useNavigate()

  const [fichierEnAttente, setFichierEnAttente] = useState<File | null>(null)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) {
      setFichierEnAttente(file)
    }
  }

  const handleConfirmerUpload = async (nom: string) => {
    if (!fichierEnAttente) {
      return
    }
    await uploader(fichierEnAttente, nom)
    setFichierEnAttente(null)
  }

  const handleTelecharger = async (cv: Cv) => {
    try {
      const blob = await telechargerCv(cv.nomUnique)
      const url = URL.createObjectURL(blob)
      const lien = document.createElement('a')
      lien.href = url
      lien.download = cv.nomOriginal
      lien.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      snackbar.showError(err)
    } 
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          CV
        </Typography>
        <Button
          component="label"
          variant="outlined"
          startIcon={uploading ? <CircularProgress size={16} /> : <UploadFileIcon />}
          disabled={uploading}
        >
          Ajouter un CV
          <input type="file" accept="application/pdf" hidden onChange={handleFileSelect} />
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Taille</TableCell>
                  <TableCell>Date d'upload</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cvs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                        Aucun CV
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {cvs.map((cv) => (
                  <TableRow key={cv.nomUnique} hover>
                    <TableCell>{cv.nomOriginal}</TableCell>
                    <TableCell>{formatTailleFichier(cv.tailleOctets)}</TableCell>
                    <TableCell>{formatDateCreation(cv.dateUpload)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Visualiser">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/cvs/${cv.nomUnique}`, { state: { cv } })}
                          aria-label={`Visualiser ${cv.nomOriginal}`}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger">
                        <IconButton
                          size="small"
                          onClick={() => handleTelecharger(cv)}
                          aria-label={`Télécharger ${cv.nomOriginal}`}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <CvUploadDialog
        file={fichierEnAttente}
        uploading={uploading}
        onCancel={() => setFichierEnAttente(null)}
        onConfirm={handleConfirmerUpload}
      />

      {snackbar.notificationNode}
    </Container>
  )
}
