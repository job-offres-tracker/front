# Job Tracker Front

Frontend React (Vite + TypeScript) du projet **job-offres-tracker** : une interface pour consulter les offres d'emploi synchronisées automatiquement, suivre leur état de candidature (non lu, lu, postulé, entretien...), et en créer de nouvelles — manuellement ou en important les champs depuis une URL via l'IA du backend.

Ce document est destiné à un nouveau développeur qui découvre le projet : prérequis, configuration, lancement, et architecture.

Ce frontend ne fonctionne pas seul : il consomme l'API REST exposée par le backend [`job-offres-tracker`](../job-offres-tracker), qui doit être démarré au préalable.

## Sommaire

- [Prérequis](#prérequis)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [Build](#build)
- [Lint](#lint)
- [Tests](#tests)
- [Architecture](#architecture)
- [Écrans](#écrans)

## Prérequis

| Outil | Version | Remarque |
|---|---|---|
| Node.js | 20+ (LTS recommandée) | nécessaire pour Vite 8 / TypeScript 6 |
| npm | fourni avec Node.js | gestionnaire de paquets utilisé (`package-lock.json`) |

Le backend `job-offres-tracker` doit être lancé (par défaut sur `http://localhost:8081`) : toutes les données affichées viennent de son API REST, il n'y a pas de mode hors-ligne.

## Configuration

Une seule variable d'environnement, lue par Vite (préfixe `VITE_` obligatoire pour être exposée au code client) et typée dans `src/vite-env.d.ts` :

| Variable | Obligatoire | Défaut | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Oui | — | URL de base de l'API `job-offres-tracker` (ex. `http://localhost:8081`) |

Première installation : copier `.env.example` vers `.env` (déjà pré-rempli avec la valeur par défaut du développement local, à adapter si le backend tourne ailleurs).

```powershell
Copy-Item .env.example .env
```

Le backend doit autoriser l'origine du front en CORS (`jobtracker.cors.allowed-origins`, par défaut `http://localhost:5173` — le port par défaut de Vite, déjà aligné).

## Lancement

```powershell
npm install
npm run dev
```

L'application est servie sur `http://localhost:5173`.

Deux configurations de debug sont fournies dans `.vscode/launch.json` (avec la tâche `.vscode/tasks.json` associée) pour déboguer dans Chrome directement depuis VS Code, avec ou sans lancement automatique du serveur de dev.

## Build

```powershell
npm run build   # tsc -b (vérification des types) puis build de production Vite dans dist/
npm run preview # sert le build de production localement, pour vérification avant déploiement
```

## Lint

```powershell
npm run lint
```

Utilise [Oxlint](https://oxc.rs) (règles `react`, `typescript`, `oxc` — voir `.oxlintrc.json`), pas ESLint.

## Tests

Aucun test automatisé pour l'instant.

## Architecture

Pas d'architecture hexagonale ici (ça n'aurait pas de sens côté frontend) : organisation **par fonctionnalité** (feature-based), avec une séparation stricte entre l'affichage (composant `*Page.tsx`) et la logique (hook `use*.ts`).

```
src/
├── main.tsx           Point d'entrée : StrictMode, BrowserRouter, polices Roboto (@fontsource), styles globaux
├── App.tsx             Déclaration des routes (react-router-dom)
├── theme.ts             Thème MUI (palette, arrondis)
├── index.css             Reset minimal (html/body/#root en 100% de hauteur)
├── vite-env.d.ts          Typage de import.meta.env.VITE_API_BASE_URL
├── api/
│   ├── apiClient.ts       wrapper fetch générique (request<T>), ApiError, messageErreur(err)
│   ├── offresApi.ts       appels /api/v1/offres* (liste, détail, création, changement d'état, synchro, import)
│   └── communesApi.ts     appel /api/v1/communes (autocomplete de lieu)
├── models/                 types TypeScript miroir des DTO REST du backend (Offre, PagedResponse<T>, Commune,
│                            BrouillonOffre, CreerOffreRequest, MettreAJourEtatRequest, ProblemDetail)
├── hooks/
│   └── useSnackbar.ts      état de notification succès/erreur, réutilisé par tous les hooks métier
├── components/              composants transverses (AppSnackbar, EtatChip)
├── utils/
│   └── formatDate.ts        formatage FR des dates
└── features/                 un dossier par écran : page (JSX + MUI) + hook(s) (state + appels API)
    ├── offres/                liste paginée
    ├── offre-detail/           détail d'une offre
    └── offre-creation/          création manuelle / import IA
```

L'alias `@src/*` (configuré dans `vite.config.ts` et `tsconfig.app.json`) pointe vers `src/*` et est utilisé pour tous les imports inter-dossiers, à la place de chemins relatifs `../../..`.

### Style : MUI avec styled-components

Le projet utilise `@mui/material` mais avec **styled-components** comme moteur de style plutôt qu'Emotion (le moteur par défaut de MUI) : voir l'alias `@mui/styled-engine` → `@mui/styled-engine-sc` dans `vite.config.ts`, combiné à `<StyledEngineProvider injectFirst>` dans `App.tsx`. Les paquets `@emotion/*` restent présents en dépendance (MUI en dépend en interne) mais ne sont pas utilisés directement.

### Appels API et gestion d'erreur

- `api/apiClient.ts` centralise `fetch`, la base URL (`VITE_API_BASE_URL`) et le parsing des réponses d'erreur du backend au format `ProblemDetail` (RFC 9457). `ApiError` expose `status` et le `detail` du problème.
- `messageErreur(err)` normalise n'importe quelle erreur catchée (`ApiError` ou autre) en un message affichable à l'utilisateur.
- Chaque hook métier (`useOffres`, `useOffreDetail`, `useCreerOffre`, `useImporterOffre`) suit le même pattern : `useSnackbar()` + `showSuccess`/`showError`, affiché via `<AppSnackbar>`.

### État de la liste synchronisé avec l'URL

`features/offres/useOffres.ts` pilote son état (filtre par état, page, taille de page, sélection) via un `useReducer` (`offresReducer.ts`), initialisé depuis les search params (`?etat=&page=&taille=`) et les réécrivant à chaque changement. Ça permet de revenir sur la liste (ex. retour depuis le détail d'une offre) dans l'état exact où l'utilisateur l'avait laissée.

## Écrans

| Route | Composant | Description |
|---|---|---|
| `/` | — | redirige vers `/offres` |
| `/offres` | `OffresPage` | Liste paginée des offres, filtrable par état (`EtatFilterBar`), sélection multiple + changement d'état groupé (`BulkUpdateBar`), bouton **Synchroniser** (déclenche `POST /api/v1/offres/synchroniser` côté backend — la même synchro France Travail que le planificateur automatique) |
| `/offres/nouvelle` | `OffreCreationPage` | Création manuelle d'une offre. Un champ URL permet d'**importer** les champs depuis une page d'offre externe (ex. HelloWork) via l'extraction IA du backend (`POST /api/v1/offres/importer`) — les champs pré-remplissent le formulaire mais restent à vérifier avant validation. Le lieu utilise une autocomplete de commune (`GET /api/v1/communes`), avec repli en saisie libre si le service est indisponible |
| `/offres/:idExterne` | `OffreDetailPage` | Détail d'une offre : informations complètes, changement d'état individuel, lien vers l'offre originale. La description (potentiellement du HTML fourni par le backend) est nettoyée avec `DOMPurify` avant injection via `dangerouslySetInnerHTML` |
