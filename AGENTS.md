# AGENTS.md

## Deployment

- Production runs on Coolify with the `Dockerfile` build pack (not Nixpacks), port `3000`.
- Node.js version is pinned in the `Dockerfile` image tag (`node:24.x-bookworm-slim`); keep it in sync with `engines.node` in `package.json` and `node` in `.github/workflows/ci.yml`.
- The Docker build uses `npm ci` with `package-lock.json`; CI uses pnpm (via `packageManager` field). Do not remove `packageManager`.

## Verification

- `npm run lint`
- `npm run typecheck`
- `docker build -t inkuba-page-test .` to validate the production image locally.
