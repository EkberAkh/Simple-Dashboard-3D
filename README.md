# Simple Dashboard 3D

A React application with a **Designers** management page and an interactive **3D Editor**, built with React Three Fiber and modern tooling.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Three.js](https://img.shields.io/badge/Three.js-R182-green) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan) ![Tests](https://img.shields.io/badge/Tests-36%20passing-brightgreen)

---

## Features

### Designers Page

- View all currently employed designers in a responsive card grid
- Add new designers via a validated form (full name, working hours)
- Edit and delete existing designers
- Attached object count updates automatically

### 3D Editor Page

- **Double-click** on the grid to place a new 3D object
- Modal form to configure the object (name, designer, color, size, **geometry**) before placement
- **5 geometry types**: Box, Sphere, Cylinder, Cone, Torus — with visual selector
- **Advanced color picker**: 8 named palettes (Corporate, Indigo, Ocean, Emerald, Sunset, Rose, Violet, Amber), native color picker, HEX input, and RGB channel controls
- **Hover** objects to highlight them
- **Click** to select — opens the properties panel
- **Drag** selected objects to reposition them on the ground plane
- Edit object properties in real-time: name, assigned designer, color, size, and geometry
- Delete objects from the properties panel

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
- **GitHub Pages** deployment via GitHub Actions

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

The project includes a GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) that automatically deploys to GitHub Pages on push to `main`. Enable GitHub Pages (Settings → Pages → Source: GitHub Actions) in your repository.

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
│   │   └── PropertiesPanel.tsx   # Object property editor sidebar
│   └── ui/                 # Reusable UI primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Modal.tsx        # Focus-trapped accessible modal
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
