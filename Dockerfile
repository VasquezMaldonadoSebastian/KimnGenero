ARG NODE_IMAGE=node:22.13-alpine

FROM ${NODE_IMAGE} AS build
RUN npm install --global pnpm@10.4.1
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . ./
RUN pnpm run build

FROM ${NODE_IMAGE} AS prod-deps
RUN npm install --global pnpm@10.4.1
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production
ENV PORT=3000
ENV INDICATOR_REPOSITORY=memory
ENV CSP_REPORT_ONLY=false
RUN apk add --no-cache wget
WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/data ./data
COPY --from=build --chown=node:node /app/package.json ./package.json
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" >/dev/null || exit 1
CMD ["node", "dist/index.js"]
