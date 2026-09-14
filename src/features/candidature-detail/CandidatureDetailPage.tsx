import { useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'
import { HtmlContentDialog } from '@src/components/HtmlContentDialog'
import type { Evenement } from '@src/models/candidature'
import { useCandidatureDetail } from './useCandidatureDetail'
import { OffreEncart } from './OffreEncart'
import { EntrepriseEncart } from './EntrepriseEncart'
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
            {candidature.type === 'OFFRE' ? (
              <OffreEncart
                offre={candidature.offre}
                dateCandidature={candidature.dateCandidature}
                onVoirDescription={() => setDescriptionOuverte(true)}
              />
            ) : (
              <EntrepriseEncart
                type={candidature.type}
                nomEntreprise={candidature.nomEntreprise}
                urlEntreprise={candidature.urlEntreprise}
                typeEntreprise={candidature.typeEntreprise}
                statutCandidatureSpontanee={candidature.type === 'SPONTANEE' ? candidature.statutCandidatureSpontanee : undefined}
                statutPriseDeContact={candidature.type === 'PRISE_DE_CONTACT' ? candidature.statutPriseDeContact : undefined}
                dateCandidature={candidature.dateCandidature}
              />
            )}

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

      {candidature && candidature.type === 'OFFRE' && (
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
