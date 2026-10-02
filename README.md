# Wordle (static)

A fully client-side Wordle built with React, TypeScript and Vite. It's a port of `wordle_app`: the same UI, with the Flask game logic rewritten in TypeScript (`src/game/`) so it runs on GitHub Pages without a server.

## Scripts

```sh
npm install
npm run dev      # local dev server
npm test         # game engine unit tests (Vitest)
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Deploy

Push to `main` on GitHub. In the repo settings, set **Pages → Source** to **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` tests, builds and publishes `dist/`. Vite uses a relative `base`, so it works under any repo name.
