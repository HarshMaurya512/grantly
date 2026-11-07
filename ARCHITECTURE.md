# GRANTLY Architecture

## Overview

GRANTLY is a React 18 + Vite 5 + TypeScript strict single-page app with no
backend. Scholarship data is a static typed list in `src/data/scholarships.ts`.
All user state is kept in the browser with localStorage.

## Component tree

```
App.tsx
  Header.tsx            topbar, logo, main navigation (Discover, Eligibility
                        Check, My Applications, Documents, Compare)
  StatsBar.tsx          saved count, in-progress count, nearest deadline,
                        total scholarships listed
  CompareBar            shown in App when 1 to 3 scholarships are selected
                        for comparison; links to the Compare view
  DiscoverView.tsx      filters, results count, scholarship grid
    ScholarshipCard.tsx View details, Save, Track, Compare
  EligibilityView.tsx   profile form, scored results with reasons
  TrackerView.tsx       applications, status select, progress bar
  DocumentsView.tsx     12-item checklist
  CompareView.tsx       side by side table for up to 3 scholarships
  ScholarshipDetail.tsx modal: benefits, documents, how to apply
  footer                disclaimer and copyright
```

## Data flow

- `SCHOLARSHIPS` (14 items) and `DOCUMENT_CHECKLIST` (12 items) live in
  `src/data/scholarships.ts`. Amounts, deadlines, providers and eligibility
  rules are not changed by any view.
- Discover filtering and sorting is a pure function,
  `filterScholarships(list, filters)` in `src/lib/filterScholarships.ts`.
  It is called from App with `useMemo` and is covered by unit tests.
- Eligibility scoring is a pure function, `scoreEligibility(profile, s)`
  in `src/lib/eligibility.ts`.
- Compare selection is a pure function, `toggleCompare(selected, id)` in
  `src/lib/compare.ts`, capped at 3 ids.
- Search input is sanitised in `src/lib/sanitize.ts` (trim, 100 chars,
  strips `< > " ' \``). No `dangerouslySetInnerHTML` anywhere.

## State and localStorage keys

| State | Key | Hook |
|---|---|---|
| Saved scholarship ids | `grantly-saved` | `useLocalStorage` |
| Applications | `grantly-applications` | `useLocalStorage` |
| Documents checklist | `grantly-docs` | `useLocalStorage` |
| Compare selection | `grantly-compare` | `useLocalStorage` |
| Filters, profile, selected detail | in-memory `useState` only | - |

`useLocalStorage` in `src/hooks/useLocalStorage.ts` wraps `useState` with
the `load` / `save` helpers in `src/lib/storage.ts`, so App no longer
repeats a load-initializer plus a save `useEffect` for each key.

## Lazy loading and performance

- `DiscoverView`, `EligibilityView`, `TrackerView`, `DocumentsView`,
  `ScholarshipDetail` and `CompareView` are loaded with `React.lazy` and
  rendered inside one `Suspense` boundary in App with a plain
  "Loading view..." fallback. `Header` and `StatsBar` stay eager, so the
  first paint keeps the topbar and progress summary.
- `vite.config.js` sets `build.rollupOptions.output.manualChunks` with a
  `vendor` chunk for `react` and `react-dom`, so the framework code is
  cached separately from app code.
- No external fonts, images or heavy dependencies. Only system fonts and
  one small inline SVG favicon (`public/favicon.svg`).

## Responsive breakpoints

Defined in `src/index.css`, mobile-first in effect, navy `#0f2a44` and
teal `#0e7a6b` throughout, rectangular buttons (border-radius 4px):

- 1024px: stats 4 to 2 columns, filters and form 3 to 2 columns.
- 760px: stats stay 2 columns, filters, form and scholarship grid go to
  1 column, topbar stacks, modal padding shrinks.
- 560px: stats go to 1 column, nav buttons go full width, buttons,
  selects and inputs get 44px minimum touch targets, action buttons go
  full width and stack, compare bar stacks.
- 400px: page and card padding shrink further, deadline badge goes full
  width so it never overflows a narrow screen.

Typography is fluid: the logo and `h1` use `clamp()`. Cards lift
slightly with a shadow on hover, buttons change background on hover and
focus, all with short 0.15s transitions. The compare table scrolls
horizontally inside `.table-wrap` on small screens instead of overflowing.

## Security headers

`vercel.json` sends `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY`, `Referrer-Policy:
strict-origin-when-cross-origin`, a `Permissions-Policy` disabling
camera, microphone and geolocation, and a Content-Security-Policy that
allows self, inline styles and no external scripts.

## Tests

Vitest, run with `npm test`. Coverage: eligibility scoring, search
sanitisation, scholarship data integrity, date helpers, the filter and
sort function, and the compare toggle and cap.
