import { useState } from 'react'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { formatDateCreation } from '@src/utils/formatDate'
import { formatTailleFichier } from '@src/utils/formatFileSize'
import type { DocumentCandidature } from '@src/models/candidature'

const TYPE_DOCUMENT_LABELS: Record<DocumentCandidature['type'], string> = {
  CV: 'CV',
  FICHIER: 'Fichier',
  TEXTE: 'Texte',
}

interface DocumentsTableProps {
  documents: DocumentCandidature[]
  onTelecharger: (document: DocumentCandidature) => void
}

export function DocumentsTable({ documents, onTelecharger }: DocumentsTableProps) {
  const [documentAffiche, setDocumentAffiche] = useState<DocumentCandidature | null>(null)

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Libellé</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Taille</TableCell>
              <TableCell>Date d'ajout</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    Aucun document
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {documents.map((document) => (
              <TableRow key={document.id} hover>
                <TableCell>{document.libelle}</TableCell>
                <TableCell>{TYPE_DOCUMENT_LABELS[document.type]}</TableCell>
                <TableCell>{document.tailleOctets != null ? formatTailleFichier(document.tailleOctets) : '—'}</TableCell>
                <TableCell>{formatDateCreation(document.dateAjout)}</TableCell>
                <TableCell align="right">
                  {document.type === 'TEXTE' ? (
                    <Tooltip title="Voir">
                      <IconButton size="small" onClick={() => setDocumentAffiche(document)} aria-label="Voir le document">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Télécharger">
                      <IconButton size="small" onClick={() => onTelecharger(document)} aria-label="Télécharger le document">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={documentAffiche !== null} onClose={() => setDocumentAffiche(null)} fullWidth maxWidth="sm">
        <DialogTitle>{documentAffiche?.libelle}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {documentAffiche?.contenuTexte}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentAffiche(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
