import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import type { SelectChangeEvent } from '@mui/material/Select'
import { ETATS_OFFRE, ETAT_LABELS, type EtatOffre } from '@src/models/offre'

interface BulkUpdateBarProps {
  selectedCount: number
  targetEtat: EtatOffre | ''
  onTargetEtatChange: (etat: EtatOffre) => void
  updating: boolean
}

export function BulkUpdateBar({ selectedCount, targetEtat, onTargetEtatChange, updating }: BulkUpdateBarProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onTargetEtatChange(event.target.value as EtatOffre)
  }

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <Typography variant="body2" sx={{ minWidth: 160 }}>
        {selectedCount} offre{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
      </Typography>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="bulk-etat-label">Nouvel état</InputLabel>
        <Select
          labelId="bulk-etat-label"
          label="Nouvel état"
          value={targetEtat}
          onChange={handleChange}
          disabled={selectedCount === 0 || updating}
        >
          {ETATS_OFFRE.map((etat) => (
            <MenuItem key={etat} value={etat}>
              {ETAT_LABELS[etat]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {updating && <CircularProgress size={20} />}
    </Stack>
  )
}
