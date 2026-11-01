# Kanbot Design System & UI Guidelines

This document serves as the absolute visual, architectural, and design reference for the Kanbot application. All generated components, styles, and layouts MUST strictly adhere to this system.

---

## 1. Color Palette

Based on the official Kanbot logo branding:

### Primary / Brand Colors (Indigo & Violet Blue)

- **Primary Main (Brand Blue):** `#5850EC` / `bg-indigo-600` / `text-indigo-600`
- **Primary Hover:** `#4338CA` / `bg-indigo-700`
- **Primary Soft / Subdued:** `#EEF2FF` / `bg-indigo-50` / `text-indigo-700`

### Accent / Status Colors (Emerald Green - AI & Active Indicators)

- **Accent Main (AI Active):** `#10B981` / `bg-emerald-500` / `text-emerald-500`
- **Accent Hover:** `#059669` / `bg-emerald-600`
- **Accent Light:** `#ECFDF5` / `bg-emerald-50` / `text-emerald-700`

### Neutral Colors (Slate Scale)

- **Background Light:** `#F8FAFC` / `bg-slate-50`
- **Card / Surface Light:** `#FFFFFF` / `bg-white`
- **Border Light:** `#E2E8F0` / `border-slate-200`
- **Text Primary:** `#0F172A` / `text-slate-900`
- **Text Muted:** `#64748B` / `text-slate-500`

### Dark Mode Scale & System Support

- **Background Dark:** `#0F172A` / `dark:bg-slate-900`
- **Surface Dark:** `#1E293B` / `dark:bg-slate-800`
- **Border Dark:** `#334155` / `dark:border-slate-700`
- **Text Dark:** `#F8FAFC` / `dark:text-slate-50`

---

## 2. Priority & Status Visual Mappings

### Todo Priorities

- **Urgent:** Red badge (`bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900`)
- **High:** Orange badge (`bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900`)
- **Medium:** Blue badge (`bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900`)
- **Low:** Slate badge (`bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700`)

### Todo Types

- **Task:** Check icon (Blue `#5850EC`)
- **Story:** Bookmark icon (Purple `#7C3AED`)
- **Bug:** Alert / Bug icon (Red `#EF4444`)

---

## 3. Typography & Spacing Rules

- **Font Family:** `Inter`, `system-ui`, `sans-serif`
- **Border Radius:** Rounded MD (`rounded-lg` for cards, `rounded-md` for inputs/buttons, `rounded-full` for badges)
- **Elevation / Shadows:**
  - Cards: `shadow-sm hover:shadow transition-shadow duration-200`
  - Modals / Dialogs: `shadow-xl border border-slate-200 dark:border-slate-800`
  - AI Drawer: `shadow-2xl border-l border-slate-200 dark:border-slate-800`

---

## 4. Form Validation & Error Security (Zod & RHF Integration)

- **Validation Rules:** All forms (Login, Register, Project Creation, Task Management) **MUST** be validated using **Zod** schemas integrated with **React Hook Form**.
- **Error Display:** Form inputs must exhibit clear error states:
  - Input Border on Error: `border-red-500 focus:ring-red-500`
  - Error Text Helper: `text-xs text-red-500 mt-1 font-medium`
- **API Server Errors:** Handled via global `ApiError` mapping, displaying as an alert banner at the top of the form container.

---

## 5. Component Behavior Guidelines

- **Buttons:**
  - **Primary:** `bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed`
  - **AI Action:** `bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-150`
  - **Secondary:** `bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors duration-150 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700`

- **Empty States:** Always display a subtle illustration/icon, a clear bold header, a brief subtext, and an actionable primary button.
- **Loading States:** Use pulse skeletons (`animate-pulse bg-slate-200 dark:bg-slate-800 rounded`) matching the exact structure of the loaded content.
