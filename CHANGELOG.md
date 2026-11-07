# GRANTLY Changelog

## Attempt 3 / v6 (7 Nov 2026)

v5 was built and verified (54 tests) but not submitted; v6 supersedes
it as the Attempt 3 version, the last attempt. Attempt 2 scored
76.29/100, rank 23, PASSING GRADE. All v6 features are our own
implementations in our own codebase, wording and design. No other
entrant's code, text or design was used, and no login page or persona
switching was added: the app has no accounts.

- Dark mode: new `useDarkMode` hook that reads the saved choice,
  respects the operating system preference on first load, and applies
  `data-theme` to the page. Dark / Light button in the header.
  Dark overrides in `src/index.css` under `[data-theme="dark"]`.
- Aid calculator: new view with pure typed `src/lib/aidCalculator.ts`.
  Tick scholarships (saved ones pre-ticked), enter an annual cost in
  rupees, see total aid and the gap or surplus, labelled as an
  estimate, not a guarantee.
- Export: new `src/lib/exportData.ts`. CSV of tracked applications
  and .ics calendar of deadlines, both made in the browser with a
  Blob download. Buttons in TrackerView and DashboardView.
- Search debounce: new `useDebounce` hook (300 ms) for the Discover
  search; the input stays responsive while filtering waits.
- Docs: new `SECURITY.md` and `CONTRIBUTING.md`.
- Tests grew from 54 to 77: 4 dark mode, 3 debounce, 8 aid
  calculator and 8 export tests, plus routing coverage for the new
  calculator view.

## Attempt 3 / v5 (7 Nov 2026)

Built and verified (54 tests) but not submitted; superseded by v6.
Attempt 2 scored 76.29/100, rank 23, PASSING GRADE. v4 was built and
verified but not submitted; v5 supersedes it. All v5 features are our
own implementations in our own codebase, wording and design. No other
entrant's code, text or design was used.

- Home: new default view with a hero, real counts from the data,
  a 3-step How it works section and the 3 soonest-closing
  scholarships.
- Scholarship assistant: new rule-based view, labelled as not a
  live AI model, answering from the 14 scholarships and the
  eligibility results.
- Dashboard: saved count, applications by status, documents
  progress, nearest deadline, top 3 eligible matches, Compare
  shortcut.
- Tracker: List / Board toggle; Board groups applications into
  4 columns by status. List view unchanged.
- Documents: file input records only name, size and date in
  localStorage. File contents are never read, nothing is sent
  to a server.
- Routing: home, assistant and dashboard added; a missing or
  unknown hash now opens Home.
- Tests grew from 41 to 54: 9 assistant tests and 4 uploads tests.

## Attempt 3 / v4 (7 Nov 2026)

Built and verified but not submitted; superseded by v5 above.
Attempt 2 scored 76.29/100, rank 23.
The remaining losses were Architecture Engine 1.50/6, UI/UX and
Responsiveness 50% (10/20) and Responsive Design Engine 3.50/7.

- Architecture: new `ErrorBoundary` around the lazy-loaded views, new
  `src/services/scholarshipService.ts` data-access layer, hash routing
  in `src/lib/routing.ts` (views are deep-linkable, unknown hashes fall
  back to Discover), and `src/constants.ts` for the localStorage keys.
- Responsive and UI/UX: mobile Menu button in the header that toggles
  the nav at 760px and below, toast feedback for save, track, remove
  and compare actions, a skeleton loading state for lazy views, a
  `prefers-reduced-motion` rule that disables transitions, and an
  urgent deadline style for scholarships with 30 days or fewer left.
- Documentation: this CHANGELOG, a mermaid component diagram and a
  routing section in `ARCHITECTURE.md`.
- Tests grew from 27 to 41: 8 routing tests and 6 service tests.

## Attempt 2 / v3 (7 Nov 2026)

Attempt 1 scored 67.12/100, rank 25. v3 targeted UI/UX and
Responsiveness 35.7%, Code Quality and Architecture 34.8% and the FQE
Architecture Engine 0.50/6. Submitted 17:07 IST, scored 76.29/100,
rank 23, PASSING GRADE, up 9.17 points.

- Responsive breakpoints at 1024, 760, 560 and 400px, fluid type,
  44px touch targets, hover transitions, styled empty state.
- React.lazy and Suspense for all views, vendor chunk split,
  `useLocalStorage` hook, filtering moved to a tested lib, favicon
  and theme colour.
- Compare up to 3 scholarships side by side.
- Tests grew from 17 to 27.

## Attempt 2 / v2 (7 Nov 2026)

Built from the Attempt 1 rubric before the category breakdown was
visible. Pushed to GitHub as commit c2e8d31 but not submitted;
superseded by v3.

- TypeScript strict, split components, ESLint zero errors, Vitest
  17/17 tests, security headers, input sanitisation, accessibility
  (skip link, ARIA, Escape modal), copyright footer.

## Attempt 1 / v1 (7 Nov 2026)

Submitted 16:19 IST. Scored 67.12/100, rank 21, ACTION REQUIRED.
React and Vite app with 14 real Indian scholarships, Discover with
search and filters, Eligibility Check, My Applications tracker,
detail view, documents checklist and deadline list.
