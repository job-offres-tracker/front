# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Frontend React (Vite + TypeScript) for **job-offres-tracker**: an interface to browse job offers synced automatically, track application status (unread, read, applied, interview...), and create new offers manually or via AI-powered import from a URL. It also manages candidatures (applications), CVs, and search/document parameters.

This frontend does not work standalone: it consumes the REST API exposed by the `job-offres-tracker` backend, which must be running first (default `http://localhost:8081`). There is no offline mode.

See @README.md for setup instructions and the full screen-by-screen breakdown (routes, backend endpoints used per screen). This file focuses on architecture and conventions relevant to making changes.

## Commands

```powershell
npm install
npm run dev       # dev server on http://localhost:5173
npm run build     # tsc -b (type-check) then vite build -> dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint (not ESLint) — rules in .oxlintrc.json
```

There is no automated test suite.

### Environment

Two env vars, prefixed `VITE_` to be exposed to client code (only `VITE_API_BASE_URL` is currently declared in `src/vite-env.d.ts` — `VITE_API_PATH` is read but untyped there):

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend, e.g. `http://localhost:8081` |
| `VITE_API_PATH` | API prefix, e.g. `/api/v1` |

First setup: `Copy-Item .env.example .env`. The backend must allow the front's origin via CORS (`http://localhost:5173` by default).

## Architecture

Feature-based organization (not hexagonal — wouldn't make sense on the frontend), with a strict split between display (`*Page.tsx` component) and logic (`use*.ts` hook).

```
src/
├── main.tsx        Entry point: StrictMode, BrowserRouter, Roboto fonts, global styles
├── App.tsx           Route declarations (react-router-dom), theme setup
├── theme.ts           MUI theme factory (createAppTheme(mode)) — supports light/dark
├── api/
│   ├── apiClient.ts     fetch wrapper: request<T>, requestUpload<T> (FormData/multipart),
│   │                      requestBlob (binary), ApiError, messageErreur(err)
│   ├── offresApi.ts       /api/v1/offres* — list, detail, create, state change, sync, import
│   ├── candidaturesApi.ts  /api/v1/candidatures*
│   ├── cvApi.ts             /api/v1/cvs* (upload, view)
│   ├── parametresApi.ts     search / CV / candidature-document settings
│   └── communesApi.ts        commune (French city) autocomplete
├── models/            TypeScript types mirroring backend REST DTOs
├── hooks/
│   ├── useSnackbar.tsx        success/error notification state, reused by feature hooks
│   ├── usePrefersDarkMode.ts   OS dark-mode preference, drives theme in App.tsx
│   └── useRechercheCommune.ts  shared commune-autocomplete logic
├── components/         cross-cutting components (AppLayout, AppSnackbar, EtatChip, StatutCandidatureChip, HtmlContentDialog)
├── utils/
│   └── formatDate.ts     FR date formatting
└── features/            one folder per screen: page (JSX + MUI) + hook(s) (state + API calls)
    ├── offres/                        paginated offer list
    ├── offre-detail/                   offer detail
    ├── offre-creation/                  manual creation / AI import
    ├── candidatures/                     paginated candidature (application) list
    ├── candidature-creation/              create a spontaneous application or a prise de contact
    ├── candidature-detail/                 candidature detail (offer or company encart depending on type)
    ├── cvs/                                CV list / upload
    ├── cv-viewer/                           CV viewer
    └── parametres/
        ├── recherche/                        search settings
        ├── cv/                                 CV settings
        └── candidature-document/                candidature-document settings
```

The `@src/*` alias (`vite.config.ts` and `tsconfig.app.json`) points to `src/*` and is used for all cross-folder imports instead of relative `../../..` paths.

### Style: MUI with styled-components

Uses `@mui/material` but with **styled-components** as the style engine instead of Emotion (MUI's default): see the `@mui/styled-engine` → `@mui/styled-engine-sc` alias in `vite.config.ts`, combined with `<StyledEngineProvider injectFirst>` in `App.tsx`. `@emotion/*` packages remain as dependencies (MUI depends on them internally) but aren't used directly.

### API calls and error handling

- `api/apiClient.ts` centralizes `fetch`, the base URL (`VITE_API_BASE_URL` + `VITE_API_PATH`), and parsing of backend error responses in `ProblemDetail` format (RFC 9457). `ApiError` exposes `status` and the problem's `detail`.
- `messageErreur(err)` normalizes any caught error (`ApiError` or other) into a user-displayable message.
- Each feature hook (`useOffres`, `useOffreDetail`, `useCreerOffre`, `useImporterOffre`, `useCandidatures`, `useCvs`, ...) follows the same pattern: `useSnackbar()` + `showSuccess`/`showError`, rendered via `<AppSnackbar>`.

### List state synchronized with the URL

List hooks initialize their state from `useSearchParams` and rewrite it on every change, so users return to a list (e.g. navigating back from a detail page) in the exact state they left it:
- `features/offres/useOffres.ts` drives filter (état), pagination, and multi-selection through `useReducer(offresReducer, ...)` (`features/offres/offresReducer.ts`), synced to `?etat=&page=&taille=`.
- `features/candidatures/useCandidatures.ts` only syncs page/page size (plain `useState`, no état filter or selection) to `?page=&taille=`.

### Candidature types

A `Candidature` is one of three kinds, mirroring the backend's sealed domain model: `OFFRE` (reply to an existing job offer — never created manually, only ever produced by the backend when an offer's état moves to `POSTULE`), `SPONTANEE` (spontaneous application to a company), or `PRISE_DE_CONTACT` (contact initiated by a recruiter/headhunter or a company). `CandidatureListItem`/`CandidatureDetail` (`models/candidature.ts`) are TypeScript discriminated unions keyed on `type`, narrowed via `candidature.type === 'OFFRE'` checks — see `CandidatureDetailPage.tsx` (renders `OffreEncart` or `EntrepriseEncart`) and `CandidaturesTable.tsx`. `StatutCandidatureChip` (`components/`) picks the right status vocabulary/colors per type (`EtatOffre` for OFFRE, `StatutCandidatureSpontanee`/`StatutPriseDeContact` otherwise) — `EtatChip` stays OFFRE-only, still used as-is on `/offres`. Creation of the two manual types goes through `features/candidature-creation/` → `POST /api/v1/candidatures/spontanee` / `/prise-de-contact`.

### HTML content

Offer/candidature descriptions can contain HTML supplied by the backend. It is sanitized with `DOMPurify` before being injected via `dangerouslySetInnerHTML` (see `components/HtmlContentDialog.tsx`).
