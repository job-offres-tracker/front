import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { EtatChip } from '@src/components/EtatChip'
import { formatDateCreation } from '@src/utils/formatDate'
import type { Offre } from '@src/models/offre'

interface OffresTableProps {
  offres: Offre[]
  totalElements: number
  page: number
  pageSize: number
  selectedIds: Set<string>
  onToggleOne: (idExterne: string) => void
  onToggleAll: (checked: boolean) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onRowClick: (idExterne: string) => void
}

export function OffresTable({
  offres,
  totalElements,
  page,
  pageSize,
  selectedIds,
  onToggleOne,
  onToggleAll,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}: OffresTableProps) {
  const selectedOnPage = offres.filter((offre) => selectedIds.has(offre.idExterne)).length
  const allSelected = offres.length > 0 && selectedOnPage === offres.length
  const someSelected = selectedOnPage > 0 && !allSelected

  return (
    <Paper variant="outlined">
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(event) => onToggleAll(event.target.checked)}
                  slotProps={{ input: { 'aria-label': 'Tout sélectionner' } }}
                />
              </TableCell>
              <TableCell>Intitulé</TableCell>
              <TableCell>Date création</TableCell>
              <TableCell>État</TableCell>
              <TableCell>Entreprise</TableCell>
              <TableCell>ID externe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offres.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    Aucune offre trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {offres.map((offre) => {
              const checked = selectedIds.has(offre.idExterne)
              return (
                <TableRow
                  key={offre.idExterne}
                  hover
                  selected={checked}
                  onClick={() => onRowClick(offre.idExterne)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox" onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      checked={checked}
                      onChange={() => onToggleOne(offre.idExterne)}
                      slotProps={{ input: { 'aria-label': `Sélectionner ${offre.intitule}` } }}
                    />
                  </TableCell>
                  <TableCell>{offre.intitule}</TableCell>
                  <TableCell>{formatDateCreation(offre.dateCreation)}</TableCell>
                  <TableCell>
                    <EtatChip etat={offre.etat} />
                  </TableCell>
                  <TableCell>{offre.entreprise ?? '—'}</TableCell>
                  <TableCell>{offre.idExterne}</TableCell>
                </TableRow>
              )
            })}
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
