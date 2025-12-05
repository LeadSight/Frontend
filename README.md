# LeadSight — Frontend (Promotion & Authentication updates)

LeadSight is a React + Vite dashboard for customer promotion analytics and management. This repository contains the Frontend (UI) and a `Backend-main` folder for the API server used in development.

This README documents how to run the project, developer notes, linters, and a special section describing how charts are implemented and how to follow shadcn-style conventions used in this codebase.

---

## Table of contents
- Project overview
- Quick start
- Development and environment
- Backend (local) notes
- Linting, formatting and tests
- Project structure and important files
- Charts & shadcn conventions (HOW TO: extend & style)
- Contributing
- Troubleshooting
- License

---

## Project overview

This workspace holds a modern React dashboard app built with Vite, Tailwind CSS, and Recharts for charts. It contains:

- `src/` — main frontend source code (components, hooks, pages, contexts, styles)
- `Backend-main/` — a minimal Node/Express API used for development and testing (controllers, routes, models, migrations)

Primary user-facing features in this repo include:
- Customer listing / filtering
- Promotion/campaign analytics charts
- Customer entry & notes
- Authentication pages (login, password reset)

---

## Quick start (frontend)

Prerequisites
- Node.js (v16 or newer recommended) and npm/yarn/pnpm installed.

Install and run locally

1. Install dependencies

```powershell
npm install
```

2. Start dev server

```powershell
npm run dev
```

The app will run on the configured Vite dev server (see console for URL, typically http://localhost:5173).

---

## Backend (local development)

The `Backend-main/` folder contains a minimal server for local development. To run it:

1. Open a second terminal and navigate to `Backend-main/`:

```powershell
cd Backend-main
npm install
npm run start-dev
```

2. Confirm server logs and API availability at the configured port (check `Backend-main/src/server.js`).

3. Migrations are stored under `Backend-main/migrations`.

---

## Linting, formatting & tests

- Lint the project

```powershell
npm run lint
# or with auto-fix
npm run lint -- --fix
```

- Formatting (project may include Prettier / ESLint rules) — use your editor integration.

---

## Project structure (high level)

- src/
  - components/ — UI components grouped by feature (auth, dashboard, customer, notes, common, ui)
  - api/ — client-side API helpers
  - contexts/ — React contexts (Auth, Customers, Dashboard)
  - hooks/ — custom hooks (useAuth, useCustomers, useDashboard)
  - pages/ — top-level routes / pages
  - styles/ — global styles and Tailwind config

---

## Charts & shadcn conventions (HOW TO: extend & style)

LeadSight uses Recharts for chart rendering and a small wrapper in `src/components/ui/chart.jsx` to make charts consistent. The wrapper follows shadcn-like conventions (Tailwind + composable small components) and provides a simple theming approach for chart colors and tooltip behavior.

Key components and patterns:

- `ChartContainer` / `ChartStyle` — lightweight wrapper that exposes a `config` prop which accepts a color/label mapping. `ChartStyle` injects CSS custom properties (e.g. `--color-priority`) for use by chart elements.

- `ChartTooltip` and `ChartTooltipContent` — consistent tooltip rendering using Tailwind styles and small helper utilities for label formatting.

- Recharts responsive components are used inside `ChartContainer` so charts scale to available space.

Shadcn guidelines for this project (how to author or extend charts)

1. Keep the chart presentation (styling) separated from logic. Place data transformation in a hook or `useMemo` in the container component.

2. Use `ChartContainer` and pass a `config` object for colors / labels. Example:

```jsx
const config = { priority: { label: 'Priority', color: '#fbbf24' } };

<ChartContainer config={config} className="w-[140px] h-[140px]">
  <PieChart>
    {/* ... */}
  </PieChart>
</ChartContainer>
```

3. Let `ChartStyle` (or the inlined style in `ChartContainer`) generate CSS variables that map to the config keys, then consume them in your chart elements (e.g., pass color from config or computed variable). This keeps colors centralized and easy to theme.

4. Tooltips should use `ChartTooltipContent` to keep a consistent look & accessibility. This component accepts `payload` and `formatter` props.

5. Prefer small, focused components — follow the shadcn approach of tiny, composable UI with utility-first Tailwind classes. Put display logic (labels, markup) into small components and keep the data math separate.

6. Accessibility — ensure charts that express information also expose text labels or summaries for screen readers if necessary (small ARIA attributes or accessible data tables depending on screen reader requirements).

7. When adding a new chart: add a matching entry in `src/components/ui/chart.jsx` `config` with default label + color and keep color usage in the chart rendering logic.

Examples in the repo

- `src/components/dashboard/SegmentationChart.jsx` and `CampaignChart.jsx` show how to pass a `config` to the wrapper and use colors in `Cell` components.

Extending / theming

- To add a color token, update the `config` passed to `ChartContainer` and ensure `ChartStyle`/`Style` picks it up. The runtime style injection will create variables like `--color-yourKey` which you can apply where needed.

---

## Contributing

Please open PRs against `master` with a clear description of changes. Run lint locally before opening a PR:

```powershell
npm run lint -- --fix
```

You can also run unit / integration tests (if any) and add test coverage for new functionality.

---

## Troubleshooting

- If Vite fails to start, delete `node_modules` and `dist` and re-run `npm install`.
- If the backend API isn't reachable check `Backend-main/src/server.js` and confirm `npm run start-dev` is running.

---

## License

This project is provided under the license included in the repository (check root LICENSE if present). If none present, assume MIT-like usage until the owner supplies a license.

---

If you'd like, I can also:
- Add a short developer README for the backend `Backend-main/` folder.
- Add a contributing.md template and PR checklist that includes lint + tests.

Happy to expand — want me to add a CONTRIBUTING.md and/or update Backend README next?
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
