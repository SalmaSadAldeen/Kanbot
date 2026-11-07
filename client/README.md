# Kanbot Client

Kanbot is a sprint planning and backlog management app designed for personal and small-team agile workflows. The client is a React + TypeScript interface for creating projects, managing backlog work, planning sprints, tracking an active sprint board, and interacting with an AI assistant while keeping the experience bilingual and theme-aware.

## Project overview

The app follows a Jira-inspired enterprise layout with:

- A persistent app shell and navigation
- Project-based workspaces
- Backlog management with inline creation and rich detail dialogs
- Sprint planning and board tracking
- AI-driven backlog generation and sprint planning
- Bidirectional English/Arabic localization
- Light/dark visual themes with persistence

This frontend is intentionally structured around a clean architecture to avoid prop drilling and keep state concerns centralized.

## Architecture

### 1. Application structure

```text
src/
  api/            # HTTP helpers for auth, projects, sprints, AI, todos
  components/     # shared UI primitives and shell layout
  features/       # feature modules: auth, projects, backlog, sprint, board, ai
  hooks/          # domain-specific hooks over TanStack Query
  i18n/           # EN/AR translation catalog
  store/          # Zustand stores for app-wide settings
  types/          # shared API typings
  router.tsx      # route table and guards
  main.tsx        # app bootstrap
```

### 2. Zero Prop Drilling pattern

The client avoids passing shared state down through many React component layers by using:

- Zustand stores for global app state such as language, theme, and sidebar behavior
- TanStack Query hooks for server state, cache synchronization, and optimistic updates
- Feature-level hooks that encapsulate queries, mutations, and derived logic
- Route-level and provider-level composition instead of threading props through unrelated components

This keeps the UI easier to maintain and prevents local state from becoming tightly coupled to unrelated screens.

### 3. State and data flow

- Global UI settings live in `src/store/useAppStore.ts`
- Feature data is managed through hooks in `src/hooks/`
- API communication is isolated in `src/api/`
- Pages and dialogs consume the hooks and stores instead of receiving large prop trees
- Route guards in `src/features/auth/` protect public and authenticated flows

### 4. i18n: EN/AR support

The app ships with a complete translation catalog in `src/i18n/translations.ts` and a language store that persists the selected language.

Key characteristics:

- `en` and `ar` are both supported
- The document direction is set with `dir` and `lang` on `document.documentElement`
- RTL layouts are applied automatically for Arabic
- UI strings, button labels, validation messages, and contextual text all use the shared translation object

### 5. Dark mode

Dark mode is implemented in the app store and applied globally via the `dark` class on the root element.

Behavior:

- Theme preference is persisted locally
- Light and dark classes are toggled centrally
- The theme is applied before rendering completes for a consistent experience
- The design system uses dark Tailwind variants to keep contrast and accessibility in check

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Lucide React
- Zod validation

## Setup instructions

### Prerequisites

- Node.js 18+ recommended
- npm
- A running Kanbot backend on the local API server (see the server project README)

### Install dependencies

```bash
cd client
npm install
```

### Start in development mode

```bash
cd client
npm run dev
```

The client expects the API server to be available at the configured local backend endpoint.

### Production build

```bash
cd client
npm run build
```

### Linting

```bash
cd client
npm run lint
```

## Requirements compliance summary

The client implements the core application requirements around project, backlog, sprint, localization, and accessibility-focused UX.

### PRJ — Project management

- Project list view
- Create, edit, and delete flows
- Active project switching and navigation
- Empty and error states for project management

### BL — Backlog and todo management

- Backlog listing with counts and totals
- Quick create workflow
- Todo detail dialogs and editing flow
- Delete and mutate flows
- Search and filtering experience
- Sprint and backlog organization logic

### i18n

- Language toggle between English and Arabic
- UI text drawn from a centralized translation table
- RTL orientation support for Arabic
- Localized common actions, errors, and labels

### Dark mode

- Theme toggle persisted across sessions
- Root-level dark class applied globally
- Dark-mode-friendly surface styling across shared UI

### Zero Prop Drilling

- Shared app state centralized in Zustand
- Query and mutation flows centralized behind hooks
- Feature modules remain decoupled and easier to extend

## Notes

This repository is structured as a full-stack project:

- `client/` contains the React frontend
- `server/` contains the Express + TypeScript API and data layer

The frontend README is intentionally focused on the client-side architecture and quality standards for the Kanbot product.

## Implementation status

This client includes the project and backlog implementation, the bilingual interface, dark mode support, and the zero-prop-drilling architecture needed for the Kanbot workflow.
