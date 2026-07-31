import { useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import MuiLink from '@mui/material/Link'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AddIcon from '@mui/icons-material/Add'
import DescriptionIcon from '@mui/icons-material/Description'
import { EtatChip } from '@src/components/EtatChip'
import { HtmlContentDialog } from '@src/components/HtmlContentDialog'
import { formatDateCreation } from '@src/utils/formatDate'
import type { Evenement } from '@src/models/candidature'
import { useCandidatureDetail } from './useCandidatureDetail'
import { EvenementsTable } from './EvenementsTable'
import { EvenementDialog } from './EvenementDialog'
import { DocumentsTable } from './DocumentsTable'
import { DocumentCvDialog } from './DocumentCvDialog'
import { DocumentFichierDialog } from './DocumentFichierDialog'
import { DocumentTexteDialog } from './DocumentTexteDialog'

export function CandidatureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    candidature,
    loading,
    error,
    notFound,
    saving,
    snackbar,
    creerEvenement,
    editerEvenement,
    ajouterCv,
    ajouterFichier,
    ajouterTexte,
    telecharger,
  } = useCandidatureDetail(Number(id))

  const [descriptionOuverte, setDescriptionOuverte] = useState(false)
  const [evenementDialogOuvert, setEvenementDialogOuvert] = useState(false)
  const [evenementEnEdition, setEvenementEnEdition] = useState<Evenement | null>(null)

  const [menuDocumentAncre, setMenuDocumentAncre] = useState<HTMLElement | null>(null)
  const [cvDialogOuvert, setCvDialogOuvert] = useState(false)
  const [texteDialogOuvert, setTexteDialogOuvert] = useState(false)
  const [fichierEnAttente, setFichierEnAttente] = useState<File | null>(null)

  const handleOuvrirCreationEvenement = () => {
    setEvenementEnEdition(null)
    setEvenementDialogOuvert(true)
  }

  const handleOuvrirEditionEvenement = (evenement: Evenement) => {
    setEvenementEnEdition(evenement)
    setEvenementDialogOuvert(true)
  }

  const handleSoumettreEvenement = async (payload: { date: string; type: Evenement['type']; description?: string }) => {
    const succes = evenementEnEdition
      ? await editerEvenement(evenementEnEdition.id, payload)
      : await creerEvenement(payload)
    if (succes) {
      setEvenementDialogOuvert(false)
      setEvenementEnEdition(null)
    }
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    setMenuDocumentAncre(null)
    if (file) {
      setFichierEnAttente(file)
    }
  }

  const handleConfirmerFichier = async (libelle: string) => {
    if (!fichierEnAttente) {
      return
    }
    const succes = await ajouterFichier(fichierEnAttente, libelle)
    if (succes) {
      setFichierEnAttente(null)
    }
  }

  const handleConfirmerCv = async (cvNomUnique: string) => {
    const succes = await ajouterCv(cvNomUnique)
    if (succes) {
      setCvDialogOuvert(false)
    }
  }

  const handleConfirmerTexte = async (libelle: string, contenu: string) => {
    const succes = await ajouterTexte(libelle, contenu)
    if (succes) {
      setTexteDialogOuvert(false)
    }
  }

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Retour à la liste
          </Button>
          <Typography variant="h5" component="h1">
            Détail de la candidature
          </Typography>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && notFound && (
          <Alert severity="warning">
            Candidature introuvable.{' '}
            <Link to="/candidatures" style={{ color: 'inherit' }}>
              Retourner à la liste
            </Link>
          </Alert>
        )}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && candidature && (
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                    {candidature.offre.intitule}
                  </Typography>
                  <EtatChip etat={candidature.offre.etat} />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Date de candidature :</strong> {formatDateCreation(candidature.dateCandidature)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Entreprise :</strong> {candidature.offre.entreprise ?? '—'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type de contrat :</strong> {candidature.offre.typeContrat ?? '—'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Salaire :</strong> {candidature.offre.salaire ?? '—'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Lieu :</strong>{' '}
                    {[candidature.offre.lieu?.libelle, candidature.offre.lieu?.adresse].filter(Boolean).join(' — ') || '—'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Origine :</strong> {candidature.offre.provenance ?? '—'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Offre originale :</strong>{' '}
                    {candidature.offre.urlOrigine ? (
                      <MuiLink
                        href={candidature.offre.urlOrigine}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                      >
                        Voir l'offre originale
                        <OpenInNewIcon fontSize="inherit" />
                      </MuiLink>
                    ) : (
                      '—'
                    )}
                  </Typography>
                </Stack>

                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<DescriptionIcon />}
                    onClick={() => setDescriptionOuverte(true)}
                  >
                    Voir la description
                  </Button>
                </Box>
              </Stack>
            </Paper>

            <Divider />

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Événements
              </Typography>
              <Button startIcon={<AddIcon />} onClick={handleOuvrirCreationEvenement}>
                Ajouter un événement
              </Button>
            </Stack>
            <EvenementsTable evenements={candidature.evenements} onModifier={handleOuvrirEditionEvenement} />

            <Divider />

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Documents
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={(event: MouseEvent<HTMLElement>) => setMenuDocumentAncre(event.currentTarget)}
              >
                Ajouter un document
              </Button>
              <Menu
                anchorEl={menuDocumentAncre}
                open={Boolean(menuDocumentAncre)}
                onClose={() => setMenuDocumentAncre(null)}
              >
                <MenuItem
                  onClick={() => {
                    setMenuDocumentAncre(null)
                    setCvDialogOuvert(true)
                  }}
                >
                  CV existant
                </MenuItem>
                <MenuItem component="label">
                  Fichier
                  <input type="file" hidden onChange={handleFileSelect} />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenuDocumentAncre(null)
                    setTexteDialogOuvert(true)
                  }}
                >
                  Texte
                </MenuItem>
              </Menu>
            </Stack>
            <DocumentsTable documents={candidature.documents} onTelecharger={telecharger} />
          </Stack>
        )}
      </Container>

      {candidature && (
        <HtmlContentDialog
          open={descriptionOuverte}
          title="Description de l'offre"
          html={candidature.offre.description}
          onClose={() => setDescriptionOuverte(false)}
        />
      )}

      <EvenementDialog
        open={evenementDialogOuvert}
        evenement={evenementEnEdition}
        saving={saving}
        onCancel={() => {
          setEvenementDialogOuvert(false)
          setEvenementEnEdition(null)
        }}
        onSubmit={handleSoumettreEvenement}
      />

      <DocumentCvDialog
        open={cvDialogOuvert}
        saving={saving}
        onCancel={() => setCvDialogOuvert(false)}
        onConfirm={handleConfirmerCv}
      />

      <DocumentFichierDialog
        file={fichierEnAttente}
        saving={saving}
        onCancel={() => setFichierEnAttente(null)}
        onConfirm={handleConfirmerFichier}
      />

      <DocumentTexteDialog
        open={texteDialogOuvert}
        saving={saving}
        onCancel={() => setTexteDialogOuvert(false)}
        onConfirm={handleConfirmerTexte}
      />

      {snackbar.notificationNode}
    </>
  )
}
