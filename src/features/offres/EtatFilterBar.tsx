import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import type { SelectChangeEvent } from '@mui/material/Select'
import { ETATS_OFFRE, ETAT_LABELS, type EtatOffre } from '@src/models/offre'

interface EtatFilterBarProps {
  value: EtatOffre
  onChange: (etat: EtatOffre) => void
  onSearch: () => void
  loading: boolean
}

export function EtatFilterBar({ value, onChange, onSearch, loading }: EtatFilterBarProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as EtatOffre)
  }

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 200 }} >
        <InputLabel id="filtre-etat-label">État</InputLabel>
        <Select labelId="filtre-etat-label" label="État" value={value} onChange={handleChange}>
          {ETATS_OFFRE.map((etat) => (
            <MenuItem key={etat} value={etat}>
              {ETAT_LABELS[etat]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" startIcon={<SearchIcon />} onClick={onSearch} disabled={loading}>
        Rechercher
      </Button>
    </Stack>
  )
}
