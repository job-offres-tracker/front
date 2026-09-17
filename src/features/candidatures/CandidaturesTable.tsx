import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { StatutCandidatureChip } from '@src/components/StatutCandidatureChip'
import { TYPE_CANDIDATURE_LABELS, type CandidatureListItem } from '@src/models/candidature'

interface CandidaturesTableProps {
  candidatures: CandidatureListItem[]
  totalElements: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onRowClick: (id: number) => void
}

export function CandidaturesTable({
  candidatures,
  totalElements,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: CandidaturesTableProps) {
  return (
    <Paper variant="outlined">
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Intitulé</TableCell>
              <TableCell>État</TableCell>
              <TableCell>Entreprise</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>ID externe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidatures.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    Aucune candidature trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {candidatures.map((candidature) => (
              <TableRow
                key={candidature.id}
                hover
                onClick={() => onRowClick(candidature.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{TYPE_CANDIDATURE_LABELS[candidature.type]}</TableCell>
                <TableCell>{candidature.type === 'OFFRE' ? candidature.intitule : '—'}</TableCell>
                <TableCell>
                  {candidature.type === 'OFFRE' ? (
                    <StatutCandidatureChip type="OFFRE" statut={candidature.statutCandidatureOffre} />
                  ) : candidature.type === 'SPONTANEE' ? (
                    <StatutCandidatureChip type="SPONTANEE" statut={candidature.statutCandidatureSpontanee} />
                  ) : (
                    <StatutCandidatureChip type="PRISE_DE_CONTACT" statut={candidature.statutPriseDeContact} />
                  )}
                </TableCell>
                <TableCell>{candidature.entreprise ?? '—'}</TableCell>
                <TableCell>{candidature.type === 'OFFRE' ? (candidature.lieu?.libelle ?? '—') : '—'}</TableCell>
                <TableCell>{candidature.type === 'OFFRE' ? candidature.idExterne : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageChange={(_event, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
        labelRowsPerPage="Lignes par page"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
      />
    </Paper>
  )
}
