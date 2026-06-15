FROM node:22-bookworm-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json

RUN npm ci --workspace backend

COPY backend/prisma ./backend/prisma
RUN npm run prisma:generate --workspace backend

FROM deps AS build

COPY backend ./backend
RUN npm run build --workspace backend

FROM base AS runner

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY backend/prisma ./backend/prisma

RUN npm ci --omit=dev --workspace backend
RUN npm run prisma:generate --workspace backend

COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "dist/src/main.js"]