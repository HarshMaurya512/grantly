# GRANTLY - Unified Scholarship Discovery and Management Platform

Built for THE OUTPOST, Frontend Arena, 7 Nov 2026. Solo build by Harsh Maurya.
6-hour online hackathon, React + Vite + TypeScript.

Live: https://grantly-iota.vercel.app
Repo: https://github.com/HarshMaurya512/grantly

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
    data/
      scholarships.ts
      states.ts
    lib/
      eligibility.ts
      eligibility.test.ts
      scholarships.test.ts
      storage.ts
      sanitize.ts
      applicationStatus.ts
```

## Note on data

Scholarship amounts and portals are the public figures for the 2026-27 cycle. Deadlines change during the cycle, so verify each deadline on the official portal before applying.
