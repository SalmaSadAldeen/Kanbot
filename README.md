<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

 -->

# Kanbot Frontend (Client)

Kanbot is a personal Agile project management application (Kanban + Bot) designed for a single user, featuring sprint planning, a task backlog, an active sprint board, and a smart AI assistant.

---

## 🚀 Tech Stack & Design Choices

- **Framework:** React 19 + TypeScript (Strict Mode) + Vite.
- **Routing:** React Router v7 with protected routes (`ProtectedRoute`) and guest route guards (`GuestRoute`).
- **Server State Management:** TanStack Query (`@tanstack/react-query`) for caching, optimistic updates, and background data fetching.
- **Styling & UI:** Tailwind CSS for a modern, responsive enterprise design inspired by Jira.
- **State Management:** Zustand (`useAppStore`) for persistent theme switching (Dark/Light mode) and global UI toggles.
- **Icons:** `lucide-react`.

---

## ✨ Implemented Features (Day 1 & Day 2)

### 1. Authentication & Security (AUTH-1 to AUTH-6)

- **Register & Login:** Complete client-side validation, server validation display (`details[]`), duplicate email handling (409 Conflict), and loading states.
- **Session Persistence & Auto-Fetch:** Preserves JWT token in `localStorage`, verifies token status via `GET /auth/me` on startup with full-page initialization loader.
- **Session Expiration:** Intercepts `401 Unauthorized` responses on API requests and safely redirects expired sessions to `/login?redirect=...&expired=1` with feedback.
- **Log Out:** Confirmation dialog modal (`ConfirmDialog`) before clearing `localStorage` token and invalidating TanStack Query cache.

### 2. Enterprise Jira-Style Layout & AppShell (PRJ-1 to PRJ-5)

- **Full-Width Topbar:** Houses the sidebar collapse toggle, Kanbot branding, dynamic Jira-style **ProjectSwitcher**, language switcher, dark/light theme toggle, user badge, and direct Log Out button.
- **Fixed Sidebar:** Seamlessly positioned below the Topbar, maintaining stable navigation links (`Dashboard`, `Projects`, `My Tasks`, `Settings`).
- **Project Switcher:** Custom Jira-style dropdown with project search filtering (`/` shortcut), key badges, and Esc key dismissal.
- **Project Management:** Project listing page with cards, empty states, creation/edit modals (handles key 409 conflicts), and delete confirmation dialogs.

### 3. Polish & Bonus UX Improvements (§9)

- **Dark Mode Persistence:** Automatically syncs preference with `localStorage` and applies the `dark` class to `document.documentElement` without layout flash.
- **Global Keyboard Shortcuts:** Supports `Esc` for dialog closing and `/` for fast project search focus.
- **Zero Layout Shift:** Smooth layout transitions and clean responsiveness across mobile, tablet, and desktop viewports.

---

## 🛠️ How to Run

1. Ensure the backend server is running on `http://localhost:4000/api` (refer to `server/README.md`).
2. Install dependencies:
   ```bash
   npm install
   ```
