# GRANTLY - Unified Scholarship Discovery and Management Platform

Built for THE OUTPOST, Frontend Arena, 7 Nov 2026. Solo build by Harsh Maurya.
6-hour online hackathon, React + Vite + TypeScript.

Live: https://grantly-iota.vercel.app
Repo: https://github.com/HarshMaurya512/grantly

## Attempt 3 / v3 changes

Attempt 1 scored 67.12/100, rank 25, with a full FAIE breakdown. The
biggest losses were UI/UX and Responsiveness 35.7% (7.14/20), Code Quality
and Architecture 34.8% (3.48/10), and the FQE Architecture Engine 0.50/6.
Attempt 2 (TypeScript strict, split components, ESLint, Vitest, security
headers, accessibility) was pushed to GitHub as commit c2e8d31 but not
submitted. v3 builds on top of it and targets the Attempt 1 breakdown,
with no change to the 14 scholarships, their amounts, deadlines, filters,
eligibility logic, tracker behaviour, documents checklist, or the navy
and teal design.

- Responsive and UI/UX: breakpoints at 1024px, 760px, 560px and 400px in
  `src/index.css`. Stats grid 4 to 2 to 1 columns, filters 3 to 2 to 1,
  scholarship grid 2 to 1, topbar stacks on mobile, modal padding shrinks
  on small screens. Fluid typography with `clamp()` for the logo and `h1`,
  44px minimum touch targets on buttons, selects and inputs on mobile.
  Hover and focus transitions for cards, buttons and nav. A styled
  empty-state box replaces the plain text for zero filtered results.
- Architecture and performance: `React.lazy` plus `Suspense` for
  Discover, Eligibility Check, Tracker, Documents, Scholarship Detail and
  Compare, with a loading fallback. `src/hooks/useLocalStorage.ts`
  extracts the load and save pattern used for saved, applications, docs
  and compare state. Filtering and sorting moved out of `App.tsx` into
  the pure typed `src/lib/filterScholarships.ts`, covered by unit tests.
  `vite.config.js` adds a `vendor` manual chunk for react and react-dom.
  Added `public/favicon.svg` (navy square, white G) and a theme-color
  meta tag in `index.html`.
- Innovation: compare up to 3 scholarships. A Compare button on each
  scholarship card, a compare bar showing the selected count, and a
  Compare view with a side by side table for amount, deadline, level,
  category, income limit, minimum percentage, provider and open states,
  with remove and clear. Selection logic is the typed
  `src/lib/compare.ts` (capped at 3), covered by unit tests. Tests grew
  from 17 to 27: 8 new filter and sort tests and 2 new compare tests in
  `src/lib/filterScholarships.test.ts`.
- Documentation: new `ARCHITECTURE.md` (component tree, data flow, state
  and localStorage keys, lazy loading, responsive breakpoints, security
  headers) and this section in the README.

## Attempt 2 changes

Attempt 1 scored 67.12/100, rank 21, with no category breakdown. Attempt 2 targets the published rubric directly, with no change to the 14 scholarships, their amounts, deadlines, filters, eligibility logic, tracker behaviour, or the navy and teal design.

- Code Quality: converted the project to TypeScript strict (`strict`, `noUnusedLocals`, `noUnusedParameters`). Split the single `App.jsx` into typed components under `src/components/` and pure typed helpers under `src/lib/`. Added ESLint with zero errors and Vitest unit tests.
- Security: search input is trimmed, limited to 100 characters, and stripped of `< > " ' \`` characters in `src/lib/sanitize.ts`. No `dangerouslySetInnerHTML` anywhere. `vercel.json` adds security headers, including a Content-Security-Policy that allows self, inline styles, and no external scripts.
- Efficiency: no new heavy dependencies, no external fonts or images, system fonts only. Production JavaScript bundle is 168.64 kB (53.08 kB gzip), CSS is 3.54 kB.
- Accessibility: skip to main content link, semantic header, nav, main and footer, `aria-label` on navigation, `aria-live="polite"` on the results count, `aria-pressed` on Save buttons, `aria-label` on the modal Close button, `role="dialog"` with `aria-modal="true"` on the detail modal, Escape closes the modal, the modal heading receives focus on open, and every label is associated with its input.

## What it does

- Discover: 14 real Indian scholarships with search, level, category, income and state filters, and sort by deadline and amount.
- Eligibility Check: a profile form scores all 14 scholarships and gives a reason for each result.
- My Applications: Saved, Documents Pending, Applied and Submitted, with progress and deadline countdowns, saved in localStorage.
- Scholarship detail view: eligibility, benefits, documents, how to apply, and official portal.
- Documents checklist: 12 common documents, saved in localStorage.

Income filter labels are Below Rs. 2 lakh, Below Rs. 3.5 lakh, Below Rs. 6 lakh, Below Rs. 8 lakh and Below Rs. 15 lakh. State filter lists all 28 states and 8 union territories, plus All states and All India.

## Tech stack

React 18, Vite 5, TypeScript strict, ESLint, Vitest, plain CSS. No backend. Mock scholarship data in `src/data/scholarships.ts`. No secrets, no API keys.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build, lint, and test

```bash
npm run build
npm run lint
npm test
npm run preview
```

All three checks must pass with zero errors before submitting.

## Deploy

### Vercel (recommended)
1. Push this folder to GitHub.
2. Go to vercel.com, Import Project, select the repo.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. The Vercel URL stays https://grantly-iota.vercel.app after a git push to `main`, because Vercel redeploys the same project automatically.

### Netlify
1. Push this folder to GitHub.
2. Go to app.netlify.com, Add new site, Import from Git.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy.

## Project structure

```
grantly/
  index.html
  package.json
  vite.config.js
  tsconfig.json
  tsconfig.node.json
  eslint.config.js
  vercel.json
  src/
    main.tsx
    App.tsx
    index.css
    components/
      Header.tsx
      StatsBar.tsx
      ScholarshipCard.tsx
      ScholarshipDetail.tsx
      DiscoverView.tsx
      EligibilityView.tsx
      TrackerView.tsx
      DocumentsView.tsx
      CompareView.tsx
    data/
      scholarships.ts
      states.ts
    hooks/
      useLocalStorage.ts
    lib/
      eligibility.ts
      eligibility.test.ts
      scholarships.test.ts
      filterScholarships.ts
      filterScholarships.test.ts
      compare.ts
      storage.ts
      sanitize.ts
      applicationStatus.ts
  public/
    favicon.svg
```

## Note on data

Scholarship amounts and portals are the public figures for the 2026-27 cycle. Deadlines change during the cycle, so verify each deadline on the official portal before applying.
