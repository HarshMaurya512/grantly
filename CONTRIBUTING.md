# Contributing to GRANTLY

GRANTLY is a solo hackathon project by Harsh Maurya, but small,
focused improvements are welcome. Please keep changes in the style
of the project: TypeScript strict, plain CSS, navy and teal design,
no new heavy dependencies, and no fake data.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Before you submit a change

Every check must pass with zero errors:

```bash
npm run build
npm run lint
npm test
```

- Put pure logic in `src/lib/` or `src/services/` with a unit test
  next to it. The project uses Vitest, and test files live beside
  the file they test.
- Keep components small and typed. One component, one job.
- Do not change the 14 scholarships, their amounts or their
  deadlines unless you can point to the official portal that changed
  them.
- Do not add analytics, tracking, a login page or a server. The app
  is front-end only and all user data stays in the browser.
- Keep the design plain and readable: no purple gradients, no
  pill-shaped buttons, no emoji icons, no em dashes, no fake
  reviews or fake metrics.

## How to submit

1. Fork the repository and create a short branch for your change.
2. Make the change, add or update tests, and run the three checks
   above.
3. Open a pull request with a short description of what changed and
   why, and which checks you ran.
