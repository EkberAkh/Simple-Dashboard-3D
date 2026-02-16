# Simple Dashboard 3D

A React application with a **Designers** management page and an interactive **3D Editor**, built with React Three Fiber and modern tooling.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Three.js](https://img.shields.io/badge/Three.js-R182-green) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan) ![Tests](https://img.shields.io/badge/Tests-36%20passing-brightgreen)

**Live Demos:**

- **GitHub Pages:** [https://ekberakh.github.io/Simple-Dashboard-3D/](https://ekberakh.github.io/Simple-Dashboard-3D/)
- **Vercel:** [https://akbar-simple-dashboard-3d.vercel.app](https://akbar-simple-dashboard-3d.vercel.app)

---

## Features

### Designers Page

- View all currently employed designers in a responsive card grid
- Add new designers via a validated form (full name, working hours)
- Edit and delete existing designers with confirmation modal
- Attached object count updates automatically

### 3D Editor Page

- **Double-click** on the grid to place a new 3D object
- Modal form to configure the object (name, designer, color, size, **geometry**) before placement
- **5 geometry types**: Box, Sphere, Cylinder, Cone, Torus — with visual selector
- **Advanced color picker**: 8 named palettes (Corporate, Indigo, Ocean, Emerald, Sunset, Rose, Violet, Amber), native color picker, HEX input, and RGB channel controls
- **Hover** objects to highlight them
- **Click** to select — opens the properties panel
- **Drag** selected objects to reposition them on the ground plane
- Edit object properties via modal: name, assigned designer, color, size, and geometry
- Delete objects with confirmation dialog

### Mobile Responsive

- Fully responsive from **330px** to desktop
- Hamburger menu with animated Menu ↔ X icon and slide-down navigation
- Mobile-optimized 3D editor with floating pill FAB and bottom sheet properties panel
- Compact color picker on mobile (palette + HEX only, no RGB/preview)
- Scrollable modals capped at `90dvh` for small screens
- Touch-friendly controls and tap targets throughout

### Accessibility

- Skip-to-content link for keyboard / screen-reader users
- Full focus trapping in modals with focus restoration on close
- ARIA roles, labels, and live regions throughout
- `aria-invalid` and `role="alert"` on form validation errors
- Semantic HTML (`<article>`, `<nav>`, `<main>`, `role="list"` / `role="listitem"`)
- Keyboard navigable (Tab, Shift+Tab, Escape)

### Testing

- **36 tests** across 3 test suites (Vitest + jsdom)
  - Mock API CRUD operations (11 tests)
  - Zod validation schemas (15 tests)
  - Zustand store behavior (10 tests)

### Technical Highlights

- **Mock API** with `localStorage` persistence — easily swappable for a real backend via the `ApiClient` interface
- **Zustand** for lightweight, scalable state management
- **React Hook Form + Zod v4** for robust form validation
- **React Three Fiber + Drei** for declarative 3D scene management
- **Tailwind CSS v4** with custom theme tokens
- Fully typed with **TypeScript** (zero errors)
- Clean, modular architecture
- Dual deployment: **GitHub Pages** (GitHub Actions) + **Vercel** (auto-detect)

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/EkberAkh/Simple-Dashboard-3D.git
cd Simple-Dashboard-3D

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run preview
```

### Tests

```bash
# Run all tests once
npm test

# Watch mode
npm run test:watch
```

### Deployment

The project is configured for dual deployment:

- **GitHub Pages** — GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) automatically builds and deploys on push to `main`. Enable via Settings → Pages → Source: GitHub Actions.
- **Vercel** — Auto-detected as a Vite project. The `VERCEL` environment variable switches the base path to `/` automatically. A [vercel.json](vercel.json) handles SPA rewrites.

---

## Project Structure

```
src/
├── api/                    # API layer (types, mock implementation)
│   ├── types.ts            # Domain models & ApiClient interface
│   ├── mockApi.ts          # Mock API with localStorage persistence
│   └── index.ts            # Re-export (swap point for real API)
├── store/                  # Zustand state management
│   ├── designerStore.ts    # Designer CRUD state
│   ├── objectStore.ts      # 3D Object CRUD state
│   └── editorStore.ts      # Editor UI state (selection, hover)
├── schemas/                # Zod validation schemas
│   ├── designerSchema.ts
│   └── objectSchema.ts
├── components/
│   ├── layout/             # App shell (Navbar, Layout)
│   ├── designers/          # Designer page components
│   ├── editor/             # 3D Editor components
│   │   ├── Scene.tsx       # Main 3D scene (lights, grid, controls)
│   │   ├── Ground.tsx      # Ground plane with double-click handler
│   │   ├── SceneObjectMesh.tsx   # Interactive 3D object (multi-geometry)
│   │   ├── AddObjectModal.tsx    # Object creation form
│   │   ├── EditObjectModal.tsx   # Object editing form
│   │   └── PropertiesPanel.tsx   # Object property editor sidebar
│   └── ui/                 # Reusable UI primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx       # Custom dropdown with keyboard navigation
│       ├── Modal.tsx        # Focus-trapped accessible modal
│       ├── ConfirmModal.tsx # Confirmation dialog
│       ├── Badge.tsx
│       ├── ColorPicker.tsx  # Advanced color picker (palettes + HEX + RGB)
│       └── GeometrySelector.tsx  # Visual geometry type selector
├── test/                   # Test suites
│   ├── setup.ts            # Vitest setup (localStorage mock, jest-dom)
│   ├── mockApi.test.ts     # API CRUD tests
│   ├── schemas.test.ts     # Validation schema tests
│   └── stores.test.ts      # Zustand store tests
├── pages/                  # Route-level page components
├── App.tsx                 # Route configuration
├── main.tsx                # Entry point
└── index.css               # Global styles & Tailwind theme
```

---

## Architecture Decisions

| Decision                                | Rationale                                                            |
| --------------------------------------- | -------------------------------------------------------------------- |
| **React Three Fiber** over raw Three.js | Declarative, composable, integrates naturally with React lifecycle   |
| **Zustand** over Redux                  | Less boilerplate, simpler API, sufficient for this scale             |
| **Zod v4** for validation               | Type-safe schema validation with excellent TypeScript inference      |
| **Mock API with interface**             | `ApiClient` interface makes swapping to a real API a one-line change |
| **localStorage persistence**            | Data persists across refreshes as required; easily replaceable       |
| **Tailwind CSS v4**                     | Utility-first styling with `@theme` tokens for consistent design     |
| **Dual deploy (Pages + Vercel)**        | Platform-agnostic base path via `VERCEL` env auto-detection          |

---

## Tech Stack

- **React 19** — UI framework
- **TypeScript 5** — Type safety
- **Vite 7** — Build tooling
- **React Router 7** — Client-side routing
- **Zustand 5** — State management
- **React Three Fiber 9 + Drei 10** — 3D rendering
- **Three.js r182** — 3D engine
- **React Hook Form 7** — Form management
- **Zod 4** — Schema validation
- **Tailwind CSS 4** — Styling
- **Vitest 4** — Testing framework
- **Lucide React** — Icons
