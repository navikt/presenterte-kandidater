FROM gcr.io/distroless/nodejs20-debian12
ENV NODE_ENV=production

WORKDIR /app

COPY next-logger.config.ts /app/
COPY .next/standalone /app/
COPY .next/static ./.next/static

USER nonroot

EXPOSE 3000



CMD ["server.js"]