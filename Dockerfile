ARG NODE_IMAGE=node:20-alpine

FROM ${NODE_IMAGE} AS source

ARG REPO_URL=https://github.com/VasquezMaldonadoSebastian/KimnGenero.git
ARG REPO_REF=main

RUN apk add --no-cache git
WORKDIR /src
RUN git clone --depth 1 --branch "$REPO_REF" "$REPO_URL" app \
  || (git clone --depth 1 "$REPO_URL" app && cd app && git fetch --depth 1 origin "$REPO_REF" && git checkout FETCH_HEAD)

FROM ${NODE_IMAGE} AS build

RUN corepack enable
WORKDIR /app
COPY --from=source /src/app ./
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM ${NODE_IMAGE} AS prod-deps

RUN corepack enable
WORKDIR /app
COPY --from=source /src/app/package.json ./package.json
COPY --from=source /src/app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

FROM ${NODE_IMAGE} AS runtime

ENV NODE_ENV=production
ENV PORT=3000
ENV INDICATOR_REPOSITORY=memory
ENV CSP_REPORT_ONLY=true

RUN apk add --no-cache wget
WORKDIR /app

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=source --chown=node:node /src/app/data ./data
COPY --from=source --chown=node:node /src/app/package.json ./package.json

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" >/dev/null || exit 1

CMD ["node", "dist/index.js"]
