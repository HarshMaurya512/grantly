# GRANTLY — Unified Scholarship Discovery and Management Platform

Built for THE OUTPOST, Frontend Arena, 7 Nov 2026. Solo build by Harsh Maurya.
6-hour online hackathon, React + Vite.

## What it does

- Discover: 14 real Indian scholarships with search, level, category, income and state filters, and sort by deadline and amount.
- Eligibility Check: a profile form scores all 14 scholarships and gives a reason for each result.
- My Applications: Saved, Documents Pending, Applied and Submitted, with progress and deadline countdowns, saved in localStorage.
- Scholarship detail view: eligibility, benefits, documents, how to apply, and official portal.
- Documents checklist: 12 common documents, saved in localStorage.

Income filter labels are Below Rs. 2 lakh, Below Rs. 3.5 lakh, Below Rs. 6 lakh, Below Rs. 8 lakh and Below Rs. 15 lakh. State filter lists all 28 states and 8 union territories, plus All states and All India.

## Tech stack

React 18, Vite 5, plain CSS. No backend. Mock scholarship data in `src/data/scholarships.js`. No secrets, no API keys.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Deploy

### Vercel (recommended)
1. Push this folder to GitHub.
2. Go to vercel.com, Import Project, select the repo.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Deploy.

### Netlify
1. Push this folder to GitHub.
2. Go to app.netlify.com, Add new site, Import from Git.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy.

### GitHub Pages
```bash
npm run build
```
Upload the contents of `dist` to the `gh-pages` branch, or use a GitHub Action for Vite.

## Project structure

```
grantly/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    index.css
    data/
      scholarships.js
      states.js
```

## Note on data

Scholarship amounts and portals are the public figures for the 2026-27 cycle. Deadlines change during the cycle, so verify each deadline on the official portal before applying.
