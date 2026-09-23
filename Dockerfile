ARG BASEIMAGE
FROM ${BASEIMAGE}
ENV NODE_ENV=production

WORKDIR /app

COPY .next/standalone /app/
COPY .next/static ./.next/static

USER nonroot

EXPOSE 3000

CMD ["server.js"]
