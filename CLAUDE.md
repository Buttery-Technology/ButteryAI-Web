Inherits `~/Dev/Buttery/CLAUDE.md` — only package-specific deltas below.

Static React frontend for **butteryai.com** (the flagship dashboard app). Not Swift — Node/React 19 + Vite 7 + TypeScript, deployed as static content to GitHub Pages.

## Toolchain & scripts (npm)
- Use **npm** (`npm ci` / `npm install`). Both `package-lock.json` and a stale `pnpm-lock.yaml` are committed, but CI and the build use npm — ignore the pnpm lock.
- `npm run dev` — Vite dev server.
- `npm run build` — runs `tsc && vite build` (typecheck gates the build; `noUnusedLocals`/`noUnusedParameters` are on, so unused vars fail the build).
- `npm run lint` — `eslint . --ext ts,tsx --max-warnings 0` (zero-warning policy).
- `npm run preview` — serve the built `dist/`.
- **No test runner is configured** (no `test` script). Verification = `tsc`/build + lint only.

## Backend wiring
- API base is `import.meta.env.VITE_API_URL || "/api"` (`src/api.ts` → `BUTTERY_API_URL`). In dev, `/api` is proxied by Vite to **`http://127.0.0.1:8080`** (see `vite.config.ts`), i.e. a locally running **ButteryAI-Server**. Run that server for the app to work locally.
- Auth is **SRP** (`/srp/login|verify|register`) with cookie sessions (`credentials: "include"` on every request).
- Firebase (`src/firebase.ts`) is **Firestore-only** with a hardcoded public `firebaseConfig` — not env-driven, do not "fix" it into env vars.
- `gRPC/DistributedSystem.proto` is a reference schema only; there is **no codegen step** — `src/services/clusterClient.ts` talks to the server over REST/`fetch`, not generated gRPC stubs.

## Path aliases (keep both files in sync)
Aliases are declared in **both** `vite.config.ts` (resolve) and `tsconfig.json` (paths); add new ones to both: `@assets`, `@common`, `@hooks`, `@mixins`, `@global` (→ `src/app/Global`). Styling uses Sass (`.scss`).

## Deploy
`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on push to `main`, injecting `VITE_API_URL=https://server.butteryai.com/api`. Custom domain is pinned by `CNAME` (`butteryai.com`) — keep it.