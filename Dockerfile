FROM node:20.14.0-alpine AS base


# Install deps
FROM base AS deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    echo '//npm.pkg.github.com/:_authToken='$(cat /run/secrets/NODE_AUTH_TOKEN) >> .npmrc
RUN npm ci --legacy-peer-deps  

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build 
RUN npm run build
# RUN npm run tailwind-build


# Production image
FROM node:20.14.0-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.ts ./
# COPY --from=builder /app/public ./public           
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./


EXPOSE 3000


CMD ["npm", "start"]
