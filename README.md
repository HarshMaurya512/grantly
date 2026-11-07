# GRANTLY - Unified Scholarship Discovery and Management Platform

Built for THE OUTPOST, Frontend Arena, 7 Nov 2026. Solo build by Harsh Maurya.
6-hour online hackathon, React + Vite + TypeScript.

Live: https://grantly-iota.vercel.app
Repo: https://github.com/HarshMaurya512/grantly

## Attempt 3 / v6 changes (final attempt)

v5 was built and verified (54 tests) but not submitted. v6 supersedes
it as the Attempt 3 version, the last attempt. Attempt 2 scored
76.29/100, rank 23, PASSING GRADE. v6 adds a dark mode, an aid
calculator, client-side export and debounced search, all implemented
in our own codebase with our own wording and design. No other
entrant's code, text or design was used, and no login page or
persona switching was added: the app has no accounts.

- Dark mode: new `useDarkMode` hook (`src/hooks/useDarkMode.ts`)
  that reads the saved choice from localStorage, respects the
  operating system preference on first load, and applies
  `data-theme` to the page. A Dark / Light button in the header
  toggles it. Dark overrides live in `src/index.css` under
  `[data-theme="dark"]`; light mode is unchanged.
- Aid calculator: new view (`CalculatorView.tsx`) backed by the pure
  typed `src/lib/aidCalculator.ts`. Tick any of the 14 scholarships
  (saved ones are ticked already), enter an annual college cost in
  rupees, and see total selected aid, the cost, and the gap or
  surplus. Amounts are the listed amounts, per year unless a
  scholarship text says otherwise, and the result is labelled as
  an estimate, not a guarantee.
- Export: `src/lib/exportData.ts` builds a CSV of tracked
  applications and an .ics calendar of their deadlines, both made
  in the browser with a Blob download. Buttons are in TrackerView
  and DashboardView. CSV cells are escaped; the ICS file is one
  VEVENT per application on its deadline date.
- Search debounce: new `useDebounce` hook
  (`src/hooks/useDebounce.ts`, 300 ms). The search box stays
  responsive while filtering waits for typing to pause.
- Docs: new `SECURITY.md` and `CONTRIBUTING.md`, and a v6 entry in
  `CHANGELOG.md`. Tests grew from 54 to 77: dark mode, debounce,
  aid calculator and export tests.

## Attempt 3 / v5 changes

v4 was built and verified (41 tests) but not submitted. v5 was built
and verified (54 tests) but not submitted either; v6 supersedes it.
Attempt 2 scored 76.29/100, rank 23, PASSING GRADE. v5 adds three
new views and two view upgrades, all implemented in our own codebase
with our own wording and design. No other entrant's code, text or
design was used.

- Home: new default view (`HomeView.tsx`) with a hero, real counts
  computed from the data (14 scholarships, provider count, nearest
  deadline, saved count), a 3-step How it works section, and the
  3 soonest-closing scholarships with View details buttons.
- Scholarship assistant: new view (`AssistantView.tsx`) backed by the
  pure typed `src/lib/assistant.ts`. Rule-based only, labelled in the
  UI as not a live AI model. It answers best matches, soonest
  deadlines, Girls, Merit, Need-based and income-limit questions from
  the 14 scholarships and the eligibility results, with a fallback
  for questions it cannot answer.
- Dashboard: new view (`DashboardView.tsx`) with saved count,
  applications by status, documents progress, nearest deadline,
  top 3 eligible matches and a Compare shortcut.
- Tracker: List / Board toggle. Board groups applications into 4
  columns by status; each card keeps the status select and progress
  bar. List view is unchanged.
- Documents: a file input records only the file name, size and date
  in localStorage (`grantly-uploads`). File contents are never read
  and nothing is sent to a server.
- Routing: `home`, `assistant` and `dashboard` added to the View
  type and to hash routing; a missing or unknown hash now opens Home.
  Tests grew from 41 to 54: 9 assistant tests and 4 uploads tests.

## Attempt 3 / v4 changes

Attempt 2 scored 76.29/100, rank 23, PASSING GRADE. The remaining
losses were Architecture Engine 1.50/6, UI/UX and Responsiveness 50%
(10/20) and Responsive Design Engine 3.50/7. v4 is additive only: no
change to the 14 scholarships, their amounts, deadlines, filters,
eligibility logic, tracker, documents, compare behaviour, or the navy
and teal design, and the accessibility work that scored 7/7 is
untouched. v4 was built and verified but not submitted; v5 above
supersedes it as the Attempt 3 submission.

- Architecture: `ErrorBoundary` around the lazy-loaded views, a typed
  `src/services/scholarshipService.ts` data-access layer, hash routing
  in `src/lib/routing.ts` (deep-linkable views, unknown hashes fall
  back to Discover), and `src/constants.ts` for the localStorage keys.
- Responsive and UI/UX: mobile Menu button in the header that toggles
  the nav at 760px and below, toast feedback for save, track, remove
  and compare actions, a skeleton loading state for lazy views, a
  `prefers-reduced-motion` rule, and an urgent deadline style when
  30 days or fewer are left.
- Documentation: `CHANGELOG.md`, a mermaid component diagram and a
  routing section in `ARCHITECTURE.md`. Tests grew from 27 to 41.

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

- Home: hero, real counts, How it works, and the 3 soonest-closing scholarships.
- Discover: 14 real Indian scholarships with search, level, category, income and state filters, and sort by deadline and amount.
- Eligibility Check: a profile form scores all 14 scholarships and gives a reason for each result.
- Scholarship assistant: rule-based answers from the 14 scholarships only, labelled as not a live AI model.
- Dashboard: saved count, applications by status, documents progress, nearest deadline and top matches.
- Aid calculator: pick scholarships and an annual cost to see total aid and the gap or surplus, labelled as an estimate.
- My Applications: Saved, Documents Pending, Applied and Submitted, with progress and deadline countdowns, saved in localStorage. List and Board views, plus CSV and .ics deadline export made in the browser.
- Dark mode: a Dark / Light button in the header, saved in the browser, following the operating system preference on first load.
- Scholarship detail view: eligibility, benefits, documents, how to apply, and official portal.
- Documents checklist: 12 common documents, saved in localStorage, plus file records (name, size, date) kept in the browser only.

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
      ErrorBoundary.tsx
      Toast.tsx
      HomeView.tsx
      AssistantView.tsx
      DashboardView.tsx
      CalculatorView.tsx
    data/
      scholarships.ts
      states.ts
    hooks/
      useLocalStorage.ts
      useDarkMode.ts
      useDarkMode.test.ts
      useDebounce.ts
      useDebounce.test.ts
    lib/
      eligibility.ts
      eligibility.test.ts
      scholarships.test.ts
      filterScholarships.ts
      filterScholarships.test.ts
      compare.ts
      routing.ts
      routing.test.ts
      assistant.ts
      assistant.test.ts
      aidCalculator.ts
      aidCalculator.test.ts
      exportData.ts
      exportData.test.ts
      uploads.ts
      uploads.test.ts
      storage.ts
      sanitize.ts
      applicationStatus.ts
    services/
      scholarshipService.ts
      scholarshipService.test.ts
    constants.ts
  public/
    favicon.svg
  ARCHITECTURE.md
  CHANGELOG.md
  SECURITY.md
  CONTRIBUTING.md
```

## Note on data

Scholarship amounts and portals are the public figures for the 2026-27 cycle. Deadlines change during the cycle, so verify each deadline on the official portal before applying.
