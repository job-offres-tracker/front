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
import EditIcon from '@mui/icons-material/Edit'
import { TYPE_EVENEMENT_LABELS, type Evenement } from '@src/models/candidature'

interface EvenementsTableProps {
  evenements: Evenement[]
  onModifier: (evenement: Evenement) => void
}

export function EvenementsTable({ evenements, onModifier }: EvenementsTableProps) {
  const evenementsTries = [...evenements].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evenementsTries.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    Aucun événement
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {evenementsTries.map((evenement) => (
              <TableRow key={evenement.id} hover>
                <TableCell>{evenement.date}</TableCell>
                <TableCell>{TYPE_EVENEMENT_LABELS[evenement.type]}</TableCell>
                <TableCell>{evenement.description ?? '—'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => onModifier(evenement)} aria-label="Modifier l'événement">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
