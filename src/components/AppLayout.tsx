import { useState } from 'react'
import type { MouseEvent } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import SettingsIcon from '@mui/icons-material/Settings'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function AppLayout() {
  const { pathname } = useLocation()
  const [parametresAnchorEl, setParametresAnchorEl] = useState<HTMLElement | null>(null)

  const offresActif = pathname.startsWith('/offres')
  const candidaturesActif = pathname.startsWith('/candidatures')
  const parametresActif = pathname.startsWith('/parametres')
  const cvActif = pathname.startsWith('/cvs')

  const styleMenu = (actif: boolean) => ({
    textDecoration: actif ? 'underline' : 'none',
    textUnderlineOffset: '4px',
  })

  const styleIcone = (actif: boolean) => ({
    bgcolor: actif ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
  })

  return (
    <Box sx={{ minHeight: '100%', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" component="span" sx={{ mr: 4 }}>
            Job Tracker
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
            <Button component={Link} to="/offres" color="inherit" sx={styleMenu(offresActif)}>
              Offres
            </Button>

            <Button component={Link} to="/candidatures" color="inherit" sx={styleMenu(candidaturesActif)}>
              Candidatures
            </Button>

            <Button component={Link} to="/cvs" color="inherit" sx={styleMenu(cvActif)}>
              CV
            </Button>
          </Stack>

          <Tooltip title="Paramètres">
            <IconButton
              color="inherit"
              sx={styleIcone(parametresActif)}
              aria-label="Paramètres"
              onClick={(event: MouseEvent<HTMLElement>) => setParametresAnchorEl(event.currentTarget)}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={parametresAnchorEl}
            open={Boolean(parametresAnchorEl)}
            onClose={() => setParametresAnchorEl(null)}
          >
            <MenuItem component={Link} to="/parametres/recherche" onClick={() => setParametresAnchorEl(null)}>
              Recherche
            </MenuItem>
            <MenuItem component={Link} to="/parametres/cv" onClick={() => setParametresAnchorEl(null)}>
              CV
            </MenuItem>
            <MenuItem component={Link} to="/parametres/document-candidature" onClick={() => setParametresAnchorEl(null)}>
              Documents de candidature
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Outlet />
    </Box>
  )
}
