# GRANTLY Security Policy

GRANTLY is a front-end only app. There is no server, no database, no
accounts and no login. Everything a user saves stays in their own
browser.

## What data exists, and where it lives

- Saved scholarships, tracked applications, documents checklist,
  compared scholarships, uploaded file records (name, size and date
  only) and the theme choice are stored in the browser with
  `localStorage` under keys starting with `grantly-`.
- Uploaded file contents are never read and never sent anywhere.
- The app makes no network requests of its own. The only requests are
  the ones the browser makes to load the app itself from Vercel.

## What the app does to stay safe

- Search input is trimmed, limited to 100 characters and stripped of
  `< > " ' \`` characters before it is used (`src/lib/sanitize.ts`).
- The app never uses `dangerouslySetInnerHTML`, so user input is never
  rendered as HTML.
- Vercel serves security headers (`vercel.json`): a Content Security
  Policy that allows scripts and styles from the app itself only,
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` and a
  strict referrer policy.
- Dependencies are the smallest set that does the job: React, Vite,
  TypeScript, ESLint and Vitest. There are no analytics, tracking or
  advertising scripts.

## Reporting a problem

If you find a security problem, please open an issue on the GitHub
repository at https://github.com/HarshMaurya512/grantly with the
words "Security issue" in the title and a clear description of what
you found. Do not include any other person's personal data in the
report.
