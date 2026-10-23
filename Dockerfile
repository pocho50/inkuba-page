FROM node:24.22.1-bookworm-slim AS builder

WORKDIR /app

COPY . .
RUN npm ci && npm run build

FROM node:24.22.1-bookworm-slim

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

WORKDIR /app
RUN chown node:node /app

COPY --from=builder --chown=node:node /app/.output ./.output

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
